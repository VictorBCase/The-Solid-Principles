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

function Product({fields, ops, myOps, result, setResult, getErrorMsg}) {

	// api calls
	const API = 'http://localhost:8000/products/';

	async function list() {
		try {
			const res = await fetch(API, {
				method: 'GET',
				headers: {'Content-Type': 'application/json'
			}});
			let data = await res.json();
			if (res.status > 299) return console.error(data);
			return data["products"];
		} catch(error) { console.error(error); }
	}

	async function create(name, desc, quantity, price) {
		try {
			let res = await fetch(API, {
				method: 'POST',
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify({
					name: name,
					description: desc,
					quantity: quantity,
					price: price
				})
			});
			let data = await res.json();
			if (res.status > 299) {
				let msg = getErrorMsg(data);
				setMessage(msg);
			}
			return data["p_id"];
		} catch(error) { console.error(error); }
	}

	async function read(id) {
		try {
			let res = await fetch(API + "?p_id=" + id, {
				method: 'GET',
				headers: {'Content-Type': 'application/json'}
			});
			let data = await res.json();
			if (res.status > 299) return console.error(data);
			data = data["product"];
			let product = {
				p_id: data[0],
				name: data[1],
				description: data[2],
				quantity: data[3],
				price: data[4]
			};
			return product;
		} catch(error) { console.error(error); }
	}

	async function remove(id) {
		try {
			let res = await fetch(API + id, {
				method: 'DELETE',
				headers: {'Content-Type': 'application/json'},
			});
			let data = await res.json();
			if (res.status > 299) return console.error(data);
		} catch(error) { console.error(error); }
	}

	async function update(id, name, desc, quantity, price) {
		try {
			let res = await fetch(API + id, {
				method: 'PUT',
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify({
					name: name,
					description: desc,
					quantity: quantity,
					price: price
				})
			});
			let data = await res.json();
			if (res.status > 299) {
				let msg = getErrorMsg(data);
				setMessage(msg);
				return false;
			}
			return true;
		} catch(error) { console.error(error); return false; }
	}

    // state variables for the menu
    const [edit, setEdit] = useState(null);
	const [products, setProducts] = useState(null);
	const [message, setMessage] = useState("");

    // handle create/edit inputs
    const handleFields = async (data) => {
		setMessage('');
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

    // handle CRUD inputs
    const handleOps = async (data) => {
		setMessage('');
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
                await remove(id);
				setProducts(null);
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
		if (products == null) {
			getProducts();
		}
	}, [products]); // Re-run only when 'products' changes (e.g., set to null elsewhere)

    return (
        <>
            <h2>product portal</h2>
            <Result result={result} clear={() => setResult(null)} />
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
    );
}

export default Product;