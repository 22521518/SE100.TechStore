-- AlterTable
ALTER TABLE "Products" ADD COLUMN     "discount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "images" VARCHAR(255)[];
