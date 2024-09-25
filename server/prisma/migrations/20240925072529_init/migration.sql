/*
  Warnings:

  - You are about to drop the column `address` on the `shipping_address` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `shipping_address` DROP FOREIGN KEY `Shipping_Address_customer_id_fkey`;

-- AlterTable
ALTER TABLE `shipping_address` DROP COLUMN `address`,
    ADD COLUMN `address_id` INTEGER NULL,
    MODIFY `customer_id` VARCHAR(50) NULL;

-- AddForeignKey
ALTER TABLE `Shipping_Address` ADD CONSTRAINT `Shipping_Address_customer_id_fkey` FOREIGN KEY (`customer_id`) REFERENCES `Customers`(`customer_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Shipping_Address` ADD CONSTRAINT `Shipping_Address_address_id_fkey` FOREIGN KEY (`address_id`) REFERENCES `Customer_Address`(`address_id`) ON DELETE SET NULL ON UPDATE CASCADE;
