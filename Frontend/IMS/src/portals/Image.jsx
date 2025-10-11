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

function Image({fields, ops, myOps, list, create, read, update, remove, message, clearMsg}) {

	// state variables for the menu
	const [edit, setEdit] = useState(null);
	const [result, setResult] = useState(null);
	const [requireId, setRequireId] = useState(null);
	const [images, setImages] = useState(null);

	// handle create/edit inputs
	const handleFields = async (data) => {
		let inputs = [];
		for (let i = 0; i < fields.length; i ++) {
			inputs.push(data.get(fields[i][0]));
		}
		if (edit != null) {
			let id = edit["p_id"];
			await update(id, ...inputs);
			setEdit(null);
		} else {
			let id = await create(...inputs);
			setResult(id);
		}
		setImages(null);
	};

	// handle CRUD inputs
	const handleOps = async (data) => {
		clearMsg();
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