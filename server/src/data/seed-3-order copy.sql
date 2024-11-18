----------------------------------------------------- ORDERS -----------------------------------------------------
-- Insert Orders
WITH new_orders AS (
    INSERT INTO "Orders" ("order_id", "customer_id", "order_status", "total_price", "voucher_code", "payment_method")
    VALUES
    ('ORD001', (SELECT "customer_id" FROM "Customers" WHERE "username" = 'user1'), 'CONFIRMED'::"ORDER_STATUS", 1500.00, NULL, 'COD'::"PAYMENT_METHOD"),
    ('ORD002', (SELECT "customer_id" FROM "Customers" WHERE "username" = 'user2'), 'SHIPPED'::"ORDER_STATUS", 2500.00, NULL, 'CREDIT_CARD'::"PAYMENT_METHOD"),
    ('ORD003', (SELECT "customer_id" FROM "Customers" WHERE "username" = 'user3'), 'DELIVERED'::"ORDER_STATUS", 1000.00, NULL, 'ELECTRO_WALLET'::"PAYMENT_METHOD")
    RETURNING "order_id", "customer_id"
),

-- Insert Order Items
order_items AS (
    INSERT INTO "Order_Items" ("order_id", "product_id", "quantity", "unit_price", "total_price")
    VALUES
    ('ORD001', (SELECT "product_id" FROM "Products" WHERE "product_name" = 'iPhone 14'), 1, 999.99, 999.99),
    ('ORD002', (SELECT "product_id" FROM "Products" WHERE "product_name" = 'Samsung Galaxy S22'), 1, 899.99, 899.99),
    ('ORD003', (SELECT "product_id" FROM "Products" WHERE "product_name" = 'Kingston Fury 16GB DDR5'), 2, 129.99, 200.00)
    RETURNING "order_id", "product_id"
),

-- Insert Invoices
new_invoices AS (
    INSERT INTO "Invoices" ("invoice_id", "order_id", "total_price")
    VALUES
    ('INV001', 'ORD001', 999.99),
    ('INV002', 'ORD002', 899.99),
    ('INV003', 'ORD003', 200.00)
    RETURNING "invoice_id", "order_id"
)

-- Insert Shipping Address
INSERT INTO "Shipping_Address" ("shipping_id", "address_id", "order_id", "shipping_status", "delivery_date")
SELECT
    'SHIP001', (SELECT "address_id" FROM "Customer_Address" WHERE "city" = 'Hanoi'), 'ORD001', 'CONFIRMED'::"ORDER_STATUS", '2024-11-18 10:00:00'::TIMESTAMP
UNION ALL
SELECT
    'SHIP002', (SELECT "address_id" FROM "Customer_Address" WHERE "city" = 'Ho Chi Minh City'), 'ORD002', 'SHIPPED'::"ORDER_STATUS", '2024-11-20 15:00:00'::TIMESTAMP
UNION ALL
SELECT
    'SHIP003', (SELECT "address_id" FROM "Customer_Address" WHERE "city" = 'Da Nang'), 'ORD003', 'DELIVERED'::"ORDER_STATUS", '2024-11-15 09:00:00'::TIMESTAMP;
