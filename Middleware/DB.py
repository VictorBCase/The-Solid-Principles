# DB.py - database python code
# pip install psycopg2-binary to install dependencies for psycopg - python library for postgresql

from typing import Optional
from xmlrpc.server import SimpleXMLRPCServer
import psycopg2
from contextlib import contextmanager
import uuid

DB_CONFIG = {
    "dbname": "IMS Local", # DB Name
    "user": "postgres",
    "password": "solid", # DB password for user postgres
    "host": "",  # add when docker set up for containers
    "port": 5433 # Postgresql port (otherwise try 5432)
}

# Using contextmanager to handle database connection
@contextmanager
def get_conn():
    conn = psycopg2.connect(**DB_CONFIG)
    try:
        yield conn
    finally:
        conn.close()

# ========================= HELPER METHODS =========================

# Generate UUID
def gen_uuid():
    return str(uuid.uuid4())

# ============================ LIST FUNCTIONS ============================

def products_read() -> Optional[list]:
	with get_conn() as conn:
		with conn.cursor() as c:
			c.execute("""SELECT (product_id) FROM products""")
			return c.fetchall()


def suppliers_read() -> Optional[list]:
	with get_conn() as conn:
		with conn.cursor() as c:
			c.execute("""SELECT (supplier_id) FROM suppliers""")
			return c.fetchall()


def categories_read() -> Optional[list]:
	with get_conn() as conn:
		with conn.cursor() as c:
			c.execute("""SELECT (category_id) FROM categories""")
			return c.fetchall()


def images_read() -> Optional[list]:
	with get_conn() as conn:
		with conn.cursor() as c:
			c.execute("""SELECT (image_id) FROM images""")
			return c.fetchall()


# ========================== CRUD FUNCTIONS ==================================

#  PRODUCT CRUD
def product_create(name: str, description: Optional[str], quantity: int, price: str, product_id: Optional[str] = None) -> str:
    pid = gen_uuid(product_id)
    with get_conn() as conn:
        with conn.cursor() as c:
            c.execute("""
                INSERT INTO products (product_id, name, description, quantity, price)
                VALUES (%s, %s, %s, %s, %s)
            """, (pid, name, description, quantity, price))
            conn.commit()
    return pid


def product_read(product_id: str) -> Optional[tuple]:
    with get_conn() as conn:
        with conn.cursor() as c:
            c.execute("SELECT * FROM products WHERE product_id = %s", (product_id,))
            return c.fetchone()


def product_update(product_id: str, name: str, description: str, quantity: int, price: str) -> Optional[tuple]:
    with get_conn() as conn:
        with conn.cursor() as c:
            c.execute("""
                UPDATE products
                SET name = %s, description = %s, quantity = %s, price = %s
                WHERE product_id = %s
            """, (name, description, quantity, price, product_id))
            conn.commit()
    return product_read(product_id)


def product_delete(product_id: str) -> None:
    with get_conn() as conn:
        with conn.cursor() as c:
            c.execute("DELETE FROM products WHERE product_id = %s", (product_id,))
            conn.commit()


#  SUPPLIER CRUD
def supplier_create(name: str, contact_email: str, supplier_id: Optional[str] = None) -> str:
    sid = gen_uuid(supplier_id)
    with get_conn() as conn:
        with conn.cursor() as c:
            c.execute("""
                INSERT INTO suppliers (supplier_id, name, contact_email)
                VALUES (%s, %s, %s)
            """, (sid, name, contact_email))
            conn.commit()
    return sid


def supplier_read(supplier_id: str) -> Optional[tuple]:
    with get_conn() as conn:
        with conn.cursor() as c:
            c.execute("SELECT * FROM suppliers WHERE supplier_id = %s", (supplier_id,))
            return c.fetchone()


def supplier_update(supplier_id: str, name: str, contact_email: str) -> Optional[tuple]:
    with get_conn() as conn:
        with conn.cursor() as c:
            c.execute("""
                UPDATE suppliers
                SET name = %s, contact_email = %s
                WHERE supplier_id = %s
            """, (name, contact_email, supplier_id))
            conn.commit()
    return supplier_read(supplier_id)


def supplier_delete(supplier_id: str) -> None:
    with get_conn() as conn:
        with conn.cursor() as c:
            c.execute("DELETE FROM suppliers WHERE supplier_id = %s", (supplier_id,))
            conn.commit()


#  CATEGORY CRUD
def category_create(name: str, description: Optional[str], category_id: Optional[str] = None) -> str:
    cid = gen_uuid(category_id)
    with get_conn() as conn:
        with conn.cursor() as c:
            c.execute("""
                INSERT INTO categories (category_id, name, description)
                VALUES (%s, %s, %s)
            """, (cid, name, description))
            conn.commit()
    return cid


def category_read(category_id: str) -> Optional[tuple]:
    with get_conn() as conn:
        with conn.cursor() as c:
            c.execute("SELECT * FROM categories WHERE category_id = %s", (category_id,))
            return c.fetchone()


def category_update(category_id: str, name: str, description: str) -> Optional[tuple]:
    with get_conn() as conn:
        with conn.cursor() as c:
            c.execute("""
                UPDATE categories
                SET name = %s, description = %s
                WHERE category_id = %s
            """, (name, description, category_id))
            conn.commit()
    return category_read(category_id)


