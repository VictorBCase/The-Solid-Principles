"""
IMS.py - Inventory Management System (Monolithic)

The Solid Principles - Ricardo Olazabal, Victor Boyd, Michael Warner

"""
import sqlite3 #Python SQL Library
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




# ---------------- MAIN ----------------------
def main():
    connection = sqlite3.connect("") #Add db file name to quotes when db created.
    init_database(connection)

    print("Welcome to The Solid Principles' Monolithic Inventory Management System")
    print("Type help or ? to list commands.")

    while True:
        try:
            command = input(">>> ").strip()

            if command in ("exit", "quit"):
                print("Terminating session.")
                break
            elif command == "help":
                print("Available commands: help, create, read, update, delete, exit, quit")
            elif command == "create":
                print("What type of record do you want to create: product, supplier, category, image")
                create_type = input(">>> ").strip()
                match create_type:
                    case "product":
                        print("Enter product name: ")
                        name = input(">>> ").strip()
                        print("\nEnter product description: ")
                        desc = input(">>> ").strip()
                        quant = -1
                        while quant == -1:
                            print("\nEnter product quantity: ")
                            quant_string = input(">>> ").strip()
                            try:
                                quant = int(quant_string)
                            except ValueError:
                                print("\nERR: You must enter an integer for quantity.")
                        print("\nEnter product price: ")
                        price = input(">>> ").strip()
                        pid = product_create(connection, name, desc, quant, price)
                        print("New product id: " + pid)
                    case "supplier":
                        print("Enter supplier name: ")
                        name = input(">>> ").strip()
                        print("\nEnter supplier's email:")
                        email = input(">>> ").strip()
                        pid = supplier_create(connection, name, email)
                        print("New supplier id: " + pid)
                    case "category":
                        print("Enter category name: ")
                        name = input(">>> ").strip()
                        print("\nEnter cateogry description: ")
                        desc = input(">>> ").strip()
                        pid = category_create(connection, name, desc)
                        print("New category id: " + pid)
                    case "image":
                        print("Enter product id: ")
                        prod_id = input(">>> ").strip()
                        print("\nEnter image URL: ")
                        url = input(">>> ").strip()
                        #Uncomment once image creation function is complete.
                        #pid = image_create(connection, prod_id, url)
                        #print("New image id: " + pid)
            elif command == "read":
                print("Not yet implemented")
            elif command == "update":
                print("Not yet implemented")
            elif command == "delete":
                print("Not yet implemented")
            else:
                print("ERR: Invalid command.")
        except KeyboardInterrupt:
            print("\nGoodbye!")
            break

if __name__ == "__main__":
    main()