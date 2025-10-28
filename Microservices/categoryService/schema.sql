CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS categories (
    category_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT
);

CREATE TABLE IF NOT EXISTS category_products (
    category_id UUID NOT NULL,
    product_id UUID NOT NULL,
    PRIMARY KEY (category_id, product_id)
);

/*
--Old table from layered for debugging
CREATE TABLE IF NOT EXISTS category_products (
    category_id UUID NOT NULL REFERENCES categories(category_id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(product_id) ON DELETE CASCADE,
    PRIMARY KEY (category_id, product_id)
);
*/


-- Function: delete category when no products remain
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

-- Trigger
DROP TRIGGER IF EXISTS cp_after_del ON category_products;
CREATE TRIGGER cp_after_del
AFTER DELETE ON category_products
FOR EACH ROW
EXECUTE FUNCTION delete_orphan_category();


