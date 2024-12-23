/*
  Warnings:

  - You are about to alter the column `total_price` on the `Invoices` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(18,2)`.
  - You are about to alter the column `unit_price` on the `Order_Items` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(18,2)`.
  - You are about to alter the column `total_price` on the `Order_Items` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(18,2)`.
  - You are about to alter the column `total_price` on the `Orders` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(18,2)`.

*/
-- AlterTable
ALTER TABLE "Invoices" ALTER COLUMN "total_price" SET DATA TYPE DECIMAL(18,2);

-- AlterTable
ALTER TABLE "Order_Items" ALTER COLUMN "unit_price" SET DATA TYPE DECIMAL(18,2),
ALTER COLUMN "total_price" SET DATA TYPE DECIMAL(18,2);

-- AlterTable
ALTER TABLE "Orders" ALTER COLUMN "total_price" SET DATA TYPE DECIMAL(18,2);
