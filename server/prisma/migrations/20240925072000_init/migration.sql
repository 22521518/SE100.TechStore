/*
  Warnings:

  - You are about to drop the column `address` on the `suppliers` table. All the data in the column will be lost.
  - Added the required column `description` to the `Suppliers` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `suppliers` DROP COLUMN `address`,
    ADD COLUMN `description` TEXT NOT NULL;
