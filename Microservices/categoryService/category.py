# fastapi run product.py --host 0.0.0.2 --port 80

from typing import Optional
import psycopg2
from contextlib import contextmanager
import uuid
from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import json

# database connection =========================================================
DB_PORT = 5432
DB_CONFIG = {
	"dbname": "category_db",
	"user": "postgres",
	"password": "solid",
	"host": "category_db",  # add when docker set up for containers
	"port": DB_PORT
}

@contextmanager
def get_conn():
	conn = psycopg2.connect(**DB_CONFIG)
	try:
		yield conn
	finally:
		conn.close()

# validation functions ========================================================
def gen_uuid():
	return str(uuid.uuid4())

def validate_nonempty(field_name: str, value: str):
	if value is None:
		raise ValueError(f"{field_name} cannot be None.")
	value = str(value).strip()
	if not value:
		raise ValueError(f"{field_name} must be a non-empty string.")

def validate_positive(field_name: str, value):
	if not isinstance(value, (int, float)) or value <= 0:
		raise Exception(f"{field_name} must be a positive number.")

def validate_nonnegative(field_name: str, value):
	if not isinstance(value, int) or value < 0:
		raise Exception(f"{field_name} must be a non-negative integer.")

# database functions ==========================================================
def categories_read() -> Optional[list]:
	with get_conn() as conn:
		with conn.cursor() as c:
			c.execute("""SELECT (category_id) FROM categories""")
			return c.fetchall()

def category_create(name: str, description: Optional[str]) -> str:
    try:
        validate_nonempty("name", name)
        if description is not None:
            validate_nonempty("description", description)
        cid = gen_uuid()
        with get_conn() as conn:
            with conn.cursor() as c:
                c.execute("""
                    INSERT INTO categories (category_id, name, description)
                    VALUES (%s, %s, %s)
                """, (cid, name, description))
                conn.commit()
        return cid
    except Exception as e:
        raise Exception(f"Failed to create category: {str(e)}")

def category_read(category_id: str) -> Optional[tuple]:
    with get_conn() as conn:
        with conn.cursor() as c:
            c.execute("SELECT * FROM categories WHERE category_id = %s", (category_id,))
            row = c.fetchall()[0]
            ret = []
            for data in row:
                ret.append(str(data))
            return ret

def category_update(category_id: str, name: str, description: str) -> Optional[tuple]:
    try:
        validate_nonempty("name", name)
        if description is not None:
            validate_nonempty("description", description)
        with get_conn() as conn:
            with conn.cursor() as c:
                c.execute("""
                    UPDATE categories
                    SET name = %s, description = %s
                    WHERE category_id = %s
                """, (name, description, category_id))
                conn.commit()
        return category_read(category_id)
    except Exception as e:
        raise Exception(f"Failed to update category: {str(e)}")


def category_delete(category_id: str) -> None:
    with get_conn() as conn:
        with conn.cursor() as c:
            c.execute("DELETE FROM categories WHERE category_id = %s", (category_id,))
            conn.commit()

# association =================================================================
def categoryProducts_create(category_id: str, product_id: str) -> None:
    with get_conn() as conn:
        with conn.cursor() as cur:
            cur.execute("""
                INSERT INTO category_products (category_id, product_id)
                VALUES (%s, %s)
                ON CONFLICT DO NOTHING
            """, (category_id, product_id))
            conn.commit()

def categoryProducts_read(category_id: str) -> Optional[list]:
    with get_conn() as conn:
        with conn.cursor() as cur:
            cur.execute("""
                SELECT p.product_id, p.name, p.price
                FROM category_products cp
                JOIN products p ON cp.product_id = p.product_id
                WHERE cp.category_id = %s
            """, (category_id,))
            results = []
            for row in cur.fetchall():
                product_id, name, price_decimal = row

                price_str = str(price_decimal) 
                
                results.append((product_id, name, price_str))
                
            return results

def categoryProducts_delete(category_id: str, product_id: str) -> None:
    with get_conn() as conn:
        with conn.cursor() as cur:
            cur.execute("""
                DELETE FROM category_products
                WHERE category_id = %s AND product_id = %s
            """, (category_id, product_id))
            conn.commit()

# http server config ==========================================================
class Category(BaseModel):
	name: str
	description: str

app = FastAPI()

origins = ["http://localhost:5173"]

app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_methods=["*"],
        allow_headers=["*"],
)

@app.get("/{c_id}")
async def read_category(c_id: Optional[str] = None):
	if (c_id is None):
		return {"c_id": "empty"}
	return {"c_id": c_id}

@app.put("/{c_id}")
async def update_category(c_id: str, cat: Category):
	return {"category": cat}
	try:
		data = await category_update(c_id, cat.name, cat.description)
	except Exception as ex:
		raise HTTPException(status_code=400, detail=ex)
	return {"category": data}

@app.post("/")
async def create_category(cat: Category):
	return {"category": cat}
	try:
		data = await category_create(cat.name, cat.description)
	except Exception as ex:
		raise HTTPException(status_code=400, detail=ex)
	return {"c_id": data}

@app.delete("/{c_id}")
async def delete_image(c_id: str):
	return {"c_id": c_id}

@app.delete("/product/{p_id}")
async def delete_association(p_id: str):
	return {"p_id": p_id}

@app.post("/{c_id}")
async def associate_product(c_id: str, p_id: str):
	return {"c_id": c_id, "p_id": p_id}