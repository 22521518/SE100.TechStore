/*
  Warnings:

  - You are about to drop the column `paid` on the `Orders` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "PAYMENT_STATUS" AS ENUM ('PENDING', 'PAID', 'REFUNDED');

-- AlterTable
ALTER TABLE "Orders" DROP COLUMN "paid",
ADD COLUMN     "payment_status" "PAYMENT_STATUS" NOT NULL DEFAULT 'PENDING';
