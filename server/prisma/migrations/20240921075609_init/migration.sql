/*
  Warnings:

  - The primary key for the `importations` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `import_id` on the `importations` table. All the data in the column will be lost.
  - Added the required column `importation_id` to the `Importations` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `import_items` DROP FOREIGN KEY `Import_Items_import_id_fkey`;

-- AlterTable
ALTER TABLE `importations` DROP PRIMARY KEY,
    DROP COLUMN `import_id`,
    ADD COLUMN `importation_id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`importation_id`);

-- AddForeignKey
ALTER TABLE `Import_Items` ADD CONSTRAINT `Import_Items_import_id_fkey` FOREIGN KEY (`import_id`) REFERENCES `Importations`(`importation_id`) ON DELETE CASCADE ON UPDATE CASCADE;
