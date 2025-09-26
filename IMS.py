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
add_supplierProduct = "INSERT INTO supplierProducts(supplier_id, product_id) VALUES (?, ?)"
add_categoryProduct = "INSERT INTO categoryProducts(category_id, product_id) VALUES (?, ?)"

get_product = "SELECT * FROM products WHERE product_id = ?" 
get_supplier = "SELECT * FROM suppliers WHERE supplier_id = ?"
get_category = "SELECT * FROM categories WHERE category_id = ?"
get_image = "SELECT * FROM images WHERE image_id = ?"
get_supplierProducts = "SELECT p.product_id, p.name, p.description FROM products p INNER JOIN supplierProducts sp ON p.product_id = sp.product_id WHERE sp.supplier_id = ?"
get_categoryProducts = "SELECT p.product_id, p.name, p.description FROM products p INNER JOIN categoryProducts cp ON p.product_id = cp.product_id WHERE cp.category_id = ?"
# these could be used to access these records using the product id rather than the 
#supplier/category id
get_productSuppliers = "SELECT s.supplier_id, s.name, s.contact_email FROM suppliers s INNER JOIN supplierProducts sp ON s.supplier_id = sp.supplier_id WHERE sp.product_id = ?"
get_productSuppliers = "SELECT c.category_id, c.name, c.description FROM categories c INNER JOIN categoryProducts cp ON c.category_id = cp.category_id WHERE cp.product_id = ?"

update_product = "UPDATE products SET name = ?, description = ?, quantity = ?, price = ? WHERE product_id = ?"
update_supplier = "UPDATE suppliers SET name = ?, contact_email = ? WHERE supplier_id = ?"
update_category = "UPDATE categories SET name = ?, description = ? WHERE category_id = ?"
update_image = "UPDATE images SET product_id = ?, url = ? WHERE image_id = ?"

delete_product = "DELETE FROM products WHERE product_id = ?"
delete_supplier = "DELETE FROM suppliers WHERE supplier_id = ?"
delete_category = "DELETE FROM categories WHERE category_id = ?"
delete_image = "DELETE FROM images WHERE image_id = ?"
delete_supplierProduct = "DELETE FROM supplierProducts WHERE supplier_id = ? AND product_id = ?"
delete_categoryProduct = "DELETE FROM categoryProducts WHERE category_id = ? AND product_id = ?"

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

    CREATE TRIGGER IF NOT EXISTS sp_after_del AFTER DELETE ON supplierProducts
    BEGIN
        DELETE FROM suppliers WHERE suppliers.supplier_id = OLD.supplier_id AND NOT EXISTS(
            SELECT * FROM supplierProducts sp WHERE sp.supplier_id = OLD.supplier_id
        );
    END;

    CREATE TRIGGER IF NOT EXISTS cp_after_del AFTER DELETE ON categoryProducts
    BEGIN
        DELETE FROM categories WHERE categories.category_id = OLD.category_id AND NOT EXISTS(
            SELECT * FROM categoryProducts cp WHERE cp.category_id = OLD.category_id
        );
    END;

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
def supplier_create(conn: sqlite3.Connection, product_id: str, name: str, contact_email: str, supplier_id: Optional[str] = None) -> str:
    sid = gen_uuid(supplier_id)
    c = conn.cursor()
    data = [sid, name, contact_email]
    c.executemany(add_supplier, (data,)) #sql code to be added here once other functions done
    c.close()
    conn.commit()
    supplierProduct_create(conn, sid, product_id)
    return sid

# CATEGORY CREATE: UUID, Name, Description
def category_create(conn: sqlite3.Connection, product_id: str, name: str, description: Optional[str], category_id: Optional[str] = None) -> str:
    cid = gen_uuid(category_id)
    c = conn.cursor()
    data = [cid, name, description]
    c.executemany(add_category, (data,)) #sql code to be added here once other functions done
    c.close()
    conn.commit()
    categoryProduct_create(conn, cid, product_id)
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

