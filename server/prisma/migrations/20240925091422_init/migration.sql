/*
  Warnings:

  - The primary key for the `order_items` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `orders` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE `order_items` DROP FOREIGN KEY `Order_Items_order_id_fkey`;

-- AlterTable
ALTER TABLE `order_items` DROP PRIMARY KEY,
    MODIFY `order_id` VARCHAR(25) NOT NULL,
    ADD PRIMARY KEY (`order_id`, `product_id`);

-- AlterTable
ALTER TABLE `orders` DROP PRIMARY KEY,
    MODIFY `order_id` VARCHAR(25) NOT NULL,
    ADD PRIMARY KEY (`order_id`);

-- AddForeignKey
ALTER TABLE `Order_Items` ADD CONSTRAINT `Order_Items_order_id_fkey` FOREIGN KEY (`order_id`) REFERENCES `Orders`(`order_id`) ON DELETE CASCADE ON UPDATE CASCADE;
