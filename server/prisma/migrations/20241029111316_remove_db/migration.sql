/*
  Warnings:

  - The primary key for the `Permissions` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "_PermissionsToRoles" DROP CONSTRAINT "_PermissionsToRoles_A_fkey";

-- AlterTable
ALTER TABLE "Permissions" DROP CONSTRAINT "Permissions_pkey",
ALTER COLUMN "permission_id" DROP DEFAULT,
ALTER COLUMN "permission_id" SET DATA TYPE VARCHAR(50),
ADD CONSTRAINT "Permissions_pkey" PRIMARY KEY ("permission_id");
DROP SEQUENCE "Permissions_permission_id_seq";

-- AlterTable
ALTER TABLE "_PermissionsToRoles" ALTER COLUMN "A" SET DATA TYPE VARCHAR(50);

-- AddForeignKey
ALTER TABLE "_PermissionsToRoles" ADD CONSTRAINT "_PermissionsToRoles_A_fkey" FOREIGN KEY ("A") REFERENCES "Permissions"("permission_id") ON DELETE CASCADE ON UPDATE CASCADE;
