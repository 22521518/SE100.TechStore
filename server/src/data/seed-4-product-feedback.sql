WITH random_feedbacks AS (
    -- Generate feedback for each product-customer combination
    SELECT 
        p."product_id",
        c."customer_id",
        -- Generate random feedback message
        CONCAT('I really like the ', p."product_name", ' I purchased.') AS "feedback",
        -- Generate random ratings between 1 and 5
        (RANDOM() * 5 + 1)::INTEGER AS "rating"
    FROM "Products" p
    CROSS JOIN "Customers" c
),
product_feedbacks AS (
    -- Ensure each product gets at least 3 feedbacks by assigning the row number for each product
    SELECT 
        f."product_id", 
        f."customer_id", 
        f."feedback", 
        f."rating", 
        ROW_NUMBER() OVER (PARTITION BY f."product_id" ORDER BY RANDOM()) AS rn
    FROM random_feedbacks f
)
-- Insert into Product_Feedbacks ensuring each product gets at least 3 feedbacks
INSERT INTO "Product_Feedbacks" ("feedback_id", "product_id", "customer_id", "feedback", "rating")
SELECT 
    -- Generate a unique feedback_id (if necessary, use a sequence for the feedback_id)
     LEFT(MD5(CONCAT(f."product_id", '-', f."customer_id", '-', f.rn)), 50) AS "feedback_id",
    f."product_id", 
    f."customer_id", 
    f."feedback", 
    f."rating"
FROM product_feedbacks f
WHERE f.rn <= 3;  -- Ensure only 3 feedbacks per product are inserted
