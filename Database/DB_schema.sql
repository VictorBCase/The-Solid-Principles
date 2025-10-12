-- DB_schema.sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS products (
    product_id UUID PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    quantity INTEGER NOT NULL CHECK (quantity >= 0),
    price NUMERIC(20,6) NOT NULL CHECK (price > 0)   
);

CREATE TABLE IF NOT EXISTS suppliers (
    supplier_id UUID PRIMARY KEY,
    name TEXT NOT NULL,
    contact_email TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS categories (
    category_id UUID PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT
);

CREATE TABLE IF NOT EXISTS images (
    image_id UUID PRIMARY KEY,
    product_id UUID NOT NULL REFERENCES products(product_id) ON DELETE CASCADE,
    url TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS category_products (
    category_id UUID NOT NULL REFERENCES categories(category_id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(product_id) ON DELETE CASCADE,
    PRIMARY KEY (category_id, product_id)
);

CREATE TABLE IF NOT EXISTS supplier_products (
    supplier_id UUID NOT NULL REFERENCES suppliers(supplier_id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(product_id) ON DELETE CASCADE,
    PRIMARY KEY (supplier_id, product_id)
);



-- Function to delete supplier w/ no remaining products (supplierProducts)
CREATE OR REPLACE FUNCTION delete_orphan_supplier() RETURNS TRIGGER AS $$
BEGIN
    DELETE FROM suppliers
    WHERE supplier_id = OLD.supplier_id
      AND NOT EXISTS (
          SELECT 1 FROM supplier_products sp WHERE sp.supplier_id = OLD.supplier_id
      );
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Function to delete category w/ no remaining products (categoryProducts)
CREATE OR REPLACE FUNCTION delete_orphan_category() RETURNS TRIGGER AS $$
BEGIN
    DELETE FROM categories
    WHERE category_id = OLD.category_id
      AND NOT EXISTS (
          SELECT 1 FROM category_products cp WHERE cp.category_id = OLD.category_id
      );
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Triggers
DROP TRIGGER IF EXISTS sp_after_del ON supplier_products;
CREATE TRIGGER sp_after_del
AFTER DELETE ON supplier_products
FOR EACH ROW
EXECUTE FUNCTION delete_orphan_supplier();

DROP TRIGGER IF EXISTS cp_after_del ON category_products;
CREATE TRIGGER cp_after_del
AFTER DELETE ON category_products
FOR EACH ROW
EXECUTE FUNCTION delete_orphan_category();
