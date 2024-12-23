WITH updated_orders AS (
    UPDATE "Orders"
    SET "total_price" = subquery.total_price
    FROM (
        SELECT
            oi."order_id",
            SUM(oi."total_price") AS total_price
        FROM "Order_Items" oi
        GROUP BY oi."order_id"
    ) subquery
    WHERE "Orders"."order_id" = subquery."order_id"
    RETURNING "Orders"."order_id", "Orders"."total_price"
)
SELECT * FROM updated_orders;
