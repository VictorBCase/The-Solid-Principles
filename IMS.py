"""
IMS.py - Inventory Management System (Monolithic)

The Solid Principles - Ricardo Olazabal, Victor Boyd, Michael Warner

"""
import sqlite3 #Python SQL Library
import argparse #Python Parser Library
from typing import Optional
import uuid
import decimal

# ------------------------- FUNCTIONS ---------------------------

# Generate UUID given an optional input. Note that UUID retrurns strings
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

    ----------- JOIN TABLES (not added yet but we need one for product suppliers and product categories I think??) ------------
                    
                    



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

    conn.execute("") #sql code to be added here once other functions done
    conn.commit()
    return pid

# SUPPLIER CREATE: UUID, Name, Contact
def supplier_create(conn: sqlite3.Connection, name: str, contact_email: str, supplier_id: Optional[str] = None) -> str:
    sid = gen_uuid(supplier_id)
   
    conn.execute("") #sql code to be added here once other functions done
    conn.commit()
    return sid


# CATEGORY CREATE: UUID, Name, Description
def category_create(conn: sqlite3.Connection, name: str, description: Optional[str], category_id: Optional[str]=None) -> str:
    cid = gen_uuid(category_id)
   
    conn.execute("") #sql code to be added here once other functions done
    conn.commit()
    return cid





#---------------- CLI ARGUMENT PARSER -------------------
 
# Arguments to be Parsed in CLI:
#   Create
#   Read
#   Update
#   Delete

# CLI in hierarchy (Ex: Product --> Create,Read,etc.) using subparsers

def parse_arguments(): 
    
    parser = argparse.ArgumentParser(description="IMS Monolithic CLI")
    # parser.add_argument('--dataBaseFile', default=, help="")  <-- when database is finished put the name in default
    subparsers = parser.add_subparsers(dest='operation', required=True) # not very familiar with python subparsers - feel free to change this

    # PRODUCT
    product = subparsers.add_parser('product', help='Product operations')
    productSP = product.add_subparsers(dest='op', required=True)

    product_create = productSP.add_parser('create', help='Create a product') 
    product_create.add_argument('--id', help='Will generate random UUID if left blank')
    product_create.add_argument('--name', required=True)
    product_create.add_argument('--description')
    product_create.add_argument('--quantity', required=True, type=int)
    product_create.add_argument('--price', required=True)
    

    # SUPPLIER

    # CATEGORY

    # IMAGE


# ---------------- MAIN ----------------------
def main():
    args = parse_arguments()
    connection = sqlite3.connect(args.dataBaseFile)
    init_database(connection)