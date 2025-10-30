import requests
import json

# URLs ------------------------------------------------------------------------
product_url = "http://0.0.0.0:80/"
supplier_url = "http://0.0.0.1:80/"
category_url = "http://0.0.0.2:80/"
image_url = "http://0.0.0.3:80/"

# CLI -------------------------------------------------------------------------
 
# Arguments to be Parsed in CLI:
#   Create
#   Read
#   Update
#   Delete

# MAIN ------------------------------------------------------------------------

def main():
	print("Welcome to The Solid Principles' Inventory Management System")

	while True:
		try:
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
						quant = input("Enter product quantity: ").strip()
						price = input("Enter product price: ").strip()
						payload = {'name': name, 'description': desc, 'quantity': int(quant), 'price': price}
						r = requests.post(product_url, json=payload)
						#if (r.status_code > 299):
						print(r.json())
					case "supplier":
						name = input("Enter supplier name: ").strip()
						email = input("Enter supplier email: ").strip()
						payload = {'name': name, 'contact': email}
						r = requests.post(supplier_url, json=payload)
						print(r.json())
					case "category":
						name = input("Enter category name: ").strip()
						desc = input("Enter category description: ").strip()
						payload = {'name': name, 'description': desc}
						r = requests.post(category_url, json=payload)
						print(r.json())
					case "image":
						pid = input("Enter product id: ").strip()
						url = input("Enter image URL: ").strip()
						payload = {'p_id': pid, 'url': url}
						r = requests.post(image_url, json=payload)
						print(r.json())
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
						r = requests.get(product_url + "?p_id=" + prod_id)
						print(r.json())
					case "supplier":
						sup_id = input("Enter supplier id: ").strip()
						r = requests.get(supplier_url + "?s_id=" + sup_id)
						print(r.json())
					case "category":
						cat_id = input("Enter category id: ").strip()
						r = requests.get(category_url + "?c_id=" + cat_id)
						print(r.json())
					case "image":
						img_id = input("Enter image id: ").strip()
						r = requests.get(image_url + "?i_id=" + img_id)
						print(r.json())
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
						quant = input("Enter new product quantity: ").strip()
						price = input("Enter new product price: ").strip()
						payload = {'name': name, 'description': desc, 'quantity': int(quant), 'price': price}
						r = requests.put(product_url + prod_id, json=payload)
						#if (r.status_code > 299):
						print(r.json())
					case "supplier":
						sup_id = input("Enter supplier id: ").strip()
						name = input("Enter new supplier name: ").strip()
						email = input("Enter new supplier email: ").strip()
						payload = {'name': name, 'contact': email}
						r = requests.put(supplier_url + sup_id, json=payload)
						print(r.json())
					case "category":
						cat_id = input("Enter category id: ").strip()
						name = input("Enter new category name: ").strip()
						desc = input("Enter new category description: ").strip()
						payload = {'name': name, 'description': desc}
						r = requests.put(category_url + cat_id, json=payload)
						print(r.json())
					case "image":
						img_id = input("Enter image id: ").strip()
						prod_id = input("Enter new product id: ").strip()
						url = input("Enter new image URL: ").strip()
						payload = {'p_id': prod_id, 'url': url}
						r = requests.put(image_url + img_id, json=payload)
						print(r.json())
			elif command == "delete":
				print("What type of record do you want to delete: product, supplier, category, image, supplierProduct, categoryProduct")
				read_type = input(">>> ").strip()
				match read_type:
					case "product":
						prod_id = input("Enter product id: ").strip()
						r = requests.delete(product_url + prod_id)
						print(r.json())
					case "supplier":
						sup_id = input("Enter supplier id: ").strip()
						r = requests.delete(supplier_url + sup_id)
						print(r.json())
					case "category":
						cat_id = input("Enter category id: ").strip()
						r = requests.delete(category_url + cat_id)
						print(r.json())
					case "image":
						img_id = input("Enter image id: ").strip()
						r = requests.delete(image_url + img_id)
						print(r.json())
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

if __name__ == "__main__":
	main()

