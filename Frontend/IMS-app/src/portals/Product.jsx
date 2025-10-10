import { useState, useEffect } from 'react';

function Product({fields, products}) {

    const handleCreate = () => {
        let inputs = fields;
        for (let i = 0; i < inputs.length; i ++) {
            inputs[i][1] = document.getElementById(inputs[i][0]).value;
        }
        console.log(inputs);
    };

    const handleRUD = (prod) => {
        console.log(prod);
    };

    const [ choice, setChoice ] = useState(null);
    useEffect(() => {
        if (choice != null)
            handleCRUD(choice);
    }, [choice]);

    return (
        <>
            <h2>product portal</h2>
            <form onSubmit={(e) => { e.preventDefault(); handleCreate(); }}>
                {fields.map((data) => (
                    <>
                        <label>{"product " + data[0] + ":"}
                            <input type={data[1]} id={data[0]} />
                        </label>
                    </>
                ))}
                <button type="submit">create</button>
                <p name="msg">validation message</p>
            </form>
            <form onSubmit={(e) => { e.preventDefault(); }}>
                <p>perform</p>
                <ul>
                    <li>
                        <label>
                            <input type="radio" name="rud" value="view" />view
                        </label>
                    </li>
                    <li>
                        <label>
                            <input type="radio" name="rud" value="edit" />edit
                        </label>
                    </li>
                    <li>
                        <label>
                            <input type="radio" name="rud" value="delete" />delete
                        </label>
                    </li>
                    <li>
                        <label>
                            <input type="radio" name="rud" value="assoc" />associate
                        </label>
                    </li>
                    <li>
                        <label>
                            <input type="radio" name="rud" value="diss" />dissassociate
                        </label>
                    </li>
                </ul>
                <p>on product:</p>
                <ul>
                    {products.map((product) => (
                        <li key={product}>
                            <button onClick={() => setChoice(product)}>{product}</button>
                        </li>
                    ))}
                </ul>
            </form>
        </>
    );
}

export default Product;