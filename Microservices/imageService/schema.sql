CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS images (
    image_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL, 
    url TEXT NOT NULL
);

/*
--old table from layered, kept here for debugging
CREATE TABLE IF NOT EXISTS images (
    image_id UUID PRIMARY KEY,
    product_id UUID NOT NULL REFERENCES products(product_id) ON DELETE CASCADE,
    url TEXT NOT NULL
);
*/
