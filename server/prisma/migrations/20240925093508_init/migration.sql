/*
  Warnings:

  - You are about to drop the column `customer_id` on the `shipping_address` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `shipping_address` DROP FOREIGN KEY `Shipping_Address_customer_id_fkey`;

-- AlterTable
ALTER TABLE `shipping_address` DROP COLUMN `customer_id`;
