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
			<p>{edit == null ? "create" : "modify"} supplier:</p>
			{fields.map((data) => (
				<>
					<label>supplier {data[0]}:
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

const getErrorMsg = (obj) => {
	let data = obj.detail;
	if (typeof data === 'string' || data instanceof String)
		return data;
	return data[0].msg;
}

function Supplier({fields, ops, myOps, result, setResult}) {

	// api calls
	const API = 'http://localhost:8000/suppliers/';

	async function list() {
		try {
			const res = await fetch(API, {
				method: 'GET',
				headers: {'Content-Type': 'application/json'
			}});
			let data = await res.json();
			if (res.status > 299) return console.error(data);
			return data["suppliers"];
		} catch(error) { console.error(error); }
	}

	async function create(name, contact) {
		try {
			let res = await fetch(API, {
				method: 'POST',
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify({
					name: name,
					contact: contact
				})
			});
			let data = await res.json();
			if (res.status > 299) {
				let msg = getErrorMsg(data);
				setMessage(msg);
			}
			return data["s_id"];
		} catch(error) { console.error(error); }
	}

	async function read(id) {
		try {
			let res = await fetch(API + "?s_id=" + id, {
				method: 'GET',
				headers: {'Content-Type': 'application/json'}
			});
			let data = await res.json();
			if (res.status > 299) return console.error(data);
			data = data["supplier"];
			let supplier = {
				s_id: data[0],
				name: data[1],
				contact: data[2]
			};
			return supplier;
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

	async function update(id, name, contact) {
		try {
			let res = await fetch(API + id, {
				method: 'PUT',
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify({
					name: name,
					contact: contact
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

	async function associateProduct(s_id, p_id) {
		try {
			let res = await fetch(API + s_id + "/products/" + p_id, {
				method: 'POST',
				headers: {'Content-Type': 'application/json'}
			});
			let data = await res.json();
			if (res.status > 299) {
				let msg = getErrorMsg(data);
				setMessage(msg);
				return false;
			}
			return true;
		} catch(error) { console.error(error); }
	}

	async function disassociateProduct(s_id, p_id) {
		try {
			let res = await fetch(API + s_id + "/products/" + p_id, {
				method: 'DELETE',
				headers: {'Content-Type': 'application/json'}
			});
			let data = await res.json();
			if (res.status > 299) {
				let msg = getErrorMsg(data);
				setMessage(msg);
				return false;
			}
			return true;
		} catch(error) { console.error(error); }
	}

	async function readProducts(id) {
		try {
			const res = await fetch(API + id + "/products/", {
				method: 'GET',
				headers: {'Content-Type': 'application/json'
			}});
			let data = await res.json();
			if (res.status > 299) return console.error(data);
			return data["products"];
		} catch(error) { console.error(error); }
	}

    // state variables for the menu
    const [edit, setEdit] = useState(null);
    const [requireId, setRequireId] = useState(null);
	const [suppliers, setSuppliers] = useState(null);
	const [message, setMessage] = useState("");

    // handle create/edit inputs
    const handleFields = async (data) => {
		setMessage('');
        let inputs = [];
        for (let i = 0; i < fields.length; i ++) {
            inputs.push(data.get(fields[i][0]));
        }
        if (edit != null) {
			let id = edit["s_id"];
			let op = await update(id, ...inputs);
			if (op) setEdit(null);
			else return;
		} else {
            let id = await create(...inputs);
			setResult(id);
		}
        setSuppliers(null);
    };

    // handle product associations
    const handleAssociation = async (data) => {
		// setMessage('');
        let id = data.get("id");
		let op = false;
		switch(requireId) {
			case ops.assoc:
				op = await associateProduct(edit, id);
				break;
			default:
				op = await disassociateProduct(edit, id);
				break;
		}
		if (op) {
			setEdit(null);
        	setRequireId(null);
		}
    }

    // handle CRUD inputs
    const handleOps = async (data) => {
		setMessage('');
        let type = data.get("type");
        let id = data.get("supplier");
		if (id == null)
			return;
		let supplier;
        switch(type) {
            case ops.edit:
                supplier = await read(id);
				setEdit(supplier);
                break;
            case ops.del:
                remove(id);
				setSuppliers(null);
                break;
            case ops.assoc:
				setRequireId(ops.assoc);
				setEdit(id);
                break;
            case ops.disas:
                setRequireId(ops.disas);
				setEdit(id);
                break;
            case ops.prods:
				let prods = await readProducts(id);
				setResult(JSON.stringify(prods));
				break;
            case ops.view:
                supplier = await read(id);
				setResult(JSON.stringify(supplier));
                break;
        }
    };

	async function getSuppliers() {
		let temp = await list();
		if (temp !== undefined) {
            setSuppliers(temp);
        }
	}

	useEffect(() => {
		// Only run this effect when the component mounts and 'suppliers' is null
		if (suppliers === null) {
			getSuppliers();
		}
	}, [suppliers]); // Re-run only when 'suppliers' changes (e.g., set to null elsewhere)

    return (
        <>
            <h2>supplier portal</h2>
            <Result result={result} clear={() => setResult(null)} />
			{requireId != null ? <>
				<button onClick={() => {setEdit(null); setRequireId(null);}}>cancel</button>
				<form action={handleAssociation}>
					<label>provide product id to {requireId} with this supplier:
						<input type="text" name="id" />
						<button type="submit">confirm</button>
					</label>
					<ValidationMsg message={message} />
				</form>					
			</>
			: <>
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
							<li>
								<input type="radio" name="type" value={myOps[5]} />{myOps[5]}
							</li>
						</ul>
						<p>on supplier:</p>
						<ul>
							{suppliers != null &&
								suppliers.map((supplier) => (
									<li key={supplier}>
										<label>
											<input type="radio" name="supplier" value={supplier} />{supplier}
										</label>
									</li>
								))
							}
						</ul>
						<button type="submit">confirm</button>
					</form>
				}
			</>}
        </>
    );
}

export default Supplier;