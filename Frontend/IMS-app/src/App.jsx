import { useState } from 'react';
import Product from './portals/Product.jsx';

function App() {

	const portals = {
		product: 0,
		supplier: 1,
		category: 2,
		image: 3
	};
	const [ portal, setPortal ] = useState(null);

	const [ inputFields, setInputFields ] = useState({
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
	});

	// mock outputs of middleware requests
	const [ productList, setProductList ] = useState(['product1', 'product2', 'product3']);
	const [ supplierList, setSupplierList ] = useState(['sup1', 'sup2', 'sup3', 'sup4']);

	// requests to middleware go here
	async function createProduct() {
		setProductList([...productList, 'new_product']);
	}

	async function removeProduct() {
		setProductList(productList.slice(0, supplierList.length - 2));
	}

	function Portal() {
		switch(portal) {
			case portals.product:
				return <Product 
					fields={inputFields.product}
					products={productList}
					create={createProduct}
					remove={removeProduct}
				/>;
			case portals.supplier:
				// return <Supplier fields={inputFields.supplier} suppliers={supplierList} />;
			case portals.category:
				// return <Category />;
			case portals.image:
				// return <Image />;
			default:
				return <></>;
		}
	}

	return (
		<>
			<h1>Inventory Management System</h1>
			<p>choose a portal:</p>
			<ul>
				<li onClick={() => setPortal(portals.product)}>products</li>
				<li onClick={() => setPortal(portals.supplier)}>suppliers</li>
				<li>categories</li>
				<li>images</li>
			</ul>
			<Portal />
		</>
	);
}

export default App
