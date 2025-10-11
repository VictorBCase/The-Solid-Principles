import { useState } from 'react';
import { xmlrpc_client, xmlrpcmsg, xmlrpcval } from '@jsxmlrpc/jsxmlrpc';

import Product from './portals/Product.jsx';
import Supplier from './portals/Supplier.jsx';

function App() {

	const client = new xmlrpc_client("http://localhost:8000");

	const msg = new xmlrpcmsg('add', [new xmlrpcval(1, 'int'), new xmlrpcval(2, 'int')]);

	client.send(msg, (res, req) => {
		console.log(res.value());
	});

	const portals = {
		product: 0,
		supplier: 1,
		category: 2,
		image: 3
	};
	const [ portal, setPortal ] = useState(null);

	// passed down to each portal
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

	// async requests to middleware go here
	async function createProduct() {
		setProductList([...productList, 'new_product']);
	}

	async function removeProduct() {
		let temp = productList.slice(0, productList.length - 1);
		setProductList(temp);
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
				return <Supplier
					fields={inputFields.supplier}
					suppliers={supplierList}
				/>;
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
			<p>The Solid Principles - Victor Boyd, Michael Warner, Ricardo Olazabal</p>
			<p>choose a portal:</p>
			<ul>
				<li><button onClick={() => setPortal(portals.product)}>product</button></li>
				<li><button onClick={() => setPortal(portals.supplier)}>supplier</button></li>
				<li><button>category</button></li>
				<li><button>image</button></li>
			</ul>
			<Portal />
		</>
	);
}

export default App
