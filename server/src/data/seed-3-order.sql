WITH all_products AS (
    SELECT
        p."product_id",
        p."product_name",
        p."price",
        COUNT(oi."order_id") AS "order_count"
    FROM "Products" p
    LEFT JOIN "Order_Items" oi ON p."product_id" = oi."product_id"
    GROUP BY p."product_id", p."product_name", p."price"
),

new_orders AS (
    INSERT INTO "Orders" ("order_id", "customer_id", "order_status", "total_price", "voucher_code", "payment_method")
    SELECT
        'ORD' || LPAD((ROW_NUMBER() OVER (ORDER BY random()))::TEXT, 3, '0'),
        c."customer_id",
        'CONFIRMED'::"ORDER_STATUS",
        p."price" * 1,  -- Assuming unit price for 1 quantity per product
        NULL,
        'COD'::"PAYMENT_METHOD"
    FROM "Customers" c
    CROSS JOIN all_products p  -- Ensure "all_products" is being properly referenced
    WHERE p."order_count" < 10  -- Only generate orders for products with less than 10 orders
    LIMIT 30
    RETURNING "order_id", "customer_id", p."product_id"  -- Return product_id here correctly
),

order_items AS (
    INSERT INTO "Order_Items" ("order_id", "product_id", "quantity", "unit_price", "total_price")
    SELECT
        nor."order_id",
        p."product_id",  -- p is now referenced correctly
        1,  -- 1 unit per order item (adjust as needed)
        p."price",
        p."price" * 1  -- Total price for 1 unit
    FROM new_orders nor
    JOIN "Products" p ON nor."product_id" = p."product_id"  -- Proper join with "Products"
    RETURNING "order_id", "product_id"
),

new_invoices AS (
    INSERT INTO "Invoices" ("invoice_id", "order_id", "total_price")
    SELECT
        'INV' || LPAD((ROW_NUMBER() OVER (ORDER BY random()))::TEXT, 3, '0'),
        nor."order_id",
        o."total_price" * 1  -- Total price for 1 unit
    FROM new_orders nor
    JOIN "Orders" o ON nor."order_id" = o."order_id"
    RETURNING "invoice_id", "order_id"
)

INSERT INTO "Shipping_Address" ("shipping_id", "address_id", "order_id", "shipping_status", "delivery_date")
SELECT
    'SHIP' || LPAD((ROW_NUMBER() OVER (ORDER BY random()))::TEXT, 3, '0'),
    ca."address_id",
    nor."order_id",
    'CONFIRMED'::"ORDER_STATUS",
    '2024-11-25 10:00:00'::TIMESTAMP
FROM new_orders nor
JOIN "Customer_Address" ca ON nor."customer_id" = ca."customer_id";