# SUPPLIER PRODUCT CREATE
def supplierProduct_create(conn: sqlite3.Connection, supplier_id: str, product_id: str) -> None:
    c = conn.cursor()
    data = [supplier_id, product_id]
    c.executemany(add_supplierProduct, (data,))
    c.close()
    conn.commit()

# CATEGORY PRODUCT CREATE
def categoryProduct_create(conn: sqlite3.Connection, category_id: str, product_id: str) -> None:
    c = conn.cursor()
    data = [category_id, product_id]
    c.executemany(add_categoryProduct, (data,))
    c.close()
    conn.commit()

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

# SUPPLIER PRODUCTS READ
def supplierProducts_read(conn: sqlite3.Connection, supplier_id: str) -> None:
    c = conn.cursor()
    c.execute(get_supplierProducts, (supplier_id,))
    rows = c.fetchall()
    c.close()
    for row in rows:
        print(str(row))

# CATEGORY PRODUCRS READ
def categoryProducts_read(conn: sqlite3.Connection, category_id: str) -> None:
    c = conn.cursor()
    c.execute(get_categoryProducts, (category_id,))
    rows = c.fetchall()
    c.close()
    for row in rows:
        print(str(row))

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

# IMAGE UPDATE
def image_update(conn: sqlite3.Connection, image_id: str, product_id: str, url: str) -> str:
    c = conn.cursor()
    data = [product_id, url, image_id]
    c.executemany(update_image, (data,))
    c.close()
    conn.commit()
    return image_read(conn, str(image_id))

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

# SUPPLIER PRODUCT DELETE
def supplierProduct_delete(conn: sqlite3.Connection, supplier_id: str, product_id: str) -> None:
    c = conn.cursor()
    data = [supplier_id, product_id]
    c.executemany(delete_supplierProduct, (data,))
    conn.commit()
    c.close()

