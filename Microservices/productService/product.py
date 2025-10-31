# fastapi run product.py --host 0.0.0.0 --port 80

from typing import Optional
import psycopg2
from contextlib import contextmanager
import uuid
from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
# import requests
import json

# URLs ========================================================================
supplier_url = "http://0.0.0.1:8080/"
category_url = "http://0.0.0.2:8080/"

# database connection =========================================================
DB_PORT = 5432
DB_CONFIG = {
	"dbname": "productDB",
	"user": "postgres",
	"password": "solid",
	"host": "data",  # add when docker set up for containers
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
def products_read() -> Optional[list]:
	with get_conn() as conn:
		with conn.cursor() as c:
			c.execute("""SELECT (product_id) FROM products""")
			return c.fetchall()

def product_create(name: str, description: Optional[str], quantity: int, price: str) -> str:
	try:
		validate_nonempty("name", name)
		if description is not None:
			validate_nonempty("description", description)
		validate_nonnegative("quantity", quantity)
		validate_positive("price", float(price))
		pid = gen_uuid()
		with get_conn() as conn:
			with conn.cursor() as c:
				c.execute("""
					INSERT INTO products (product_id, name, description, quantity, price)
					VALUES (%s, %s, %s, %s, %s)
				""", (pid, name, description, quantity, price))
				conn.commit()
		return pid

	except Exception as e:
		raise Exception(f"Failed to create product: {str(e)}")

def product_read(product_id: str) -> Optional[tuple]:
	with get_conn() as conn:
		with conn.cursor() as c:
			c.execute("""SELECT * FROM products WHERE product_id = %s""", (product_id,))
			row = c.fetchall()[0]
			ret = []
			for data in row:
				ret.append(str(data))
			return ret

def product_update(product_id: str, name: str, description: str, quantity: int, price: str) -> Optional[tuple]:
	try:
		validate_nonempty("name", name)
		if description is not None:
			validate_nonempty("description", description)
		validate_nonnegative("quantity", quantity)
		validate_positive("price", float(price))
		with get_conn() as conn:
			with conn.cursor() as c:
				c.execute("""
					UPDATE products
					SET name = %s, description = %s, quantity = %s, price = %s
					WHERE product_id = %s
				""", (name, description, quantity, price, product_id))
				conn.commit()
		return product_read(product_id)
	except Exception as e:
		raise Exception(f"Failed to update product: {str(e)}")  

def product_delete(product_id: str) -> None:
	with get_conn() as conn:
		with conn.cursor() as c:
			c.execute("DELETE FROM products WHERE product_id = %s", (product_id,))
			conn.commit()

# http server config ==========================================================
class Product(BaseModel):
	name: str
	description: str
	quantity: int
	price: str

app = FastAPI()

origins = ["http://localhost:5173"]

app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_methods=["*"],
        allow_headers=["*"],
)

@app.get("/")
async def read_products(p_id: Optional[str] = None):
    if (p_id is None):
        return {"p_id": "empty"} # return list
    return {"p_id": p_id} # return product

@app.put("/{p_id}")
async def update_product(p_id: str, prod: Product):
    return {"product": prod}
	#try:
	#	data = await product_update(p_id, prod.name, prod.description, prod.quantity, prod.price)
	#except Exception as ex:
	#	raise HTTPException(status_code=400, detail=ex)
	#return {"product": data}

@app.post("/")
async def create_product(prod: Product):
    return {"product": prod}
	#try:
	#	data = await product_create(prod.name, prod.description, prod.quantity, prod.price)
	#except Exception as ex:
	#	raise HTTPException(status_code=400, detail=ex)
	#return {"p_id": data}

@app.delete("/{p_id}")
def delete_product(p_id: str):
    return {"p_id": p_id}
	#product_delete(p_id)
