----------------------------------------------------- ORDERS -----------------------------------------------------
-- Step 1: Identify all products in the database
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

-- Step 2: Generate new orders for products with less than 10 orders
new_orders AS (
    INSERT INTO "Orders" ("order_id", "customer_id", "order_status", "total_price", "voucher_code", "payment_method")
    SELECT
        'ORD' || LPAD((ROW_NUMBER() OVER (ORDER BY random()))::TEXT, 3, '0'),  -- Generate unique order ID
        c."customer_id",
        'CONFIRMED'::"ORDER_STATUS",
        p."price" * 1,  -- Assuming unit price for 1 quantity per product
        NULL,
        'COD'::"PAYMENT_METHOD",  -- Payment method: COD (Cash on Delivery)
        p."product_id"  -- Include product_id here
    FROM "Customers" c
    CROSS JOIN all_products p
    WHERE p."order_count" < 10  -- Only generate orders for products with less than 10 orders
    LIMIT 30  -- Total number of new orders to be generated (adjust as needed)
    RETURNING "order_id", "customer_id", "product_id"  -- Now returning the product_id correctly
),

-- Step 3: Insert order items for the new orders (link each order to products)
order_items AS (
    INSERT INTO "Order_Items" ("order_id", "product_id", "quantity", "unit_price", "total_price")
    SELECT
        nor."order_id",
        p."product_id",
        1,  -- 1 unit per order item (adjust as needed)
        p."price",
        p."price" * 1  -- Total price for 1 unit
    FROM new_orders nor
    JOIN "Products" p ON nor."product_id" = p."product_id"
    RETURNING "order_id", "product_id"
),

-- Step 4: Insert invoices for the new orders
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

-- Step 5: Insert shipping addresses for the new orders
INSERT INTO "Shipping_Address" ("shipping_id", "address_id", "order_id", "shipping_status", "delivery_date")
SELECT
    'SHIP' || LPAD((ROW_NUMBER() OVER (ORDER BY random()))::TEXT, 3, '0'),
    ca."address_id",
    nor."order_id",
    'CONFIRMED'::"ORDER_STATUS",
    '2024-11-25 10:00:00'::TIMESTAMP
FROM new_orders nor
JOIN "Customer_Address" ca ON nor."customer_id" = ca."customer_id";