# CATEGORY PRODUCT DELETE
def categoryProduct_delete(conn: sqlite3.Connection, category_id: str, product_id: str) -> None:
    c = conn.cursor()
    data = [category_id, product_id]
    c.executemany(delete_categoryProduct, (data,))
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
    try:
        conn = sqlite3.connect("")
        init_database(conn)
    except sqlite3.OperationalError as error:
        print("\nDatabase error: ", error)
        exit()

    while True:
        try:
            with sqlite3.connect("") as conn:
                init_database(conn)

                print("Type help or ? to list commands.")
                command = input(">>> ").strip()
    
                if command in ("exit", "quit"):
                    print("Terminating session.")
                    break
                elif command in ("help", "?"):
                    print("Available commands: help, create, read, update, delete, exit, quit")
                elif command == "create":
                    print("What type of record do you want to create: product, supplier, category, image, supplierProduct, categoryProduct")
                    create_type = input(">>> ").strip()
                    match create_type:
                        case "product":
                            name = input("Enter product name: ").strip()
                            desc = input("Enter product description: ").strip()
                            quant = -1
                            while quant == -1:
                                quant_string = input("Enter product quantity: ").strip()
                                try:
                                    quant = int(quant_string)
                                except ValueError:
                                    print("ERR: You must enter an integer for quantity.")
                            price = input("Enter product price: ").strip()
                            pid = product_create(conn, name, desc, quant, price)
                            print("New product id: " + pid)
                        case "supplier":
                            pid = input("Enter product id supplied by supplier: ").strip()
                            name = input("Enter supplier name: ").strip()
                            email = input("Enter supplier email: ").strip()
                            sid = supplier_create(conn, pid, name, email)
                            print("New supplier id: " + sid)
                        case "category":
                            pid = input("Enter product id in category: ").strip()
                            name = input("Enter category name: ").strip()
                            desc = input("Enter category description: ").strip()
                            cid = category_create(conn, pid, name, desc)
                            print("New category id: " + cid)
                        case "image":
                            pid = input("Enter product id: ").strip()
                            url = input("Enter image URL: ").strip()
                            iid = image_create(conn, pid, url)
                            print("New image id: " + iid)
                        case "supplierProduct":
                            sid = input("Enter supplier id: ").strip()
                            pid = input("Enter product id: ").strip()
                            supplierProduct_create(conn, sid, pid)
                            print("Association created.")
                        case "categoryProduct":
                            cid = input("Enter category id: ").strip()
                            pid = input("Enter product id: ").strip()
                            categoryProduct_create(conn, cid, pid)
                            print("Association created.")
                elif command == "read":
                    print("What type of record do you want to read: product, supplier, category, image, supplierProducts, categoryProducts")
                    read_type = input(">>> ").strip()
                    match read_type:
                        case "product":
                            prod_id = input("Enter product id: ").strip()
                            print(product_read(conn, prod_id))
                        case "supplier":
                            sup_id = input("Enter supplier id: ").strip()
                            print(supplier_read(conn, sup_id))
                        case "category":
                            cat_id = input("Enter category id: ").strip()
                            print(category_read(conn, cat_id))
                        case "image":
                            img_id = input("Enter image id: ").strip()
                            print(image_read(conn, img_id))
                        case "supplierProducts":
                            sup_id = input("Enter supplier id: ").strip()
                            supplierProducts_read(conn, sup_id)
                        case "categoryProducts":
                            cat_id = input("Enter category id: ").strip()
                            categoryProducts_read(conn, cat_id)
                elif command == "update":
                    print("What type of record do you want to update: product, supplier, category, image")
                    update_type = input(">>> ").strip()
                    match update_type:
                        case "product":
                            prod_id = input("Enter product id: ").strip()
                            name = input("Enter new product name: ").strip()
                            desc = input("Enter new product description: ").strip()
                            quantity = input("Enter new product quantity: ").strip()
                            price = input("Enter new product price: ").strip()
                            print("New record: " + product_update(conn, prod_id, name, desc, quantity, price))
                        case "supplier":
                            sup_id = input("Enter supplier id: ").strip()
                            name = input("Enter new supplier name: ").strip()
                            email = input("Enter new supplier email: ").strip()
                            print(supplier_update(conn, sup_id, name, email))
                        case "category":
                            cat_id = input("Enter category id: ").strip()
                            name = input("Enter new category name: ").strip()
                            desc = input("Enter new category description: ").strip()
                            print(category_update(conn, cat_id, name, desc))
                        case "image":
                            img_id = input("Enter image id: ").strip()
                            prod_id = input("Enter new product id: ").strip()
                            url = input("Enter new image URL: ").strip()
                            print(image_update(conn, img_id, prod_id, url))
                elif command == "delete":
                    print("What type of record do you want to delete: product, supplier, category, image, supplierProduct, categoryProduct")
                    read_type = input(">>> ").strip()
                    match read_type:
                        case "product":
                            prod_id = input("Enter product id: ").strip()
                            product_delete(conn, prod_id)
                            print("Product deleted.")
                        case "supplier":
                            sup_id = input("Enter supplier id: ").strip()
                            supplier_delete(conn, sup_id)
                            print("Supplier deleted.")
                        case "category":
                            cat_id = input("Enter category id: ").strip()
                            category_delete(conn, cat_id)
                            print("Category deleted.")
                        case "image":
                            img_id = input("Enter image id: ").strip()
                            image_delete(conn, img_id)
                            print("Image deleted.")
                        case "supplierProduct":
                            sid = input("Enter supplier id: ").strip()
                            pid = input("Enter product id: ").strip()
                            supplierProduct_delete(conn, sid, pid)
                            print("Association deleted.");
                        case "categoryProduct":
                            cid = input("Enter category id: ").strip()
                            pid = input("Enter product id: ").strip()
                            categoryProduct_delete(conn, cid, pid)
                            print("Association deleted.");
                else:
                    print("ERR: Invalid command.")
        except KeyboardInterrupt:
            print("\nGoodbye!")
            break
        except sqlite3.OperationalError as error:
            print("\nDatabase error: ", error)
            break

if __name__ == "__main__":
    main()