def category_delete(category_id: str) -> None:
    with get_conn() as conn:
        with conn.cursor() as c:
            c.execute("DELETE FROM categories WHERE category_id = %s", (category_id,))
            conn.commit()


#  IMAGE CRUD
def image_create(product_id: str, url: str, image_id: Optional[str] = None) -> str:
    iid = gen_uuid(image_id)
    with get_conn() as conn:
        with conn.cursor() as c:
            c.execute("""
                INSERT INTO images (image_id, product_id, url)
                VALUES (%s, %s, %s)
            """, (iid, product_id, url))
            conn.commit()
    return iid


def image_read(image_id: str) -> Optional[tuple]:
    with get_conn() as conn:
        with conn.cursor() as c:
            c.execute("SELECT * FROM images WHERE image_id = %s", (image_id,))
            return c.fetchone()


def image_update(image_id: str, product_id: str, url: str) -> Optional[tuple]:
    with get_conn() as conn:
        with conn.cursor() as c:
            c.execute("""
                UPDATE images
                SET product_id = %s, url = %s
                WHERE image_id = %s
            """, (product_id, url, image_id))
            conn.commit()
    return image_read(image_id)


def image_delete(image_id: str) -> None:
    with get_conn() as conn:
        with conn.cursor() as c:
            c.execute("DELETE FROM images WHERE image_id = %s", (image_id,))
            conn.commit()


#----------------------- RELATIONSHIP TABLES CRUD --------------------------

# CATEGORY-PRODUCTS CRUD
def categoryProducts_create(category_id, product_id) -> None:
    with get_conn() as conn:
        with conn.cursor() as cur:
            cur.execute("""
                INSERT INTO category_products (category_id, product_id)
                VALUES (%s, %s)
                ON CONFLICT DO NOTHING
            """, (category_id, product_id))
            conn.commit()


def categoryProducts_read(category_id) -> Optional[list]:
    with get_conn() as conn:
        with conn.cursor() as cur:
            cur.execute("""
                SELECT p.product_id, p.name, p.price
                FROM category_products cp
                JOIN products p ON cp.product_id = p.product_id
                WHERE cp.category_id = %s
            """, (category_id,))
            return cur.fetchall()


def categoryProducts_delete(category_id, product_id) -> None:
    with get_conn() as conn:
        with conn.cursor() as cur:
            cur.execute("""
                DELETE FROM category_products
                WHERE category_id = %s AND product_id = %s
            """, (category_id, product_id))
            conn.commit()


# SUPPLIER-PRODUCTS CRUD
def supplierProducts_create(supplier_id, product_id) -> None:
    with get_conn() as conn:
        with conn.cursor() as cur:
            cur.execute("""
                INSERT INTO supplier_products (supplier_id, product_id)
                VALUES (%s, %s)
                ON CONFLICT DO NOTHING
            """, (supplier_id, product_id))
            conn.commit()


def supplierProducts_read(supplier_id) -> Optional[list]:
    with get_conn() as conn:
        with conn.cursor() as cur:
            cur.execute("""
                SELECT p.product_id, p.name, p.price
                FROM supplier_products sp
                JOIN products p ON sp.product_id = p.product_id
                WHERE sp.supplier_id = %s
            """, (supplier_id,))
            return cur.fetchall()


def supplierProducts_delete(supplier_id, product_id) -> None:
    with get_conn() as conn:
        with conn.cursor() as cur:
            cur.execute("""
                DELETE FROM supplier_products
                WHERE supplier_id = %s AND product_id = %s
            """, (supplier_id, product_id))
            conn.commit()


if __name__ == "__main__":
    server = SimpleXMLRPCServer(("0.0.0.0", 8000), allow_none=True)
    server.register_function(products_read, "products_read")
    server.register_function(suppliers_read, "suppliers_read")
    server.register_function(categories_read, "categories_read")
    server.register_function(images_read, "images_read")
    server.register_function(product_create, "product_create")
    server.register_function(product_read, "product_read")
    server.register_function(product_delete, "product_delete")
    server.register_function(product_update, "product_update")
    server.register_function(supplier_create, "supplier_create")
    server.register_function(supplier_read, "supplier_read")
    server.register_function(supplier_delete, "supplier_delete")
    server.register_function(supplier_update, "supplier_update")
    server.register_function(category_update, "category_update")
    server.register_function(category_create, "category_create")
    server.register_function(category_read, "category_read")
    server.register_function(category_delete, "category_delete")
    server.register_function(image_create, "image_create")
    server.register_function(image_read, "image_read")
    server.register_function(image_delete, "image_delete")
    server.register_function(image_update, "image_update")
    server.register_function(categoryProducts_create, "categoryProducts_create")
    server.register_function(categoryProducts_delete, "categoryProducts_delete")
    server.register_function(categoryProducts_read, "categoryProducts_read")
    server.register_function(supplierProducts_create, "supplierProducts_create")
    server.register_function(supplierProducts_read, "supplierProducts_read")
    server.register_function(supplierProducts_delete, "supplierProducts_delete")
    server.serve_forever()