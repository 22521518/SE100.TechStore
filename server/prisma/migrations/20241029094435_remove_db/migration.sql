-- AlterTable
ALTER TABLE "Staff" ADD COLUMN     "birth_date" TIMESTAMP(3),
ADD COLUMN     "image" VARCHAR(255),
ADD COLUMN     "male" BOOLEAN DEFAULT true;
