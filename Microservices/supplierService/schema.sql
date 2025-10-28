CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS suppliers (
    supplier_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    contact_email TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS supplier_products (
    supplier_id UUID NOT NULL,
    product_id UUID NOT NULL,
    PRIMARY KEY (supplier_id, product_id)
);

/*
--Old table from layered for debugging
CREATE TABLE IF NOT EXISTS supplier_products (
    supplier_id UUID NOT NULL REFERENCES suppliers(supplier_id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(product_id) ON DELETE CASCADE,
    PRIMARY KEY (supplier_id, product_id)
);
*/


-- Function: delete supplier when it has no linked products
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

-- Trigger
DROP TRIGGER IF EXISTS sp_after_del ON supplier_products;
CREATE TRIGGER sp_after_del
AFTER DELETE ON supplier_products
FOR EACH ROW
EXECUTE FUNCTION delete_orphan_supplier();
