"""
IMS.py - Inventory Management System (Monolithic)

The Solid Principles - Ricardo Olazabal, Victor Boyd, Michael Warner

"""
import sqlite3
from typing import Optional
import uuid

# queries -> i think its best to define them up here

add_product = "INSERT INTO products(product_id, name, description, quantity, price)
                VALUES(?, ?, ?, ?, ?)"
add_supplier = "INSERT INTO suppliers(supplier_id, name, contact_email)
                VALUES(?, ?, ?)"
add_category = "INSERT INTO categories(category_id, name, description)
                VALUES(?, ?, ?)"
add_image = "INSERT INTO images(image_id, product_id, url)
                 VALUES(?, ?, ?)"
get_product = "SELECT * FROM products WHERE product_id = ?" 

get_supplier = "SELECT * FROM suppliers WHERE supplier_id = ?"

get_category = "SELECT * FROM categories WHERE category_id = ?"

# ------------------------- FUNCTIONS ---------------------------

# Generate UUID given an optional input.
def gen_uuid(s: Optional[str] = None) -> str:
    if s:
        try:
            return str(uuid.UUID(s))
        except Exception:
            raise ValueError(f"Invalid UUID provided: {s}")
    #Auto generate UUID if not provided input
    return str(uuid.uuid4())

# -------------------------- DATABASE --------------------------
# Database using sqlite library
def init_database(connection: sqlite3.Connection):
    c = connection.cursor()
    c.execute("PRAGMA foreign_keys = ON;") # This line turns on foreign key constraints
    
    # TABLES: Products, Suppliers, Categories, Images - in order
    c.executescript(""" 
    CREATE TABLE IF NOT EXISTS products (
        product_id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        quantity INTEGER NOT NULL CHECK(quantity >= 0),
        price TEXT NOT NULL  -- NOTE: doesn't allow decimal, need function to check value there I think
    );

    CREATE TABLE IF NOT EXISTS suppliers (
        supplier_id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        contact_email TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS categories (
        category_id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT
    );

    CREATE TABLE IF NOT EXISTS images (
        image_id TEXT PRIMARY KEY,
        product_id TEXT NOT NULL,
        url TEXT NOT NULL,
        FOREIGN KEY(product_id) REFERENCES products(product_id) ON DELETE CASCADE
    );
    
    CREATE TABLE IF NOT EXISTS categoryProducts (
    	category_id TEXT,
    	product_id TEXT,
        PRIMARY KEY (category_id, product_id),
    	FOREIGN KEY(category_id) REFERENCES categories(category_id) ON DELETE CASCADE,
    	FOREIGN KEY(product_id) REFERENCES products(product_id) ON DELETE CASCADE
    );
    
    CREATE TABLE IF NOT EXISTS supplierProducts (
    	supplier_id TEXT,
    	product_id TEXT,
        PRIMARY KEY (supplier_id, product_id),
    	FOREIGN KEY(supplier_id) REFERENCES suppliers(supplier_id) ON DELETE CASCADE,
    	FOREIGN KEY(product_id) REFERENCES products(product_id) ON DELETE CASCADE
    );                    
                    



    """)
    connection.commit()


# -------------------- CRUD Operations --------------------

# All record types should allow CRUD operations:
#   Create record, which generates a UUID if not provided and returns this ID; 
#   Read record, requiring the record ID; 
#   Update, also requiring the ID to modify attributes;
#   Delete, which requires the ID to remove the entity.


# PRODUCT CREATE: UUID, Name, Description, Quantity, Price 
def product_create(conn: sqlite3.Connection, name: str, description: Optional[str], quantity: int, price: str, product_id: Optional[str]=None) -> str:
    pid = gen_uuid(product_id)
    c = conn.cursor()
    data = [pid, name, description, quantity, price]
    c.executemany(add_product, (data,)) #sql code to be added here once other functions done
    c.close()
    conn.commit()
    return pid

# SUPPLIER CREATE: UUID, Name, Contact
def supplier_create(conn: sqlite3.Connection, name: str, contact_email: str, supplier_id: Optional[str] = None) -> str:
    sid = gen_uuid(supplier_id)
    c = conn.cursor()
    data = [sid, name, contact_email]
    c.executemany(add_supplier, (data,)) #sql code to be added here once other functions done
    c.close()
    conn.commit()
    return sid


# CATEGORY CREATE: UUID, Name, Description
def category_create(conn: sqlite3.Connection, name: str, description: Optional[str], category_id: Optional[str]=None) -> str:
    cid = gen_uuid(category_id)
    c = conn.cursor()
    data = [cid, name, description]
    c.executemany(add_category, (data,)) #sql code to be added here once other functions done
    c.close()
    conn.commit()
    return cid

def product_read(conn: sqlite3.Connection, product_id: str) -> str:
    c = conn.cursor() 
    c.execute(get_product, (product_id,))
    row = c.fetchone()
    c.close()
    return row

def supplier_read(conn: sqlite3.Connection, supplier_id: str) -> str:
    c = conn.cursor()
    c.execute(get_supplier, (supplier_id,))
    row = c.fetchone()
    c.close()
    return row

def category_read(conn: sqlite3.Connection, category_id: str) -> str:
    c = conn.cursor()
    c.execute(get_category, (supplier_id,))
    row = c.fetchone()
    c.close()
    return row

#

try:
    with sqlite3.connect("IMS.db") as conn:
        init_database(conn)
        out = product_create(conn, "laptop", "portable computer", 1, "100")
        print(product_read(conn, str(out)))
        pass
except sqlite3.OperationalError as error:
    print("Failed to open/modify database:", error)
