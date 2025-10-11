import { useState } from 'react';

// validation message html
const ValidationMsg = ({message}) => {
	return (
		<p name="msg" style={{color: "red"}}>{message}</p>
	);
}

// field form html
const FieldForm = ({fields, edit, close, formAction}) => {
	return (
		<form action={formAction}>
			{edit != null && <button onClick={close}>cancel edit</button>}
			<p>{edit == null ? "create" : "modify"} product:</p>
			{fields.map((data) => (
				<>
					<label>product {data[0]}:
						{edit == null ?
							<input type={data[1]} name={data[0]} />
						:
							<input type={data[1]} name={data[0]} value={edit[data[0]]} />
						}
					</label>
				</>
			))}
			<button type="submit">{edit == null ? "create" : "update"}</button>
		</form>
	);
}

function Product({fields, operations, products, create, read, update, remove, results, message}) {

    const mProduct = {name: "phone", description: "mobile device", quantity: 0, price: 34.5};

    // state variables for the menu
    const [edit, setEdit] = useState(null);
    const [requireId, setRequireId] = useState(null);

    // handle create/edit inputs
    const handleFields = (data) => {
        let inputs = [];
        for (let i = 0; i < fields.length; i ++) {
            inputs.push(data.get(fields[i][0]));
        }
        console.log(inputs);
        if (edit != null) {
			let id = data.get("prod");
			update(id, ...inputs);
			setEdit(null);
		} else
            create(...inputs);
    };

    // handle supplier/category associations
    const handleAssociation = (data) => {
        let type = data.get("type");
        let id = data.get("id");
        console.log([type, id]);
        setRequireId(null);
    }

    // handle CRUD inputs
    const handleRUD = (data) => {
        let type = data.get("type");
        let prod = data.get("prod");
        switch(type) {
            case operations.edit:
                setEdit();
                break;
            case operations.delete:
                remove(prod);
                break;
            case operations.associate:
                setRequireId(operations.associate);
                break;
            case operations.dissassociate:
                setRequireId(operations.dissassociate);
                break;
            case operations.view:
            default:
                read(prod);
                break;
        }
    };

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
                    </form>
					<ValidationMsg message={message}/>
                </>
            );
        }
        // crud interface
        return (
            <>
                <FieldForm fields={fields} formAction={handleFields} edit={edit} close={() => setEdit(null)} />
				<ValidationMsg message={message}/>
				{edit == null &&
					<form action={handleRUD}>
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
            <Menu />
        </>
    );
}

export default Product;