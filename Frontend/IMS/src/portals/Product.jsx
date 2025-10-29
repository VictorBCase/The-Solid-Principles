import { useState, useEffect } from 'react'; // Make sure useEffect is imported

// validation message html
const ValidationMsg = ({message}) => {
	if (message == '') return <></>;
	return (
		<>
			<p name="msg" style={{color: "red"}}>{message}</p>
		</>
	);
}

// display view results
const Result = ({result, clear}) => {
	if (result == null) return <></>;
	return (
		<>
			<p>result:</p>
			<p>{result}</p>
			<button onClick={() => clear()}>clear</button>
			<br />
		</>
	);
}

// field form html
const FieldForm = ({fields, edit, close, formAction}) => {
	return (
		<form action={formAction}>
			{edit != null && <button onClick={() => close()}>cancel edit</button>}
			<p>{edit == null ? "create" : "modify"} product:</p>
			{fields.map((data) => (
				<>
					<label>product {data[0]}:
						{edit == null ?
							<input type={data[1]} name={data[0]} />
						:
							<input type={data[1]} name={data[0]} defaultValue={edit[data[0]]} />
						}
					</label>
				</>
			))}
			<button type="submit">{edit == null ? "create" : "update"}</button>
		</form>
	);
}

function Product({fields, ops, myOps, result, setResult}) {

	// api calls
	const API = 'http://localhost:8080/api/productService';

	async function listProducts() {
		try {
			const res = await fetch(API, {
				method: 'GET',
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify({meth: 'products_read'})
			});
			let data = await res.json();
			if (res.status > 299) return console.error(data);
			let products = data.list;
			return products;
		} catch(error) { console.error(error); }
	}

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
			let res = await fetch(API + "?id=" + id, {
				method: 'GET',
				headers: {'Content-Type': 'application/json'}
			});
			let data = await res.json();
			if (res.status > 299) return console.error(data);
			let product = data.product;
			return product;
		} catch(error) { console.error(error); }
	}

	async function removeProduct(id) {
		try {
			let res = await fetch(API, {
				method: 'DELETE',
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify({
					meth: 'product_delete',
					p_id: id
				})
			});
			let data = await res.json();
			if (res.status > 299) return console.error(data);
		} catch(error) { console.error(error); }
	}

	async function updateProduct(id, name, desc, quantity, price) {
		try {
			let res = await fetch(API, {
				method: 'PUT',
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
			if (res.status > 299) {
				console.error(data);
				let msg = data.error;
				setVaidationMsg(msg);
				return false;
			}
			return true;
		} catch(error) { console.error(error); return false; }
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
			let data = await res.json();
			if (res.status > 299) {
				console.error(data);
				let msg = data.error;
				setVaidationMsg(msg);
			}
		} catch(error) { console.error(error); }
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
			let data = await res.json();
			if (res.status > 299) {
				console.error(data);
				let msg = data.error;
				setVaidationMsg(msg);
			}
		} catch(error) { console.error(error); }
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
			let data = await res.json();
			if (res.status > 299) {
				console.error(data);
				let msg = data.error;
				setVaidationMsg(msg);
			}
		} catch(error) { console.error(error); }
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
			let data = await res.json();
			if (res.status > 299) {
				console.error(data);
				let msg = data.error;
				setVaidationMsg(msg);
			}
		} catch(error) { console.error(error); }
	}

    // state variables for the menu
    const [edit, setEdit] = useState(null);
    const [requireId, setRequireId] = useState(null);
	const [products, setProducts] = useState(null);
	const [message, setMessage] = useState("");

    // handle create/edit inputs
    const handleFields = async (data) => {
		clearMsg();
        let inputs = [];
        for (let i = 0; i < fields.length; i ++) {
            inputs.push(data.get(fields[i][0]));
        }
        if (edit != null) {
			let id = edit["p_id"];
			let op = await update(id, ...inputs);
			if (op) setEdit(null);
			else return;
		} else {
            let id = await create(...inputs);
			setResult(id);
		}
        setProducts(null);
    };

    // handle supplier/category associations
    const handleAssociation = async (data) => {
		// clearMsg();
        let type = data.get("type");
        let id = data.get("id");
		switch(requireId) {
			case ops.assoc:
				if (type == "supplier")
					await associateSup(edit, id);
				else
					await associateCat(edit, id);
				break;
			default:
				if (type == "supplier")
					await disassociateSup(edit, id);
				else
					await disassociateCat(edit, id);
				break;
		}
		setEdit(null);
        setRequireId(null);
    }

    // handle CRUD inputs
    const handleOps = async (data) => {
		clearMsg();
        let type = data.get("type");
        let id = data.get("product");
		if (id == null)
			return;
		let product;
        switch(type) {
            case ops.edit:
                product = await read(id);
				setEdit(product);
                break;
            case ops.del:
                remove(id);
				setProducts(null);
                break;
            case ops.assoc:
				setRequireId(ops.assoc);
				setEdit(id);
                break;
            case ops.disas:
                setRequireId(ops.disas);
				setEdit(id);
                break;
            case ops.view:
                product = await read(id);
				setResult(JSON.stringify(product));
                break;
        }
    };

	async function getProducts() {
		let temp = await list();
		if (temp !== undefined) {
            setProducts(temp);
        }
	}

	useEffect(() => {
		// Only run this effect when the component mounts and 'products' is null
		if (products === null) {
			getProducts();
		}
	}, [products]); // Re-run only when 'products' changes (e.g., set to null elsewhere)

    return (
        <>
            <h2>product portal</h2>
            <Result result={result} clear={() => setResult(null)} />
            {requireId != null ?
				<>
                    <button onClick={() => {setEdit(null); setRequireId(null);}}>cancel</button>
                    <form action={handleAssociation}>
                        <label>
                            <input type="radio" name="type" value="supplier" defaultChecked />supplier
                        </label>
                        <label>
                            <input type="radio" name="type" value="category" />category
                        </label>
                        <br />
                        <label>provide id to {requireId} with this product:
                            <input type="text" name="id" />
                            <button type="submit">confirm</button>
                        </label>
                        <ValidationMsg message={message} />
                    </form>
                </>
			:
				<>
					<FieldForm fields={fields} edit={edit} close={() => setEdit(null)} formAction={handleFields} />
					<ValidationMsg message={message} />
					{edit === null &&
						<form action={handleOps}>
							<p>perform</p>
							<ul>
								<li>
									<input type="radio" name="type" value={myOps[0]} defaultChecked />{myOps[0]}
								</li>
								<li>
									<input type="radio" name="type" value={myOps[1]} />{myOps[1]}
								</li>
								<li>
									<input type="radio" name="type" value={myOps[2]} />{myOps[2]}
								</li>
								<li>
									<input type="radio" name="type" value={myOps[3]} />{myOps[3]}
								</li>
								<li>
									<input type="radio" name="type" value={myOps[4]} />{myOps[4]}
								</li>
							</ul>
							<p>on product:</p>
							<ul>
								{products != null &&
									products.map((product) => (
										<li key={product}>
											<label>
												<input type="radio" name="product" value={product} />{product}
											</label>
										</li>
									))
								}
							</ul>
							<button type="submit">confirm</button>
						</form>
					}
				</>
			}
        </>
    );
}

export default Product;