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
			<p>{edit == null ? "create" : "modify"} image:</p>
			{fields.map((data) => (
				<>
					<label>image {data[0]}:
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

function Image({fields, ops, myOps, result, setResult, getErrorMsg}) {

	// api calls
	const API = 'http://localhost:8000/images/';

	async function list() {
		try {
			let res = await fetch(API, {
				method: 'GET',
				headers: {'Content-Type': 'application/json'}
			});
			let data = await res.json();
			if (res.status > 299) return console.error(data);
			return data["images"];
		} catch(error) { console.error(error); }
	}

	async function create(p_id, url) {
		try {
			let res = await fetch(API, {
				method: 'POST',
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify({
					p_id: p_id,
					url: url
				})
			});
			let data = await res.json();
			if (res.status > 299) {
				let msg = getErrorMsg(data);
				setMessage(msg);
			}
			return data["i_id"];
		} catch(error) { console.error(error); }
	}

	async function read(id) {
		try {
			let res = await fetch(API + "?i_id=" + id, {
				method: 'GET',
				headers: {'Content-Type': 'application/json'}
			});
			let data = await res.json();
			if (res.status > 299) return console.error(data);
			data = data["image"];
			let image = {
				i_id: data[0],
				p_id: data[1],
				url: data[2]
			};
			return image;
		} catch(error) { console.error(error); }
	}

	async function remove(id) {
		try {
			let res = await fetch(API + id, {
				method: 'DELETE',
				headers: {'Content-Type': 'application/json'}
			});
			if (res.status > 299) return console.error(data);
		} catch(error) { console.error(error); }
	}

	async function update(id, p_id, url) {
		try {
			let res = await fetch(API + id, {
				method: 'PUT',
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify({
					p_id: p_id,
					url: url
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
	const [images, setImages] = useState(null);
	const [message, setMessage] = useState("");

	// handle create/edit inputs
	const handleFields = async (data) => {
		setMessage('');
		let inputs = [];
		for (let i = 0; i < fields.length; i ++) {
			inputs.push(data.get(fields[i][0]));
		}
		if (edit != null) {
			let id = edit["i_id"];
			let op = await update(id, ...inputs);
			if (op) setEdit(null);
			else return;
		} else {
			let id = await create(...inputs);
			setResult(id);
		}
		setImages(null);
	};

	// handle CRUD inputs
	const handleOps = async (data) => {
		setMessage('');
		let type = data.get("type");
		let id = data.get("image");
		if (id == null)
			return;
		let image;
		switch(type) {
			case ops.edit:
				image = await read(id);
				setEdit(image);
				break;
			case ops.del:
				remove(id);
				setImages(null);
				break;
			case ops.view:
				image = await read(id);
				setResult(JSON.stringify(image));
				break;
		}
	};

	async function getImages() {
		let temp = await list();
		if (temp !== undefined) {
			setImages(temp);
		}
	}

	useEffect(() => {
		// Only run this effect when the component mounts and 'images' is null
		if (images === null) {
			getImages();
		}
	}, [images]); // Re-run only when 'images' changes (e.g., set to null elsewhere)

	return (
		<>
			<h2>image portal</h2>
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
						<p>on image:</p>
						<ul>
							{images != null &&
								images.map((image) => (
									<li key={image}>
										<label>
											<input type="radio" name="image" value={image} />{image}
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

export default Image;