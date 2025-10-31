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
	"dbname": "supplier_db",
	"user": "postgres",
	"password": "solid",
	"host": "supplier_db",  # add when docker set up for containers
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
def suppliers_read() -> Optional[list]:
	with get_conn() as conn:
		with conn.cursor() as c:
			c.execute("""SELECT (supplier_id) FROM suppliers""")
			return c.fetchall()

def supplier_create(name: str, contact_email: str, supplier_id: Optional[str] = None) -> str:
	try:
		validate_nonempty("name", name)
		validate_nonempty("contact_email", contact_email)
		sid = gen_uuid()
		with get_conn() as conn:
			with conn.cursor() as c:
				c.execute("""
					INSERT INTO suppliers (supplier_id, name, contact_email)
					VALUES (%s, %s, %s)
				""", (sid, name, contact_email))
				conn.commit()
		return sid
	except Exception as e:
		raise Exception(f"Failed to create Supplier: {str(e)}")

def supplier_read(supplier_id: str) -> Optional[tuple]:
	with get_conn() as conn:
		with conn.cursor() as c:
			c.execute("SELECT * FROM suppliers WHERE supplier_id = %s", (supplier_id,))
			row = c.fetchall()[0]
			ret = []
			for data in row:
				ret.append(str(data))
			return ret

def supplier_update(supplier_id: str, name: str, contact_email: str) -> Optional[tuple]:
	try:
		validate_nonempty("name", name)
		validate_nonempty("contact_email", contact_email)
		with get_conn() as conn:
			with conn.cursor() as c:
				c.execute("""
					UPDATE suppliers
					SET name = %s, contact_email = %s
					WHERE supplier_id = %s
				""", (name, contact_email, supplier_id))
				conn.commit()
		return supplier_read(supplier_id)
	except Exception as e:
		raise Exception(f"Failed to update Supplier: {str(e)}")

def supplier_delete(supplier_id: str) -> None:
	with get_conn() as conn:
		with conn.cursor() as c:
			c.execute("DELETE FROM suppliers WHERE supplier_id = %s", (supplier_id,))
			conn.commit()

# association =================================================================
def supplierProduct_create(supplier_id: str, product_id: str) -> None:
	with get_conn() as conn:
		with conn.cursor() as cur:
			cur.execute("""
				INSERT INTO supplier_products (supplier_id, product_id)
				VALUES (%s, %s)
				ON CONFLICT DO NOTHING
			""", (supplier_id, product_id))
			conn.commit()

def supplierProducts_read(supplier_id: str) -> Optional[list]:
	with get_conn() as conn:
		with conn.cursor() as cur:
			cur.execute("""
				SELECT product_id
				FROM supplier_products
				WHERE supplier_id = %s
			""", (supplier_id,))
			results = []
			for row in cur.fetchall():
				product_id, name, price_decimal = row
				price_str = str(price_decimal) 
				results.append((product_id, name, price_str))
			return results

def supplierProduct_delete(product_id: str, supplier_id: Optional[str] = None) -> None:
	with get_conn() as conn:
		with conn.cursor() as cur:
			if (supplier_id == None):
				cur.execute("""
					DELETE FROM supplier_products 
					WHERE product_id = %s
				""", (product_id))
			else:
				cur.execute("""
					DELETE FROM supplier_products
					WHERE supplier_id = %s AND product_id = %s
				""", (supplier_id, product_id))
			conn.commit()

# http server config ==========================================================
class Supplier(BaseModel):
	name: str
	contact: str

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

@app.get("/")
def read_suppliers(s_id: Optional[str] = None):
	if (s_id is None or s_id == ""):
		data = suppliers_read()
		return {"suppliers": data}
	data = supplier_read(s_id)
	return {"supplier": data}

@app.put("/{s_id}")
def update_supplier(s_id: str, sup: Supplier):
	try:
		data = supplier_update(s_id, sup.name, sup.contact)
	except Exception as ex:
		raise HTTPException(status_code=400, detail=ex)
	return {"supplier": data}

@app.post("/")
def create_supplier(sup: Supplier):
	try:
		data = supplier_create(sup.name, sup.contact)
	except Exception as ex:
		raise HTTPException(status_code=400, detail=ex)
	return {"s_id": data}

@app.delete("/{s_id}")
def delete_supplier(s_id: str):
	supplier_delete(s_id)

# get suppliers products
@app.get("/{s_id}/products/")
def read_products(s_id: str):
	data = supplierProducts_read(s_id)
	return {"products": data}

# associate product with supplier
@app.post("/{s_id}/products/{p_id}")
def associate_product(s_id: str, p_id: str):
	supplierProduct_create(s_id, p_id)

# disassociate product with supplier
@app.delete("/{s_id}/products/{p_id}")
def delete_association(s_id: str, p_id: str):
	supplierProduct_delete(p_id, s_id)

# dissasociate product with all suppliers
@app.delete("/products/{p_id}")
def delete_product(p_id: str):
	supplierProduct_delete(p_id)