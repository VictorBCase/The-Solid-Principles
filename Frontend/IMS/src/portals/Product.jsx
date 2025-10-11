import { useState, useEffect } from 'react'; // Make sure useEffect is imported

function Product({fields, list, create, read, update, remove}) {

    // supported operations
    const RUDs = {
        view: "get",
        edit: "edit",
        delete: "del",
        associate: "assoc",
        dissassociate: "diss"
    };

    // mock product entry
    const product = {name: "phone", description: "mobile device", quantity: 0, price: 34.5};

    // state variables for the menu
    const [edit, setEdit] = useState(null);
    const [result, setResult] = useState(null);
    const [requireId, setRequireId] = useState(null);
	const [products, setProducts] = useState(null);

    // validation msg -> contents potentially provided by middleware response
    const [message, setMessage] = useState("quantity and price must be greater than zero.");

    // handle create/edit inputs
    async function handleFields(data) {
        let inputs = fields;
        for (let i = 0; i < inputs.length; i ++) {
            inputs[i][1] = data.get(inputs[i][0]);
        }
        console.log(inputs);
        if (edit != null) {
			await update(data.get("prod"), inputs[0][1], inputs[1][1], inputs[2][1], inputs[3][1]);
			setEdit(null);
		} else
            await create(inputs[0][1], inputs[1][1], inputs[2][1], inputs[3][1]);
        getProducts();
    };

    // handle supplier/category associations
    const handleAssociation = (data) => {
        let type = data.get("type");
        let id = data.get("id");
        console.log([type, id]);
        setRequireId(null);
    }

	async function getProduct(id) {
		let temp = await read(id);
		setResult(temp);
	}

    // handle CRUD inputs
    const handleRUD = (data) => {
        let type = data.get("type");
        let prod = data.get("prod");
        switch(type) {
            case RUDs.edit:
                setEdit(product);
                break;
            case RUDs.delete:
                // remove();
                break;
            case RUDs.associate:
                setRequireId(RUDs.associate);
                break;
            case RUDs.dissassociate:
                setRequireId(RUDs.dissassociate);
                break;
            case RUDs.view:
            default:
                getProduct(prod);
                break;
        }
    };

    // display view results
    function Result() {
        if (result == null)
            return <></>;
        return (
            <>
                <p>view {result.name}:</p>
                <p>some result</p>
                <button onClick={() => setResult(null)}>clear result</button>
                <br />
            </>
        );
    }

    // validation message html
    function ValidationMsg() {
        return (
            <p name="msg" style={{color: "red"}}>{message}</p>
        );
    }

    // field form html
    function FieldForm({formAction}) {
        return (
            <form action={formAction}>
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
                <ValidationMsg />
            </form>
        );
    }

	async function getProducts() {
		let temp = await list();
		if (temp !== undefined) {
            setProducts(temp);
        }
	}

    function Menu() {
        if (edit != null) {
            // edit interface
            return (
                <>
                    <button onClick={() => setEdit(null)}>cancel edit</button>
                    <FieldForm formAction={handleFields} />
                </>
            );
        }
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
                        <label>provide id to {requireId == RUDs.associate ? "associate" : "dissasociate"} with this product:
                            <input type="text" name="id" />
                            <button type="submit">confirm</button>
                        </label>
                        <ValidationMsg />
                    </form>
                </>
            );
        }
		useEffect(() => {
            // Only run this effect when the component mounts and 'products' is null
            if (products === null) {
                getProducts();
            }
        }, [products]); // Re-run only when 'products' changes (e.g., set to null elsewhere)

        // crud interface
        return (
            <>
                <FieldForm formAction={handleFields} />
                <form action={handleRUD}>
                    <p>perform</p>
                    <ul>
                        <li>
                            <label>
                                <input type="radio" name="type" value={RUDs.view} defaultChecked />view
                            </label>
                        </li>
                        <li>
                            <label>
                                <input type="radio" name="type" value={RUDs.edit} />edit
                            </label>
                        </li>
                        <li>
                            <label>
                                <input type="radio" name="type" value={RUDs.delete} />delete
                            </label>
                        </li>
                        <li>
                            <label>
                                <input type="radio" name="type" value={RUDs.associate} />associate
                            </label>
                        </li>
                        <li>
                            <label>
                                <input type="radio" name="type" value={RUDs.dissassociate} />dissassociate
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
            </>
        );
    }

    return (
        <>
            <h2>product portal</h2>
            <Result />
            <Menu />
        </>
    );
}

export default Product;