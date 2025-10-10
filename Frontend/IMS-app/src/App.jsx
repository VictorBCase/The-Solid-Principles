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
			["desc", "text"],
			["stock", "number"],
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
	const [ productList, setProductList ] = useState(['product1', 'product2', 'product3']);

	function Portal() {
		switch(portal) {
			case portals.product:
				return <Product fields={inputFields.product} products={productList} />;
			case portals.supplier:
				return <Supplier />;
			case portals.category:
				return <Category />;
			case portals.image:
				return <Image />;
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
