import { useState, useEffect } from 'react';

function Product({fields, products}) {

    const RUDs = {
        view: "get",
        edit: "edit",
        delete: "del",
        associate: "assoc",
        dissassociate: "diss"
    };

    const product = {name: "phone", description: "mobile device", quantity: 0, price: 34.5};

    const [edit, setEdit] = useState(null);

    const handleFields = (data) => {
        let inputs = fields;
        for (let i = 0; i < inputs.length; i ++) {
            inputs[i][1] = data.get(inputs[i][0]);
        }
        console.log(inputs);
        if (edit != null)
            setEdit(null);
    };

    const handleRUD = (data) => {
        let type = data.get("type");
        let prod = data.get("prod");
        switch(type) {
            case RUDs.edit:
                setEdit(product);
                break;
            case RUDs.delete:
                console.log("delete " + prod)
                break;
            case RUDs.associate:
                console.log("assoc " + prod)
                break;
            case RUDs.dissassociate:
                console.log("diss " + prod)
                break;
            case RUDs.view:
            default:
                console.log("view " + prod)
                break;
        }
    };

    function Content() {
        if (edit == null) {
            return (
                <>
                    <form action={handleFields}>
                        {fields.map((data) => (
                            <>
                                <label>product {data[0]}:
                                    <input type={data[1]} name={data[0]} />
                                </label>
                            </>
                        ))}
                        <button type="submit">create</button>
                        <p name="msg">validation message</p>
                    </form>
                    <form action={handleRUD}>
                        <p>perform</p>
                        <ul>
                            <li>
                                <label>
                                    <input type="radio" name="type" value={RUDs.view} />view
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
                            {products.map((product) => (
                                <li key={product}>
                                    <label>
                                        <input type="radio" name="prod" value={product} />{product}
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
                <p>editing {product.name}:</p>
                <button onClick={() => setEdit(null)}>back</button>
                <form action={handleFields}>
                    {fields.map((data) => (
                        <>
                            <label>product {data[0]}:
                                <input type={data[1]} name={data[0]} value={product[data[0]]} />
                            </label>
                        </>
                    ))}
                    <button type="submit">update</button>
                    <p name="msg">validation message</p>
                </form>
            </>
        );
    }

    return (
        <>
            <h2>product portal</h2>
            <Content />
        </>
    );
}

export default Product;