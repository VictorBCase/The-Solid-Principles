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

function Supplier({fields, ops, myOps}) {

	// api calls
	const API = 'http://localhost:8080/api/supplierService';

	async function listSuppliers() {
		try {
			let res = await fetch(API, {
				method: 'GET',
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify({meth: 'suppliers_read'})
			});
			let data = await res.json();
			if (res.status > 299) return console.error(data);
			let suppliers = data.list;
			return suppliers;
		} catch(error) { console.error(error); }
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
			let data = await res.json();
			if (res.status > 299) {
				console.error(data);
				let msg = data.error;
				setVaidationMsg(msg);
			}
		} catch(error) { console.error(error); }
	}

	async function viewSupplier(id) {
		try {
			let res = await fetch(API + "?id=" + id, {
				method: 'GET',
				headers: {'Content-Type': 'application/json'}
			});
			let data = await res.json();
			if (res.status > 299) return console.error(data);
			let supplier = data.supplier;
			return supplier;
		} catch(error) { console.error(error); }
	}

	async function removeSupplier(id) {
		try {
			let res = await fetch(API, {
				method: 'DELETE',
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify({
					meth: 'supplier_delete',
					s_id: id
				})
			});
		} catch(error) { console.error(error); }
	}

	async function updateSupplier(id, name, contact) {
		try {
			let res = await fetch(API, {
				method: 'PUT',
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify({
					meth: 'supplier_update',
					s_id: id,
					name: name,
					contact: contact
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

    // state variables for the menu
    const [edit, setEdit] = useState(null);
    const [result, setResult] = useState(null);
	const [suppliers, setSuppliers] = useState(null);
	const [message, setMessage] = useState("");

    // handle create/edit inputs
    const handleFields = async (data) => {
		clearMsg();
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

    // handle CRUD inputs
    const handleOps = async (data) => {
		clearMsg();
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
        </>
    );
}

export default Supplier;