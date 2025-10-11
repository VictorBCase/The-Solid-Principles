import { useState, useEffect } from 'react'; // Make sure useEffect is imported

// validation message html
const ValidationMsg = ({message, clear}) => {
	if (message == '') return <></>;
	return (
		<>
			<p name="msg" style={{color: "red"}}>{message}</p>
			<button onClick={() => clear()}>clear</button>
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

function Product({fields, operations, list, create, read, update, remove, message, clearMsg}) {

    // state variables for the menu
    const [edit, setEdit] = useState(null);
    const [result, setResult] = useState(null);
    const [requireId, setRequireId] = useState(null);
	const [products, setProducts] = useState(null);

    // handle create/edit inputs
    const handleFields = async (data) => {
        let inputs = [];
        for (let i = 0; i < fields.length; i ++) {
            inputs.push(data.get(fields[i][0]));
        }
        console.log(inputs);
        if (edit != null) {
			let id = edit["p_id"];
			await update(id, ...inputs);
			setEdit(null);
		} else {
            let id = await create(...inputs);
			setResult(id);
		}
        setProducts(null);
    };

    // handle supplier/category associations
    const handleAssociation = (data) => {
        let type = data.get("type");
        let id = data.get("id");
        console.log([type, id]);
        setRequireId(null);
    }

    // handle CRUD inputs
    const handleOps = async (data) => {
        let type = data.get("type");
        let id = data.get("prod");
		let product;
        switch(type) {
            case operations.edit:
                product = await read(id);
				setEdit(product);
                break;
            case operations.delete:
                remove(id);
				setProducts(null);
                break;
            case operations.associate:
                setRequireId(operations.associate);
                break;
            case operations.dissassociate:
                setRequireId(operations.dissassociate);
                break;
            case operations.view:
            default:
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

	async function getProduct(id) {
		let temp = await read(id);
		setResult(temp);
	}

    function Menu() {
        if (requireId != null) {
            // association interface
            return (
                <>
                    <button onClick={() => setRequireId(null)}>back</button>
                    <form action={handleAssociation}>
                        <label>
                            <input type="radio" name="type" value="supplier" defaultChecked />supplier
                        </label>
                        <label>
                            <input type="radio" name="type" value="category" />category
                        </label>
                        <br />
                        <label>provide id to {requireId == operations.associate ? "associate" : "dissasociate"} with this product:
                            <input type="text" name="id" />
                            <button type="submit">confirm</button>
                        </label>
                        <ValidationMsg />
                    </form>
                </>
            );
        }
        // crud interface
		useEffect(() => {
            // Only run this effect when the component mounts and 'products' is null
            if (products === null) {
                getProducts();
            }
        }, [products]); // Re-run only when 'products' changes (e.g., set to null elsewhere)
        return (
            <>
                <FieldForm fields={fields} edit={edit} close={() => setEdit(null)} formAction={handleFields} />
				{edit === null &&
					<form action={handleOps}>
						<p>perform</p>
						<ul>
							<li>
								<label>
									<input type="radio" name="type" value={operations.view} defaultChecked />view
								</label>
							</li>
							<li>
								<label>
									<input type="radio" name="type" value={operations.edit} />edit
								</label>
							</li>
							<li>
								<label>
									<input type="radio" name="type" value={operations.delete} />delete
								</label>
							</li>
							<li>
								<label>
									<input type="radio" name="type" value={operations.associate} />associate
								</label>
							</li>
							<li>
								<label>
									<input type="radio" name="type" value={operations.dissassociate} />dissassociate
								</label>
							</li>
						</ul>
						<p>on product:</p>
						<ul>
							{products != null ?
								products.map((product) => (
									<li key={product}>
										<label>
											<input type="radio" name="prod" value={product} />{product}
										</label>
									</li>
								))
							:
								<></>
							}
						</ul>
						<button type="submit">confirm</button>
					</form>
				}
            </>
        );
    }

    return (
        <>
            <h2>product portal</h2>
            <Result result={result} clear={() => setResult(null)} />
            <Menu />
        </>
    );
}

export default Product;