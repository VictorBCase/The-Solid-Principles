import { useState } from 'react';

import Product from './portals/Product.jsx';
import Supplier from './portals/Supplier.jsx';
import Category from './portals/Category.jsx';
import Image from './portals/Image.jsx';

function App() {

	// api
	const API = 'http://localhost:8080/api/IMS';

	// api calls
	async function createProduct(name, desc, quantity, price) {
		try {
			let res = await fetch(API, {
				method: 'POST',
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify({
					meth: 'product_create',
					name: name,
					description: desc,
					quantity: quantity,
					price: price
				})
			});
			let data = await res.json();
			if (res.status > 299) {
				console.error(data);
				let msg = data.error;
				setVaidationMsg(msg);
			}
			let id = data.p_id;
			return id;
		} catch(error) { console.error(error); }
	}

	async function viewProduct(id) {
		try {
			let res = await fetch(API, {
				method: 'POST',
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify({
					meth: 'product_read',
					p_id: id
				})
			});
			let data = await res.json();
			if (res.status > 299) return console.error(data);
			let product = data.product;
			console.log(product);
			return product;
		} catch(error) { console.error(error); }
	}

	async function removeProduct(id) {
		try {
			let res = await fetch(API, {
				method: 'POST',
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify({
					meth: 'product_delete',
					p_id: id
				})
			});
			let data = await res.json();
			if (res.status > 299) return console.error(data);
		} catch(error) { console.log(error); }
	}

	async function updateProduct(id, name, desc, quantity, price) {
		try {
			let res = await fetch(API, {
				method: 'POST',
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify({
					meth: 'product_update',
					p_id: id,
					name: name,
					description: desc,
					quantity: quantity,
					price: price
				})
			});
			let data = await res.json();
			if (res.status > 299) return console.error(data);
		} catch(error) { console.log(error); }
	}

	async function createSupplier(name, contact) {
		try {
			let res = await fetch(API, {
				method: 'POST',
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify({
					meth: 'supplier_create',
					name: name,
					contact: contact
				})
			});
		} catch(error) { console.log(error); }
	}

	async function viewSupplier(id) {
		try {
			let res = await fetch(API, {
				method: 'POST',
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify({
					meth: 'supplier_read',
					s_id: id
				})
			});
			let data = await res.json();
			if (res.status > 299) return console.error(data);
			let supplier = data.supplier;
			console.log(supplier);
			return supplier;
		} catch(error) { console.log(error); }
	}

	async function removeSupplier(id) {
		try {
			let res = await fetch(API, {
				method: 'POST',
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify({
					meth: 'supplier_delete',
					s_id: id
				})
			});
		} catch(error) { console.log(error); }
	}

	async function updateSupplier(id, name, contact) {
		try {
			let res = await fetch(API, {
				method: 'POST',
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify({
					meth: 'supplier_update',
					s_id: id,
					name: name,
					contact: contact
				})
			});
		} catch(error) { console.log(error); }
	}

	async function createCategory(name, desc) {
		try {
			let res = await fetch(API, {
				method: 'POST',
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify({
					meth: 'category_create',
					name: name,
					description: desc
				})
			});
		} catch(error) { console.log(error); }
	}

	async function viewCategory(id) {
		try {
			let res = await fetch(API, {
				method: 'POST',
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify({
					meth: 'category_read',
					c_id: id
				})
			});
			let data = await res.json();
			if (res.status > 299) return console.error(data);
			let category = data.category;
			console.log(category);
			return category;
		} catch(error) { console.log(error); }
	}

	async function removeCategory(id) {
		try {
			let res = await fetch(API, {
				method: 'POST',
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify({
					meth: 'category_delete',
					c_id: id
				})
			});
		} catch(error) { console.log(error); }
	}

	async function updateCategory(id, name, desc) {
		try {
			let res = await fetch(API, {
				method: 'POST',
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify({
					meth: 'category_update',
					c_id: id,
					name: name,
					description: desc
				})
			});
		} catch(error) { console.log(error); }
	}

	async function createImage(p_id, url) {
		try {
			let res = await fetch(API, {
				method: 'POST',
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify({
					meth: 'image_create',
					p_id: p_id,
					url: url
				})
			});
		} catch(error) { console.log(error); }
	}

	async function viewImage(id) {
		try {
			let res = await fetch(API, {
				method: 'POST',
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify({
					meth: 'image_read',
					i_id: id
				})
			});
			let data = await res.json();
			if (res.status > 299) return console.error(data);
			let image = data.image;
			console.log(image);
			return image;
		} catch(error) { console.log(error); }
	}

	async function removeImage(id) {
		try {
			let res = await fetch(API, {
				method: 'POST',
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify({
					meth: 'image_delete',
					i_id: id
				})
			});
		} catch(error) { console.log(error); }
	}

	async function updateImage(id, p_id, url) {
		try {
			let res = await fetch(API, {
				method: 'POST',
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify({
					meth: 'image_update',
					i_id: id,
					p_id: p_id,
					url: url
				})
			});
		} catch(error) { console.log(error); }
	}

	async function associateProdSup(p_id, s_id) {
		try {
			let res = await fetch(API, {
				method: 'POST',
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify({
					meth: 'supplierProducts_create',
					p_id: p_id,
					s_id: s_id
				})
			});
		} catch(error) { console.log(error); }
	}

	async function disassociateProdSup(p_id, s_id) {
		try {
			let res = await fetch(API, {
				method: 'POST',
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify({
					meth: 'supplierProducts_delete',
					p_id: p_id,
					s_id: s_id
				})
			});
		} catch(error) { console.log(error); }
	}

	async function viewSupplierProducts(id) {
		try {
			let res = await fetch(API, {
				method: 'POST',
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify({
					meth: 'supplierProducts_read',
					s_id: id
				})
			});
			let data = await res.json();
			if (res.status > 299) return console.error(data);
			let prods = data.list;
			console.log(prods);
			return prods;
		} catch(error) { console.log(error); }
	}

	async function associateProdCat(p_id, c_id) {
		try {
			let res = await fetch(API, {
				method: 'POST',
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify({
					meth: 'categoryProducts_create',
					p_id: p_id,
					c_id: c_id
				})
			});
		} catch(error) { console.log(error); }
	}

	async function disassociateProdCat(p_id, c_id) {
		try {
			let res = await fetch(API, {
				method: 'POST',
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify({
					meth: 'categoryProducts_delete',
					p_id: p_id,
					c_id: c_id
				})
			});
		} catch(error) { console.log(error); }
	}

	async function viewCategoryProducts(id) {
		try {
			let res = await fetch(API, {
				method: 'POST',
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify({
					meth: 'categoryProducts_read',
					c_id: id
				})
			});
			let data = await res.json();
			if (res.status > 299) return console.error(data);
			let prods = data.list;
			console.log(prods);
			return prods;
		} catch(error) { console.log(error); }
	}

	async function listProducts() {
		try {
			const res = await fetch(API, {
				method: 'POST',
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify({meth: 'products_read'})
			});
			let data = await res.json();
			if (res.status > 299) return console.error(data);
			let products = data.list;
			return products;
		} catch(error) { console.error(error); }
	}

	async function listSuppliers() {
		try {
			let res = await fetch(API, {
				method: 'POST',
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify({meth: 'suppliers_read'})
			});
			let data = await res.json();
			if (res.status > 299) return console.error(data);
			let suppliers = data.list;
			return suppliers;
		} catch(error) { console.log(error); }
	}

	async function listCategories() {
		try {
			let res = await fetch(API, {
				method: 'POST',
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify({meth: 'categories_read'})
			});
			let data = await res.json();
			if (res.status > 299) return console.error(data);
			let categories = data.list;
			return categories;
		} catch(error) { console.log(error); }
	}

	async function listImages() {
		try {
			let res = await fetch(API, {
				method: 'POST',
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify({meth: 'images_read'})
			});
			let data = await res.json();
			if (res.status > 299) return console.error(data);
			let images = data.list;
			return images;
		} catch(error) { console.log(error); }
	}

	async function listSupplierProducts(id) {
		try {
			let res = await fetch(API, {
				method: 'POST',
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify({
					meth: 'suppliersProducts_read',
					s_id: id
				})
			});
			let data = await res.json();
			if (res.status > 299) return console.error(data);
			let products = data.list;
			return products;
		} catch(error) { console.log(error); }
	}

	async function listCategoryProducts(id) {
		try {
			let res = await fetch(API, {
				method: 'POST',
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify({
					meth: 'categoryProducts_read',
					c_id: id
				})
			});
			let data = await res.json();
			if (res.status > 299) return console.error(data);
			let products = data.list;
			return products;
		} catch(error) { console.log(error); }
	}

	const portals = {
		product: 0,
		supplier: 1,
		category: 2,
		image: 3
	};

	const inputFields = {
		product: [
			["name", "text"],
			["description", "text"],
			["quantity", "number"],
			["price", "number"]
		],
		supplier: [
			["name", "text"],
			["contact", "text"]
		],
		category: [
			["name", "text"],
			["description", "text"]
		],
		image: [
			["p_id", "text"],
			["url", "text"]
		]
	};

	const ops = {
		view: "view",
		edit: "edit",
		del: "delete",
		assoc: "associate",
		disas: "disassociate",
		prods: "products"
	};

	const portalOps = {
		product: Array(ops.view, ops.edit, ops.del, ops.assoc, ops.disas),
		supplier: Array(ops.view, ops.edit, ops.del, ops.prods),
		category: Array(ops.view, ops.edit, ops.del, ops.prods),
		image: Array(ops.view, ops.edit, ops.del)
	};

	// state variables
	const [portal, setPortal] = useState(null);
	const [results, setResults] = useState(null);
	const [validationMsg, setVaidationMsg] = useState("");

	return (
		<>
			<h1>Inventory Management System</h1>
			<p>The Solid Principles - Victor Boyd, Michael Warner, Ricardo Olazabal</p>
			<p>choose a portal:</p>
			<ul>
				<li><button onClick={() => setPortal(portals.product)}>product</button></li>
				<li><button onClick={() => setPortal(portals.supplier)}>supplier</button></li>
				<li><button onClick={() => setPortal(portals.category)}>category</button></li>
				<li><button onClick={() => setPortal(portals.image)}>image</button></li>
			</ul>
			{
				portal == portals.product &&
				<Product 
					fields={inputFields.product}
					ops={ops}
					myOps={portalOps.product}
					list={listProducts}
					create={createProduct}
					read={viewProduct}
					update={updateProduct}
					remove={removeProduct}
					associateSup={associateProdSup}
					associateCat={associateProdCat}
					disassociateSup={disassociateProdSup}
					disassociateCat={disassociateProdCat}
					message={validationMsg}
					clearMsg={() => setVaidationMsg('')}
				/>
			}
			{
				portal == portals.supplier &&
				<Supplier
					fields={inputFields.supplier}
					ops={ops}
					myOps={portalOps.supplier}
					list={listSuppliers}
					create={createSupplier}
					read={viewSupplier}
					update={updateSupplier}
					remove={removeSupplier}
					readProducts={viewSupplierProducts}
					message={validationMsg}
					clearMsg={() => setVaidationMsg('')}
				/>
			}
			{
				portal == portals.category &&
				<Category
					fields={inputFields.category}
					ops={ops}
					myOps={portalOps.category}
					list={listCategories}
					create={createCategory}
					read={viewCategory}
					update={updateCategory}
					remove={removeCategory}
					readProducts={viewCategoryProducts}
					message={validationMsg}
					clearMsg={() => setVaidationMsg('')}
				/>
			}
			{
				portal == portals.image &&
				<Image
					fields={inputFields.image}
					ops={ops}
					myOps={portalOps.image}
					list={listImages}
					create={createImage}
					read={viewImage}
					update={updateImage}
					remove={removeImage}
					message={validationMsg}
					clearMsg={() => setVaidationMsg('')}
				/>
			}
		</>
	);
}

export default App
