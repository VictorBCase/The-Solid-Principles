CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS products (
    product_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    quantity INTEGER NOT NULL CHECK (quantity >= 0),
    price NUMERIC(20,6) NOT NULL CHECK (price > 0)
);

CREATE TABLE IF NOT EXISTS product_suppliers (
	product_id UUID NOT NULL,
	supplier_id UUID NOT NULL,
	PRIMARY KEY (product_id, supplier_id),
	FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE
);