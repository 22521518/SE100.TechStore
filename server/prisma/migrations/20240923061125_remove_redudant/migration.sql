/*
  Warnings:

  - You are about to drop the `product_category` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `role_permission` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `product_category` DROP FOREIGN KEY `Product_Category_category_id_fkey`;

-- DropForeignKey
ALTER TABLE `product_category` DROP FOREIGN KEY `Product_Category_product_id_fkey`;

-- DropForeignKey
ALTER TABLE `role_permission` DROP FOREIGN KEY `Role_Permission_permission_id_fkey`;

-- DropForeignKey
ALTER TABLE `role_permission` DROP FOREIGN KEY `Role_Permission_role_id_fkey`;

-- AlterTable
ALTER TABLE `categories` ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- DropTable
DROP TABLE `product_category`;

-- DropTable
DROP TABLE `role_permission`;

-- CreateTable
CREATE TABLE `_CategoriesToProducts` (
    `A` INTEGER NOT NULL,
    `B` VARCHAR(50) NOT NULL,

    UNIQUE INDEX `_CategoriesToProducts_AB_unique`(`A`, `B`),
    INDEX `_CategoriesToProducts_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_PermissionsToRoles` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_PermissionsToRoles_AB_unique`(`A`, `B`),
    INDEX `_PermissionsToRoles_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_CategoriesToProducts` ADD CONSTRAINT `_CategoriesToProducts_A_fkey` FOREIGN KEY (`A`) REFERENCES `Categories`(`category_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_CategoriesToProducts` ADD CONSTRAINT `_CategoriesToProducts_B_fkey` FOREIGN KEY (`B`) REFERENCES `Products`(`product_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_PermissionsToRoles` ADD CONSTRAINT `_PermissionsToRoles_A_fkey` FOREIGN KEY (`A`) REFERENCES `Permissions`(`permission_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_PermissionsToRoles` ADD CONSTRAINT `_PermissionsToRoles_B_fkey` FOREIGN KEY (`B`) REFERENCES `Roles`(`role_id`) ON DELETE CASCADE ON UPDATE CASCADE;
