"""
IMS.py - Inventory Management System (Monolithic)

The Solid Principles - Ricardo Olazabal, Victor Boyd, Michael Warner

"""
import sqlite3
from typing import Optional
import uuid

# QUERIES

create_prod_table = "CREATE TABLE products(pID, name, description, quantity, price)";
create_cat_table = "CREATE TABLE categories(cID, name, description)";
create_sup_table = "CREATE TABLE suppliers(sID, name, contact)";
create_img_table = "CREATE TABLE images(iID, pID, url)";
create_catProd_table = "CREATE TABLE categoryProducts(cID, pID)";
create_supProd_table = "CREATE TABLE supplierProducts(sID, pID)";

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

try:
    with sqlite3.connect("IMS.db") as connection:
        cursor = connection.cursor()

        pass
except sqlite3.OperationalError as error:
    print("Failed to open database:", e)
