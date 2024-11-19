----------------------------------------------------- PRODUCTS -----------------------------------------------------

-- Insert into Categories
INSERT INTO "Categories" ("category_name", "description")
VALUES
('Phones', 'Smartphones and feature phones from top brands'),
('Laptops', 'Personal and business laptops with the latest technology'),
('Headphones', 'Wireless and wired headphones with superior sound quality'),
('Cores', 'High-performance processors for computers and servers'),
('Memory', 'RAM and storage devices for various computing needs'),
('Tablets', 'Portable touchscreen devices for work and play'),
('Smartwatches', 'Wearable devices with smart features'),
('Gaming Consoles', 'Consoles for next-generation gaming experiences'),
('Monitors', 'High-resolution monitors for work and entertainment'),
('Keyboards', 'Mechanical and wireless keyboards for productivity'),
('Smart Home', 'Devices to make your home smarter and more efficient'),
('Cameras', 'Digital cameras for photography enthusiasts'),
('Printers', 'High-quality printers for home and office use');

-- Insert into Products
INSERT INTO "Products" ("product_id", "product_name", "images", "description", "price", "discount", "stock_quantity")
VALUES
(gen_random_uuid()::VARCHAR, 'iPhone 14', 
  ARRAY['https://picsum.photos/200/300'], 
  'Latest Apple smartphone with advanced features', 24000000.0, 10, 50),
(gen_random_uuid()::VARCHAR, 'Samsung Galaxy S22', 
  ARRAY['https://picsum.photos/200/300'], 
  'Flagship Samsung smartphone with high-end specs', 21600000.0, 15, 70),
(gen_random_uuid()::VARCHAR, 'Dell XPS 13', 
  ARRAY['https://picsum.photos/200/300'], 
  'Compact and powerful laptop for productivity', 31200000.0, 20, 30),
(gen_random_uuid()::VARCHAR, 'Sony WH-1000XM5', 
  ARRAY['https://picsum.photos/200/300'], 
  'Noise-cancelling headphones for audiophiles', 9600000.0, 5, 100),
(gen_random_uuid()::VARCHAR, 'Intel Core i9-12900K', 
  ARRAY['https://picsum.photos/200/300'], 
  '12th Gen Intel Core processor with 16 cores', 14160000.0, 10, 40),
(gen_random_uuid()::VARCHAR, 'Kingston Fury 16GB DDR5', 
  ARRAY['https://picsum.photos/200/300'], 
  'High-speed RAM for gaming and performance', 3120000.0, 0, 200),
(gen_random_uuid()::VARCHAR, 'iPad Pro', 
  ARRAY['https://picsum.photos/200/300'], 
  'High-performance tablet with Apple M1 chip', 26400000.0, 15, 40),
(gen_random_uuid()::VARCHAR, 'Galaxy Tab S8', 
  ARRAY['https://picsum.photos/200/300'], 
  'Samsung tablet with a vibrant display and S Pen', 20400000.0, 10, 60),
(gen_random_uuid()::VARCHAR, 'Apple Watch Series 8', 
  ARRAY['https://picsum.photos/200/300'], 
  'Smartwatch with advanced health tracking', 12000000.0, 5, 100),
(gen_random_uuid()::VARCHAR, 'Samsung Galaxy Watch 5', 
  ARRAY['https://picsum.photos/200/300'], 
  'Stylish smartwatch with long battery life', 7920000.0, 10, 80),
(gen_random_uuid()::VARCHAR, 'PS5', 
  ARRAY['https://picsum.photos/200/300'], 
  'Next-gen gaming console with stunning graphics', 12000000.0, 0, 30),
(gen_random_uuid()::VARCHAR, 'Xbox Series X', 
  ARRAY['https://picsum.photos/200/300'], 
  'Powerful console with Game Pass support', 12000000.0, 0, 25),
(gen_random_uuid()::VARCHAR, 'LG UltraGear 27', 
  ARRAY['https://picsum.photos/200/300'], 
  'Gaming monitor with 1ms response time', 9600000.0, 20, 50),
(gen_random_uuid()::VARCHAR, 'Dell UltraSharp 24', 
  ARRAY['https://picsum.photos/200/300'], 
  'Professional-grade monitor with accurate colors', 7200000.0, 15, 70),
(gen_random_uuid()::VARCHAR, 'Logitech MX Keys', 
  ARRAY['https://picsum.photos/200/300'], 
  'Premium keyboard for seamless multi-device use', 2400000.0, 10, 120),
(gen_random_uuid()::VARCHAR, 'Razer BlackWidow V4', 
  ARRAY['https://picsum.photos/200/300'], 
  'Mechanical gaming keyboard with RGB lighting', 3600000.0, 10, 80),
(gen_random_uuid()::VARCHAR, 'Google Nest Hub', 
  ARRAY['https://picsum.photos/200/300'], 
  'Smart display for managing your smart home', 3120000.0, 20, 90),
(gen_random_uuid()::VARCHAR, 'Amazon Echo Dot', 
  ARRAY['https://picsum.photos/200/300'], 
  'Compact smart speaker with Alexa', 1200000.0, 5, 200),
(gen_random_uuid()::VARCHAR, 'Canon EOS R6', 
  ARRAY['https://picsum.photos/200/300'], 
  'Full-frame mirrorless camera for professionals', 60000000.0, 10, 15),
