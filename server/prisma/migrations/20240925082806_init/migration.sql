/*
  Warnings:

  - You are about to drop the column `city` on the `shipping_address` table. All the data in the column will be lost.
  - You are about to drop the column `state` on the `shipping_address` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `orders` MODIFY `order_status` ENUM('PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED') NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE `shipping_address` DROP COLUMN `city`,
    DROP COLUMN `state`,
    ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `delivery_date` DATETIME(3) NULL,
    ADD COLUMN `shipping_status` ENUM('PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED') NOT NULL DEFAULT 'PENDING';
