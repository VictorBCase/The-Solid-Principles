"""
IMS.py - Inventory Management System (Monolithic)

The Solid Principles - Ricardo Olazabal, Victor Boyd, Michael Warner

"""
import sqlite3 #Python SQL Library
from typing import Optional
import uuid

# QUERIES

add_product = "INSERT INTO products(product_id, name, description, quantity, price) VALUES(?, ?, ?, ?, ?)"
add_supplier = "INSERT INTO suppliers(supplier_id, name, contact_email) VALUES(?, ?, ?)"
add_category = "INSERT INTO categories(category_id, name, description) VALUES(?, ?, ?)"
add_image = "INSERT INTO images(image_id, product_id, url) VALUES(?, ?, ?)"

get_product = "SELECT * FROM products WHERE product_id = ?" 
get_supplier = "SELECT * FROM suppliers WHERE supplier_id = ?"
get_category = "SELECT * FROM categories WHERE category_id = ?"
get_image = "SELECT * FROM images WHERE image_id = ?"

update_product = "UPDATE products SET name = ?, description = ?, quantity = ?, price = ? WHERE product_id = ?"
update_supplier = "UPDATE suppliers SET name = ?, contact_email = ? WHERE supplier_id = ?"
update_category = "UPDATE categories SET name = ?, description = ? WHERE category_id = ?"
update_image = "UPDATE images SET product_id = ?, url = ? WHERE image_id = ?"

delete_product = "DELETE FROM products WHERE product_id = ?"
delete_supplier = "DELETE FROM suppliers WHERE supplier_id = ?"
delete_category = "DELETE FROM categories WHERE category_id = ?"
delete_image = "DELETE FROM images WHERE image_id = ?"


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
def init_database(conn: sqlite3.Connection):
    c = conn.cursor()
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
    conn.commit()

# -------------------- CRUD Operations --------------------

# All record types should allow CRUD operations:
#   Create record, which generates a UUID if not provided and returns this ID; 
#   Read record, requiring the record ID; 
#   Update, also requiring the ID to modify attributes;
#   Delete, which requires the ID to remove the entity.


# PRODUCT CREATE: UUID, Name, Description, Quantity, Price 
def product_create(conn: sqlite3.Connection, name: str, description: Optional[str], quantity: int, price: str, product_id: Optional[str] = None) -> str:
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
def category_create(conn: sqlite3.Connection, name: str, description: Optional[str], category_id: Optional[str] = None) -> str:
    cid = gen_uuid(category_id)
    c = conn.cursor()
    data = [cid, name, description]
    c.executemany(add_category, (data,)) #sql code to be added here once other functions done
    c.close()
    conn.commit()
    return cid

# IMAGE CREATE: UUID, ProductID, Url
def image_create(conn: sqlite3.Connection, product_id: str, url: str, image_id: Optional[str] = None) -> str:
    iid = gen_uuid(image_id)
    c = conn.cursor()
    data = [iid, product_id, url]
    c.executemany(add_image, (data,))
    c.close()
    conn.commit()
    return iid

# PRODUCT READ
def product_read(conn: sqlite3.Connection, product_id: str) -> str:
    c = conn.cursor() 
    c.execute(get_product, (product_id,))
    row = c.fetchone()
    c.close()
    return str(row)

# SUPPLIER READ
def supplier_read(conn: sqlite3.Connection, supplier_id: str) -> str:
    c = conn.cursor()
    c.execute(get_supplier, (supplier_id,))
    row = c.fetchone()
    c.close()
    return str(row)

# CATEGORY READ
def category_read(conn: sqlite3.Connection, category_id: str) -> str:
    c = conn.cursor()
    c.execute(get_category, (category_id,))
    row = c.fetchone()
    c.close()
    return str(row)

# IMAGE READ
def image_read(conn: sqlite3.Connection, image_id: str) -> str:
    c = conn.cursor()
    c.execute(get_image, (image_id,))
    row = c.fetchone()
    c.close()
    return str(row)

# PRODUCT UPDATE
def product_update(conn: sqlite3.Connection, product_id: str, name: str, description: str, quantity: int, price: str) -> str:
    c = conn.cursor()
    data = [name, description, quantity, price, product_id]
    c.executemany(update_product, (data,))
    c.close()
    conn.commit()
    return product_read(conn, str(product_id))

