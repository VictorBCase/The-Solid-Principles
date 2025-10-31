from typing import Optional
import psycopg2
from contextlib import contextmanager
import uuid
from fastapi import FastAPI, Request, HTTPException, Response
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import json

# database connection =========================================================
DB_CONFIG = {
    "dbname": "category_db",
    "user": "postgres",
    "password": "solid",
    "host": "category_db",  # add when docker set up for containers
    "port": 5432
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
                SELECT (product_id)
                FROM category_products
                WHERE category_id = %s
            """, (category_id))
            rows = cur.fetchall()
            ret = []
            for data in rows:
                ret.append(data)
            return ret

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

app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_methods=["*"],
        allow_headers=["*"]
)

@app.options("/")
def preflight_handler():
    headers = {
        "Access-Control-Allow-Origin": "http://localhost:5173",
        "Access-Control-Allow-Methods": "POST, GET, PUT, DELETE",
        "Access-Control-Allow-Headers": "Content-Type",
    }
    return Response(status_code=200, headers=headers)

@app.get("/{c_id}")
def read_category(c_id: Optional[str] = None):
    if c_id is None or c_id.strip() == "": #check for invalid input
        raise HTTPException(status_code=400, detail="Category ID cannot be empty.")
    try:
        data = category_read(c_id)
        return {"category": data}
    except Exception as ex:
        raise HTTPException(status_code=400, detail=str(ex))

@app.put("/{c_id}")
def update_category(c_id: str, cat: Category):
    #return {"category": cat}
    try:
        data = category_update(c_id, cat.name, cat.description)
    except Exception as ex:
        raise HTTPException(status_code=400, detail=str(ex))
    return {"category": data}

@app.post("/")
def create_category(cat: Category):
    #return {"category": cat}
    try:
        data = category_create(cat.name, cat.description)
    except Exception as ex:
        raise HTTPException(status_code=400, detail=str(ex))
    return {"c_id": data}

@app.delete("/{c_id}")
def delete_category(c_id: str):
    try:
        category_delete(c_id)
        return {"deleted": c_id}
    except Exception as ex:
        raise HTTPException(status_code=400, detail=str(ex))

# ASSOCIATIONS =================================================
app.delete("/{c_id}/product/{p_id}")
def delete_association(c_id: str, p_id: str):
    try:
        categoryProducts_delete(c_id, p_id)
        return {"message": f"Product {p_id} deassociated from category {c_id}"}
    except Exception as ex:
        raise HTTPException(status_code=400, detail=str(ex))

@app.post("/{c_id}/product/{p_id}")
def associate_product(c_id: str, p_id: str):
    try:
        categoryProducts_create(c_id, p_id)
        return {"message": f"Product {p_id} associated to category {c_id}"}
    except Exception as ex:
        raise HTTPException(status_code=400, detail=str(ex))