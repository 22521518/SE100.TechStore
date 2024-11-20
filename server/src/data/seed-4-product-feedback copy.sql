----------------------------------------------------- PRODUCTS FEEDBACKS-----------------------------------------------------

WITH random_feedbacks AS (
    SELECT 
        p."product_id",
        c."customer_id",
        -- Generate random feedback messages
        CONCAT('I really like the ', p."product_name", ' I purchased.') AS "feedback",
        -- Generate random ratings between 1 and 5
        (RANDOM() * 5 + 1)::INTEGER AS "rating"
    FROM "Products" p, "Customers" c
)
INSERT INTO "Product_Feedbacks" ("feedback_id", "product_id", "customer_id", "feedback", "rating")
SELECT
    CONCAT(p."product_id", '-', c."customer_id") AS "feedback_id",
    p."product_id",
    c."customer_id",
    f."feedback",
    f."rating"
FROM random_feedbacks f
JOIN "Products" p ON f."product_id" = p."product_id"
JOIN "Customers" c ON f."customer_id" = c."customer_id";
