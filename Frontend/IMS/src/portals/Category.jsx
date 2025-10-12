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
			<p>{edit == null ? "create" : "modify"} category:</p>
			{fields.map((data) => (
				<>
					<label>category {data[0]}:
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

function Category({fields, ops, myOps, list, create, read, update, remove, readProducts, message, clearMsg}) {

	// state variables for the menu
	const [edit, setEdit] = useState(null);
	const [result, setResult] = useState(null);
	const [categories, setCategories] = useState(null);

	// handle create/edit inputs
	const handleFields = async (data) => {
		clearMsg();
		let inputs = [];
		for (let i = 0; i < fields.length; i ++) {
			inputs.push(data.get(fields[i][0]));
		}
		if (edit != null) {
			let id = edit["c_id"];
			let op = await update(id, ...inputs);
			if (op) setEdit(null);
			else return;
		} else {
			let id = await create(...inputs);
			setResult(id);
		}
		setCategories(null);
	};

	// handle CRUD inputs
	const handleOps = async (data) => {
		clearMsg();
		let type = data.get("type");
		let id = data.get("category");
		if (id == null)
			return;
		let category;
		switch(type) {
			case ops.edit:
				category = await read(id);
				setEdit(category);
				break;
			case ops.del:
				remove(id);
				setCategories(null);
				break;
			case ops.prods:
				let prods = await readProducts(id);
				setResult(prods);
				break;
			case ops.view:
				category = await read(id);
				setResult(JSON.stringify(category));
				break;
		}
	};

	async function getCategories() {
		let temp = await list();
		if (temp !== undefined) {
			setCategories(temp);
		}
	}

	useEffect(() => {
		// Only run this effect when the component mounts and 'categories' is null
		if (categories === null) {
			getCategories();
		}
	}, [categories]); // Re-run only when 'categories' changes (e.g., set to null elsewhere)

	return (
		<>
			<h2>category portal</h2>
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
						<p>on category:</p>
						<ul>
							{categories != null &&
								categories.map((category) => (
									<li key={category}>
										<label>
											<input type="radio" name="category" value={category} />{category}
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

export default Category;