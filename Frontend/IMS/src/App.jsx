import { useState } from 'react';

import Product from './portals/Product.jsx';
import Supplier from './portals/Supplier.jsx';
import Category from './portals/Category.jsx';
import Image from './portals/Image.jsx';

const Results = ({result, setResult}) => {
	if (result == null)
		return <></>;
	return (
		<>
			<p>results:</p>
			<p>some result</p>
			<button onClick={() => setResult(null)}>clear result</button>
			<br />
		</>
	);
};

function App() {

	const portals = {
		product: 0,
		supplier: 1,
		category: 2,
		image: 3
	};

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

	const operations = {
		product: {
			view: "get",
			edit: "edit",
			delete: "del",
			associate: "assoc",
			dissassociate: "diss"
		},
		supplier: {
		
		},
		category: {
		
		},
		image: {

		}
	};

	// state variables
	const [portal, setPortal] = useState(null);
	const [list, setList] = useState(null);
	const [results, setResults] = useState(null);
	const [validationMsg, setVaidationMsg] = useState("");

	// api
	const API = 'http://localhost:5000/api/IMS';

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
		} catch(error) { console.log(error); }
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
			if (res.status > 299) return; // handle error
			res = await res.json();
			let product = res.product;
		} catch(error) { console.log(error); }
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

	async function dissassociateProdSup(p_id, s_id) {
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

	async function dissassociateProdCat(p_id, c_id) {
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
					meth: 'supplierProducts_read',
					c_id: id
				})
			});
		} catch(error) { console.log(error); }
	}

	async function listProducts() {
		try {
			let res = await fetch(API, {
				mode: 'no-cors',
				method: 'POST',
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify({meth: 'products_read'})
			});
			if (res.status > 299) return; // handle error
			res = await res.json();
			let products = res.list;
			setList(products);
		} catch(error) { console.log(error); }
	}

	async function listSuppliers() {
		try {
			let res = await fetch(API, {
				method: 'POST',
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify({meth: 'suppliers_read'})
			});
			if (res.status > 299) return; // handle error
			res = await res.json();
			let suppliers = res.list;
			setList(suppliers);
		} catch(error) { console.log(error); }
	}

	async function listCategories() {
		try {
			let res = await fetch(API, {
				method: 'POST',
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify({meth: 'categories_read'})
			});
			if (res.status > 299) return; // handle error
			res = await res.json();
			let categories = res.list;
			setList(categories);
		} catch(error) { console.log(error); }
	}

	async function listImages() {
		try {
			let res = await fetch(API, {
				method: 'POST',
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify({meth: 'images_read'})
			});
			if (res.status > 299) return; // handle error
			res = await res.json();
			let images = res.list;
			setList(images);
		} catch(error) { console.log(error); }
	}

	async function viewSupplierProducts(id) {
		try {
			let res = await fetch(API, {
				method: 'POST',
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify({
					meth: 'suppliersProducts_read',
					s_id: id
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
		} catch(error) { console.log(error); }
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
			{
				portal == portals.product &&
				<Product 
					fields={inputFields.product}
					operations={operations.product}
					products={list}
					create={createProduct}
					read={viewProduct}
					update={updateProduct}
					remove={removeProduct}
					message={validationMsg}
				/>
			}
			{
				portal == portals.supplier &&
				<Supplier
					fields={inputFields.supplier}
					suppliers={supplierList} //
					list={listSuppliers}
					create={createSupplier}
					read={viewSupplier}
					update={updateSupplier}
					remove={removeSupplier}
					readProducts={viewSupplierProducts}
				/>
			}
			{
				portal == portals.category &&
				<Category
					fields={inputFields.category}
					list={listCategories}
					create={createCategory}
					read={viewCategory}
					update={updateSupplier}
					remove={removeCategory}
					readProducts={viewCategoryProducts}
				/>
			}
			{
				portal == portals.image &&
				<Image
					fields={inputFields.image}
					list={listImages}
					create={createImage}
					read={viewImage}
					update={updateImage}
					remove={removeImage}
				/>
			}
		</>
	);
}

export default App
