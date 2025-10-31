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
		disas: "disassociate"
	};

	const portalOps = {
		product: Array(ops.view, ops.edit, ops.del, ops.assoc, ops.disas),
		supplier: Array(ops.view, ops.edit, ops.del),
		category: Array(ops.view, ops.edit, ops.del),
		image: Array(ops.view, ops.edit, ops.del)
	};

	// state variables
	const [portal, setPortal] = useState(null);
	const [result, setResult] = useState(null);

	return (
		<>
			<h1>Inventory Management System</h1>
			<p>The Solid Principles - Victor Boyd, Michael Warner, Ricardo Olazabal</p>
			<p>choose a portal:</p>
			<ul>
				<li><button onClick={() => {setPortal(portals.product)}}>product</button></li>
				<li><button onClick={() => {setPortal(portals.supplier)}}>supplier</button></li>
				<li><button onClick={() => {setPortal(portals.category)}}>category</button></li>
				<li><button onClick={() => {setPortal(portals.image)}}>image</button></li>
			</ul>
			{
				portal == portals.product &&
				<Product 
					fields={inputFields.product}
					ops={ops}
					myOps={portalOps.product}
					result={result}
					setResult={setResult}
				/>
			}
			{
				portal == portals.supplier &&
				<Supplier
					fields={inputFields.supplier}
					ops={ops}
					myOps={portalOps.supplier}
					result={result}
					setResult={setResult}
				/>
			}
			{
				portal == portals.category &&
				<Category
					fields={inputFields.category}
					ops={ops}
					myOps={portalOps.category}
					result={result}
					setResult={setResult}
				/>
			}
			{
				portal == portals.image &&
				<Image
					fields={inputFields.image}
					ops={ops}
					myOps={portalOps.image}
					result={result}
					setResult={setResult}
				/>
			}
		</>
	);
}

export default App