(gen_random_uuid()::VARCHAR, 'Sony Alpha A7 IV', 
  ARRAY['https://picsum.photos/200/300'], 
  'High-resolution mirrorless camera with 4K video', 67200000.0, 5, 20),
(gen_random_uuid()::VARCHAR, 'HP LaserJet Pro', 
  ARRAY['https://picsum.photos/200/300'], 
  'Reliable laser printer for small businesses', 7200000.0, 15, 50),
(gen_random_uuid()::VARCHAR, 'Epson EcoTank ET-2760', 
  ARRAY['https://picsum.photos/200/300'], 
  'Cartridge-free printer with high-yield ink bottles', 5520000.0, 10, 60);

-- Insert into _CategoriesToProducts to link categories and products
INSERT INTO "_CategoriesToProducts" ("A", "B")
VALUES
((SELECT "category_id" FROM "Categories" WHERE "category_name" = 'Phones'), (SELECT "product_id" FROM "Products" WHERE "product_name" = 'iPhone 14')),
((SELECT "category_id" FROM "Categories" WHERE "category_name" = 'Phones'), (SELECT "product_id" FROM "Products" WHERE "product_name" = 'Samsung Galaxy S22')),
((SELECT "category_id" FROM "Categories" WHERE "category_name" = 'Laptops'), (SELECT "product_id" FROM "Products" WHERE "product_name" = 'Dell XPS 13')),
((SELECT "category_id" FROM "Categories" WHERE "category_name" = 'Headphones'), (SELECT "product_id" FROM "Products" WHERE "product_name" = 'Sony WH-1000XM5')),
((SELECT "category_id" FROM "Categories" WHERE "category_name" = 'Cores'), (SELECT "product_id" FROM "Products" WHERE "product_name" = 'Intel Core i9-12900K')),
((SELECT "category_id" FROM "Categories" WHERE "category_name" = 'Memory'), (SELECT "product_id" FROM "Products" WHERE "product_name" = 'Kingston Fury 16GB DDR5')),
((SELECT "category_id" FROM "Categories" WHERE "category_name" = 'Tablets'), (SELECT "product_id" FROM "Products" WHERE "product_name" = 'iPad Pro')),
((SELECT "category_id" FROM "Categories" WHERE "category_name" = 'Tablets'), (SELECT "product_id" FROM "Products" WHERE "product_name" = 'Galaxy Tab S8')),
((SELECT "category_id" FROM "Categories" WHERE "category_name" = 'Smartwatches'), (SELECT "product_id" FROM "Products" WHERE "product_name" = 'Apple Watch Series 8')),
((SELECT "category_id" FROM "Categories" WHERE "category_name" = 'Smartwatches'), (SELECT "product_id" FROM "Products" WHERE "product_name" = 'Samsung Galaxy Watch 5')),
((SELECT "category_id" FROM "Categories" WHERE "category_name" = 'Gaming Consoles'), (SELECT "product_id" FROM "Products" WHERE "product_name" = 'PS5')),
((SELECT "category_id" FROM "Categories" WHERE "category_name" = 'Gaming Consoles'), (SELECT "product_id" FROM "Products" WHERE "product_name" = 'Xbox Series X')),
((SELECT "category_id" FROM "Categories" WHERE "category_name" = 'Monitors'), (SELECT "product_id" FROM "Products" WHERE "product_name" = 'LG UltraGear 27')),
((SELECT "category_id" FROM "Categories" WHERE "category_name" = 'Monitors'), (SELECT "product_id" FROM "Products" WHERE "product_name" = 'Dell UltraSharp 24')),
((SELECT "category_id" FROM "Categories" WHERE "category_name" = 'Keyboards'), (SELECT "product_id" FROM "Products" WHERE "product_name" = 'Logitech MX Keys')),
((SELECT "category_id" FROM "Categories" WHERE "category_name" = 'Keyboards'), (SELECT "product_id" FROM "Products" WHERE "product_name" = 'Razer BlackWidow V4')),
((SELECT "category_id" FROM "Categories" WHERE "category_name" = 'Smart Home'), (SELECT "product_id" FROM "Products" WHERE "product_name" = 'Google Nest Hub')),
((SELECT "category_id" FROM "Categories" WHERE "category_name" = 'Smart Home'), (SELECT "product_id" FROM "Products" WHERE "product_name" = 'Amazon Echo Dot')),
((SELECT "category_id" FROM "Categories" WHERE "category_name" = 'Cameras'), (SELECT "product_id" FROM "Products" WHERE "product_name" = 'Canon EOS R6')),
((SELECT "category_id" FROM "Categories" WHERE "category_name" = 'Cameras'), (SELECT "product_id" FROM "Products" WHERE "product_name" = 'Sony Alpha A7 IV')),
((SELECT "category_id" FROM "Categories" WHERE "category_name" = 'Printers'), (SELECT "product_id" FROM "Products" WHERE "product_name" = 'HP LaserJet Pro')),
((SELECT "category_id" FROM "Categories" WHERE "category_name" = 'Printers'), (SELECT "product_id" FROM "Products" WHERE "product_name" = 'Epson EcoTank ET-2760'));
