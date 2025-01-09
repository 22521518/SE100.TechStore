WITH all_products AS (
    SELECT
        p."product_id",
        p."product_name",
        p."price",
        p."discount",
        COUNT(oi."order_id") AS "order_count"
    FROM "Products" p
    LEFT JOIN "Order_Items" oi ON p."product_id" = oi."product_id"
    GROUP BY p."product_id", p."product_name", p."price"
    ORDER BY random()  -- Randomize product selection
    LIMIT 10          -- Restrict to 10 random products
),

new_orders AS (
    INSERT INTO "Orders" ("order_id", "customer_id", "order_status", "total_price", "voucher_code", "payment_method")
    SELECT
        'ORD' || LPAD((ROW_NUMBER() OVER (ORDER BY random()))::TEXT, 3, '0'),
        c."customer_id",
        (ARRAY['PENDING', 'CONFIRMED', 'SHIPPED', 'CANCELLED'])[FLOOR(random() * 4 + 1)::INT]::"ORDER_STATUS", -- Random order status
        p."price",
        NULL,
        'COD'::"PAYMENT_METHOD"
    FROM "Customers" c
    CROSS JOIN all_products p
    LIMIT 10 -- Generate orders for 10 products
    RETURNING "order_id", "customer_id"
),

new_orders_with_products AS (
    SELECT
        o."order_id",
        o."customer_id",
        p."product_id",
        p."discount",
        p."price"
    FROM new_orders o
    CROSS JOIN all_products p
),  

order_items AS (
    INSERT INTO "Order_Items" ("order_id", "product_id", "quantity", "unit_price", "total_price")
    SELECT
        nop."order_id",
        nop."product_id",
        3,  -- Fixed quantity per product
        nop."price" - (nop."price" * COALESCE(nop."discount", 0)), -- Discount applied
        (nop."price" - (nop."price" * COALESCE(nop."discount", 0))) * 3  -- Total price for the quantity
    FROM new_orders_with_products nop
    RETURNING "order_id", "product_id", "quantity", "unit_price", "total_price"
)

INSERT INTO "Shipping_Address" ("shipping_id", "order_id", "shipping_status", "delivery_date", "city", "district", "ward", "address", "full_name", "phone_number")
SELECT
    'SHIP' || LPAD((ROW_NUMBER() OVER (ORDER BY random()))::TEXT, 3, '0'),
    nor."order_id",
    (ARRAY['PENDING', 'CONFIRMED', 'SHIPPED', 'CANCELLED'])[FLOOR(random() * 4 + 1)::INT]::"ORDER_STATUS", -- Random shipping status
    '2024-11-25 10:00:00'::TIMESTAMP,
    ca."city",
    ca."district",
    ca."ward",
    ca."address",
    c."full_name",
    c."phone_number"
FROM new_orders nor
JOIN "Customer_Address" ca ON nor."customer_id" = ca."customer_id"
JOIN "Customers" c ON nor."customer_id" = c."customer_id";
