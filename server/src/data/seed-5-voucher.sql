INSERT INTO "Vouchers" ("voucher_code", "voucher_name", "description", "discount_amount", "valid_from", "valid_to", "is_active")
VALUES
    ('DISCOUNT10', 'Discount10', '10% off on all orders.', 10.0, '2024-01-01', '2024-12-31', true),
    ('SUMMER20', 'Summer20', '20% discount for summer sale.', 20.0, '2024-06-01', '2024-08-31', true),
    ('FREESHIP', 'FreeShip', 'Free shipping on orders over $50.', 0.0, '2024-01-01', '2024-12-31', true),
    ('WELCOME5', 'Welcome5', '5% discount for first-time customers.', 5.0, '2024-01-01', '2024-12-31', true);