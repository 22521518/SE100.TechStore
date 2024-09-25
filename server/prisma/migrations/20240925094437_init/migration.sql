-- DropForeignKey
ALTER TABLE `shipping_address` DROP FOREIGN KEY `Shipping_Address_order_id_fkey`;

-- AlterTable
ALTER TABLE `shipping_address` MODIFY `order_id` VARCHAR(25) NOT NULL;

-- AddForeignKey
ALTER TABLE `Shipping_Address` ADD CONSTRAINT `Shipping_Address_order_id_fkey` FOREIGN KEY (`order_id`) REFERENCES `Orders`(`order_id`) ON DELETE CASCADE ON UPDATE CASCADE;
