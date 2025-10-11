import { useState } from 'react';

function Category({fields, list, create, update, remove, listProducts}) {

    // supported operations
    const RUDs = {
        view: "get",
		viewProducts: "getProds",
        edit: "edit",
        delete: "del",
    };

    // mock category entry
    const category = {name: "fairphone", description: "email"};

    // state variables for the menu
    const [edit, setEdit] = useState(null);
    const [result, setResult] = useState(null);
	const [categories, setCategories] = useState([]);

    // validation msg -> contents potentially provided by middleware response
    const [message, setMessage] = useState("fields must be non-empty.");

    // handle create/edit inputs
    const handleFields = (data) => {
        let inputs = fields;
        for (let i = 0; i < inputs.length; i ++) {
            inputs[i][1] = data.get(inputs[i][0]);
        }
        console.log(inputs);
        if (edit != null)
            setEdit(null);
        // else
            // create();
    };

    // handle CRUD inputs
    const handleRUD = (data) => {
        let type = data.get("type");
        let prod = data.get("prod");
        switch(type) {
            case RUDs.edit:
                setEdit(category);
                break;
            case RUDs.delete:
                // remove();
                break;
            case RUDs.view:
            default:
                setResult(category);
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
                <p>{edit == null ? "create" : "modify"} category:</p>
                {fields.map((data) => (
                    <>
                        <label>category {data[0]}:
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
								<input type="radio" name="type" value={RUDs.viewProducts} />view products
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
                    </ul>
                    <p>on category:</p>
                    <ul>
                        {categories.map((category) => (
                            <li key={category}>
                                <label>
                                    <input type="radio" name="prod" value={category} />{category}
                                </label>
                            </li>
                        ))}
                    </ul>
                    <button type="submit">confirm</button>
                </form>
            </>
        );
    }

    return (
        <>
            <h2>category portal</h2>
            <Result />
            <Menu />
        </>
    );
}

export default Category;