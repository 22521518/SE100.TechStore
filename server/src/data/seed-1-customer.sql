----------------------------------------------------- CUSTOMERS -----------------------------------------------------
WITH new_accounts AS (
    INSERT INTO "Accounts" ("account_id", "email", "password")
    VALUES
    (gen_random_uuid()::VARCHAR, 'user1@example.com', '123456789'),
    (gen_random_uuid()::VARCHAR, 'user2@example.com', '123456789'),
    (gen_random_uuid()::VARCHAR, 'user3@example.com', '123456789')
    RETURNING "account_id", "email"
), new_customers AS (
    INSERT INTO "Customers" ("account_id", "customer_id", "username", "full_name", "phone_number", "image", "male", "birth_date")
    SELECT 
        "account_id",
        gen_random_uuid()::VARCHAR AS "customer_id",
         
        CASE "email"
            WHEN 'user1@example.com' THEN 'user1'
            WHEN 'user2@example.com' THEN 'user2'
            WHEN 'user3@example.com' THEN 'user3'
        END AS "username",

        CASE "email"
            WHEN 'user1@example.com' THEN 'John Doe'
            WHEN 'user2@example.com' THEN 'Jane Smith'
            WHEN 'user3@example.com' THEN 'Alex Johnson'
        END AS "full_name",

        CASE "email"
            WHEN 'user1@example.com' THEN '0123456789'
            WHEN 'user2@example.com' THEN '0987654321'
            WHEN 'user3@example.com' THEN '0112233445'
        END AS "phone_number",

        CASE "email"
            WHEN 'user1@example.com' THEN 'https://gravatar.com/avatar/c667c5863300fc157810ebc0b58e2618?s=400&d=robohash&r=x'
            WHEN 'user2@example.com' THEN 'https://gravatar.com/avatar/c667c5863300fc157810ebc0b58e2618?s=400&d=robohash&r=x'
            ELSE 'https://gravatar.com/avatar/c667c5863300fc157810ebc0b58e2618?s=400&d=robohash&r=x'
        END AS "image",

        CASE "email"
            WHEN 'user2@example.com' THEN false ELSE true END AS "male",

        CASE "email"
            WHEN 'user1@example.com' THEN '1990-01-01'
            WHEN 'user2@example.com' THEN '1995-05-05'
            WHEN 'user3@example.com' THEN '2000-03-15'
        END::DATE AS "birth_date"

    FROM new_accounts
    RETURNING "customer_id", "username", "full_name", "phone_number"
)
INSERT INTO "Customer_Address" ("customer_id", "city", "district", "ward", "address", "is_primary", "full_name", "phone_number")
SELECT 
    "customer_id", 
    CASE "username"
        WHEN 'user1' THEN 'Hanoi'
        WHEN 'user2' THEN 'Ho Chi Minh City'
        WHEN 'user3' THEN 'Da Nang'
    END AS "city",
    CASE "username"
        WHEN 'user1' THEN 'Dong Da'
        WHEN 'user2' THEN 'District 1'
        WHEN 'user3' THEN 'Hai Chau'
    END AS "district",
    CASE "username"
        WHEN 'user1' THEN 'Cat Linh'
        WHEN 'user2' THEN 'Ben Nghe'
        WHEN 'user3' THEN 'Thach Thang'
    END AS "ward",
    CASE "username"
        WHEN 'user1' THEN '123 Cat Linh Street'
        WHEN 'user2' THEN '456 Nguyen Hue Boulevard'
        WHEN 'user3' THEN '789 Tran Phu Street'
    END AS "address",
    true AS "is_primary",
    "full_name",
    "phone_number"
FROM new_customers;