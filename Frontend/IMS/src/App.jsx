import { useState } from 'react';

import Product from './portals/Product.jsx';
import Supplier from './portals/Supplier.jsx';
import Category from './portals/Category.jsx';
import Image from './portals/Image.jsx';

function App() {

	const portals = {
		product: 0,
		supplier: 1,
		category: 2,
		image: 3
	};
	const [ portal, setPortal ] = useState(null);

	// passed down to each portal [name, input type]
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
			["desc", "text"]
		],
		image: [
			["product", "text"],
			["url", "text"]
		]
	};

	// mock outputs of middleware requests
	const [ productList, setProductList ] = useState(['product1', 'product2', 'product3']);
	const [ supplierList, setSupplierList ] = useState(['sup1', 'sup2', 'sup3', 'sup4']);

	// api
	const API = 'http://localhost:5000/api/IMS';

	// api calls
	async function createProduct(name, desc, quantity, price) {
		try {
			await fetch(API, {
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
		} catch(error) { console.log(error); }
	}

	async function viewProduct(id) {
		try {
			await fetch(API, {
				method: 'POST',
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify({
					meth: 'product_read',
					p_id: id
				})
			});
			if (res.status > 299) return; // handle error
			res = await res.json();
			let product = res.product;
		} catch(error) { console.log(error); }
	}

	async function removeProduct(id) {
		try {
			await fetch(API, {
				method: 'POST',
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify({
					meth: 'product_delete',
					p_id: id
				})
			});
		} catch(error) { console.log(error); }
	}

	async function updateProduct(id, name, desc, quantity, price) {
		try {
			await fetch(API, {
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
		} catch(error) { console.log(error); }
	}

	async function createSupplier(name, contact) {
		try {
			await fetch(API, {
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
			await fetch(API, {
				method: 'POST',
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify({
					meth: 'supplier_read',
					s_id: id
				})
			});
		} catch(error) { console.log(error); }
	}

	async function removeSupplier(id) {
		try {
			await fetch(API, {
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
			await fetch(API, {
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
			await fetch(API, {
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
			await fetch(API, {
				method: 'POST',
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify({
					meth: 'category_read',
					c_id: id
				})
			});
		} catch(error) { console.log(error); }
	}

	async function removeCategory(id) {
		try {
			await fetch(API, {
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
			await fetch(API, {
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
			await fetch(API, {
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
			await fetch(API, {
				method: 'POST',
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify({
					meth: 'image_read',
					i_id: id
				})
			});
		} catch(error) { console.log(error); }
	}

	async function removeImage(id) {
		try {
			await fetch(API, {
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
			await fetch(API, {
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
			await fetch(API, {
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

	async function dissassociateProdSup(p_id, s_id) {
		try {
			await fetch(API, {
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
			await fetch(API, {
				method: 'POST',
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify({
					meth: 'supplierProducts_read',
					s_id: id
				})
			});
		} catch(error) { console.log(error); }
	}

	async function associateProdCat(p_id, c_id) {
		try {
			await fetch(API, {
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

	async function dissassociateProdCat(p_id, c_id) {
		try {
			await fetch(API, {
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
			await fetch(API, {
				method: 'POST',
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify({
					meth: 'supplierProducts_read',
					c_id: id
				})
			});
		} catch(error) { console.log(error); }
	}

	async function listProducts() {
		try {
			const res = await fetch(API, {
				method: 'POST',
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify({meth: 'products_read'})
			});
			if (res.status > 299) return; // handle error
			const data = await res.json();
			let products = data.list;
			return products;
		} catch(error) { console.error(error); }
	}

	async function listSuppliers() {
		try {
			await fetch(API, {
				method: 'POST',
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify({meth: 'suppliers_read'})
			});
		} catch(error) { console.log(error); }
	}

	async function listCategories() {
		try {
			await fetch(API, {
				method: 'POST',
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify({meth: 'categories_read'})
			});
		} catch(error) { console.log(error); }
	}

	async function listImages() {
		try {
			await fetch(API, {
				method: 'POST',
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify({meth: 'images_read'})
			});
		} catch(error) { console.log(error); }
	}

	async function listSupplierProducts(id) {
		try {
			await fetch(API, {
				method: 'POST',
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify({
					meth: 'suppliersProducts_read',
					s_id: id
				})
			});
		} catch(error) { console.log(error); }
	}

	async function listCategoryProducts(id) {
		try {
			await fetch(API, {
				method: 'POST',
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify({
					meth: 'categoryProducts_read',
					c_id: id
				})
			});
		} catch(error) { console.log(error); }
	}

	function Portal() {
		switch(portal) {
			case portals.product:
				return <Product 
					fields={inputFields.product}
					list={listProducts}
					create={createProduct}
					read={viewProduct}
					update={updateProduct}
					remove={removeProduct}
				/>;
			case portals.supplier:
				return <Supplier
					fields={inputFields.supplier}
					suppliers={supplierList} //
					list={listSuppliers}
					create={createSupplier}
					read={viewSupplier}
					update={updateSupplier}
					remove={removeSupplier}
					readProducts={listSupplierProducts}
				/>;
			case portals.category:
				return <Category
					fields={inputFields.category}
					list={listCategories}
					create={createCategory}
					read={viewCategory}
					update={updateSupplier}
					remove={removeCategory}
					readProducts={listCategoryProducts}
				/>;
			case portals.image:
				return <Image
					fields={inputFields.image}
					list={listImages}
					create={createImage}
					read={viewImage}
					update={updateImage}
					remove={removeImage}
				/>;
			default:
				return <></>;
		}
	}

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
			<Portal />
		</>
	);
}

export default App