# SUPPLIER UPDATE
def supplier_update(conn: sqlite3.Connection, supplier_id: str, name: str, contact_email: str) -> str:
    c = conn.cursor()
    data = [name, contact_email, supplier_id]
    c.executemany(update_supplier, (data,))
    c.close()
    conn.commit()
    return supplier_read(conn, str(supplier_id))

# CATEGORY UPDATE
def category_update(conn: sqlite3.Connection, category_id: str, name: str, description: str) -> str:
    c = conn.cursor()
    data = [name, description, category_id]
    c.executemany(update_category, (data,))
    c.close()
    conn.commit()
    return category_read(conn, str(category_id))

# PRODUCT DELETE
def product_delete(conn: sqlite3.Connection, product_id: str) -> None:
    c = conn.cursor()
    c.execute(delete_product, (product_id,))
    conn.commit()
    c.close()

# SUPPLIER DELETE
def supplier_delete(conn: sqlite3.Connection, supplier_id: str) -> None:
    c = conn.cursor()
    c.execute(delete_supplier, (supplier_id,))
    conn.commit()
    c.close()

# CATEGORY DELETE
def category_delete(conn: sqlite3.Connection, category_id: str) -> None:
    c = conn.cursor()
    c.execute(delete_category, (category_id,))
    conn.commit()
    c.close()

# IMAGE DELETE
def image_delete(conn: sqlite3.Connection, image_id: str) -> None:
    c = conn.cursor()
    c.execute(delete_image, (image_id,))
    conn.commit()
    c.close()



#---------------- CLI ARGUMENT PARSER -------------------
 
# Arguments to be Parsed in CLI:
#   Create
#   Read
#   Update
#   Delete

# ---------------- MAIN ----------------------

def main():
    print("Welcome to The Solid Principles' Monolithic Inventory Management System")
    print("Type help or ? to list commands.")

    while True:
        try:
            with sqlite3.connect("IMS.db") as conn:
                init_database(conn)

                command = input(">>> ").strip()
    
                if command in ("exit", "quit"):
                    print("Terminating session.")
                    break
                elif command == "help" or command == "?":
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
                            pid = product_create(conn, name, desc, quant, price)
                            print("New product id: " + pid)
                        case "supplier":
                            print("Enter supplier name: ")
                            name = input(">>> ").strip()
                            print("\nEnter supplier's email:")
                            email = input(">>> ").strip()
                            sid = supplier_create(conn, name, email)
                            print("New supplier id: " + sid)
                        case "category":
                            print("Enter category name: ")
                            name = input(">>> ").strip()
                            print("\nEnter cateogry description: ")
                            desc = input(">>> ").strip()
                            cid = category_create(conn, name, desc)
                            print("New category id: " + cid)
                        case "image":
                            print("Enter product id: ")
                            prod_id = input(">>> ").strip()
                            print("\nEnter image URL: ")
                            url = input(">>> ").strip()
                            iid = image_create(conn, prod_id, url)
                            print("New image id: " + iid)
                elif command == "read":
                    print("What type of record do you want to read: product, supplier, category, image")
                    read_type = input(">>> ").strip()
                    match read_type:
                        case "product":
                            print("Enter product id: ")
                            prod_id = input(">>> ").strip()
                            print(product_read(conn, prod_id))
                        case "supplier":
                            print("Enter supplier id: ")
                            sup_id = input(">> ").strip()
                            print(supplier_read(conn, sup_id))
                        case "category":
                            print("Enter category id: ")
                            cat_id = input(">>> ").strip()
                            print(category_read(conn, cat_id))
                        case "image":
                            print("Enter image id: ")
                            img_id = input(">>> ").strip()
                            print(image_read(conn, img_id))
                elif command == "update":
                    print("Not yet implemented")
                elif command == "delete":
                    print("Not yet implemented")
                else:
                    print("ERR: Invalid command.")
        except KeyboardInterrupt:
            print("\nGoodbye!")
            break
        except sqlite3.OperationalError as error:
            print("\nCould not open database!")
            break

if __name__ == "__main__":
    main()

