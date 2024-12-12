-- Seeding Suppliers
INSERT INTO "Suppliers" (supplier_name, contact_number, email, description, created_at)
VALUES
('Supplier A', '1234567890', 'supplierA@example.com', 'Supplier of high-quality products.', NOW())
ON CONFLICT (email) DO NOTHING;

INSERT INTO "Suppliers" (supplier_name, contact_number, email, description, created_at)
VALUES
('Supplier B', '0987654321', 'supplierB@example.com', 'Trusted supplier of raw materials.', NOW())
ON CONFLICT (email) DO NOTHING;

INSERT INTO "Suppliers" (supplier_name, contact_number, email, description, created_at)
VALUES
('Supplier C', '1122334455', 'supplierC@example.com', 'Specialized in electronics supplies.', NOW())
ON CONFLICT (email) DO NOTHING;

-- Seeding Importations
WITH supplier_ids AS (
    SELECT supplier_id FROM "Suppliers" WHERE supplier_name IN ('Supplier A', 'Supplier B', 'Supplier C')
),
new_importations AS (
    INSERT INTO "Importations" (supplier_id, import_date, total_price, remarks)
    SELECT
        supplier_ids.supplier_id,
        NOW(),
        CASE supplier_ids.supplier_id
            WHEN (SELECT supplier_id FROM "Suppliers" WHERE supplier_name = 'Supplier A') THEN 5000.00
            WHEN (SELECT supplier_id FROM "Suppliers" WHERE supplier_name = 'Supplier B') THEN 3000.00
            WHEN (SELECT supplier_id FROM "Suppliers" WHERE supplier_name = 'Supplier C') THEN 7000.00
        END,
        CASE supplier_ids.supplier_id
            WHEN (SELECT supplier_id FROM "Suppliers" WHERE supplier_name = 'Supplier A') THEN 'Monthly supply'
            WHEN (SELECT supplier_id FROM "Suppliers" WHERE supplier_name = 'Supplier B') THEN 'Special order for promotion'
            WHEN (SELECT supplier_id FROM "Suppliers" WHERE supplier_name = 'Supplier C') THEN 'Bulk order for seasonal sale'
        END
    FROM supplier_ids
    WHERE NOT EXISTS (
        SELECT 1 FROM "Importations" WHERE supplier_id = supplier_ids.supplier_id
    )
    RETURNING importation_id
)
SELECT * FROM new_importations;

-- Seeding Import_Items
WITH importation_ids AS (
    SELECT importation_id FROM "Importations"
),
all_products AS (
    SELECT product_id FROM "Products" LIMIT 3
),
new_import_items AS (
    INSERT INTO "Import_Items" (import_id, product_id, quantity, unit_price, total_price)
    SELECT
        importation_ids.importation_id,
        all_products.product_id,
        10, -- Quantity
        50.0, -- Unit Price
        10 * 50.0 -- Total Price
    FROM importation_ids
    CROSS JOIN all_products
    WHERE NOT EXISTS (
        SELECT 1 FROM "Import_Items" 
        WHERE import_id = importation_ids.importation_id AND product_id = all_products.product_id
    )
    RETURNING import_item_id
)
SELECT * FROM new_import_items;
