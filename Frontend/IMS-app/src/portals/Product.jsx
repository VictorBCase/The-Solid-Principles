function Product({fields, products}) {

    const createProduct = () => {};
    const handleCRUD = () => {};

    return (
        <>
            <h2>product portal</h2>
            <form onSubmit={(e) => { e.preventDefault(); createProduct(); }}>
                {fields.map((data) => (
                    <>
                        <label>{"product " + data[0] + ":"}
                            <input type={data[1]} name={data[0]} />
                        </label>
                    </>
                ))}
                <button type="submit">create</button>
                <p>validation message</p>
            </form>
            <form onSubmit={(e) => { e.preventDefault(); handleCRUD(); }}>
                <p>perform</p>
                <li>
                    <label>
                        <input type="radio" name="crud" value="view" />view
                    </label>
                </li>
                <li>
                    <label>
                        <input type="radio" name="crud" value="edit" />edit
                    </label>
                </li>
                <li>
                    <label>
                        <input type="radio" name="crud" value="delete" />delete
                    </label>
                </li>
                <li>
                    <label>
                        <input type="radio" name="crud" value="assoc" />associate
                    </label>
                </li>
                <li>
                    <label>
                        <input type="radio" name="crud" value="diss" />dissassociate
                    </label>
                </li>
                <p>on product:</p>
                <ul>
                    {products.map((product) => (
                        <li key={product}>{product}</li>
                    ))}
                </ul>
            </form>
        </>
    );
}

export default Product;