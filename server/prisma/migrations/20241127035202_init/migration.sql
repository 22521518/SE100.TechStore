-- CreateEnum
CREATE TYPE "ORDER_STATUS" AS ENUM ('PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "PAYMENT_METHOD" AS ENUM ('COD', 'CREDIT_CARD', 'ELECTRO_WALLET', 'MOMO');

-- CreateEnum
CREATE TYPE "EMPLOY_STATUS" AS ENUM ('ACTIVE', 'INACTIVE', 'SUSPENDED', 'RESIGNED');

-- CreateTable
CREATE TABLE "Accounts" (
    "account_id" VARCHAR(50) NOT NULL,
    "email" VARCHAR(50) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Accounts_pkey" PRIMARY KEY ("account_id")
);

-- CreateTable
CREATE TABLE "Customers" (
    "customer_id" VARCHAR(50) NOT NULL,
    "account_id" VARCHAR(50) NOT NULL,
    "username" VARCHAR(50) NOT NULL,
    "full_name" VARCHAR(100) NOT NULL,
    "phone_number" VARCHAR(10) NOT NULL,
    "date_joined" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "image" TEXT,
    "male" BOOLEAN DEFAULT true,
    "birth_date" TIMESTAMP(3),

    CONSTRAINT "Customers_pkey" PRIMARY KEY ("customer_id")
);

-- CreateTable
CREATE TABLE "Customer_Address" (
    "address_id" SERIAL NOT NULL,
    "customer_id" VARCHAR(50) NOT NULL,
    "city" VARCHAR(50) NOT NULL,
    "district" VARCHAR(50),
    "ward" VARCHAR(50),
    "address" TEXT NOT NULL,
    "is_primary" BOOLEAN NOT NULL DEFAULT true,
    "full_name" VARCHAR(100),
    "phone_number" CHAR(10),

    CONSTRAINT "Customer_Address_pkey" PRIMARY KEY ("address_id")
);

-- CreateTable
CREATE TABLE "Cart_Item" (
    "customer_id" VARCHAR(50) NOT NULL,
    "product_id" VARCHAR(50) NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "Cart_Item_pkey" PRIMARY KEY ("customer_id","product_id")
);

-- CreateTable
CREATE TABLE "Suppliers" (
    "supplier_id" SERIAL NOT NULL,
    "supplier_name" VARCHAR(100) NOT NULL,
    "contact_number" VARCHAR(10) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "description" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Suppliers_pkey" PRIMARY KEY ("supplier_id")
);

-- CreateTable
CREATE TABLE "Importations" (
    "importation_id" SERIAL NOT NULL,
    "supplier_id" INTEGER,
    "import_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "total_price" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "remarks" TEXT,

    CONSTRAINT "Importations_pkey" PRIMARY KEY ("importation_id")
);

-- CreateTable
CREATE TABLE "Import_Items" (
    "import_item_id" SERIAL NOT NULL,
    "import_id" INTEGER NOT NULL,
    "product_id" TEXT,
    "quantity" INTEGER NOT NULL,
    "unit_price" DOUBLE PRECISION NOT NULL,
    "total_price" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Import_Items_pkey" PRIMARY KEY ("import_item_id")
);

-- CreateTable
CREATE TABLE "Orders" (
    "order_id" VARCHAR(25) NOT NULL,
    "customer_id" TEXT,
    "order_status" "ORDER_STATUS" NOT NULL DEFAULT 'PENDING',
    "total_price" DOUBLE PRECISION NOT NULL,
    "voucher_code" TEXT,
    "paid" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "payment_method" "PAYMENT_METHOD",

    CONSTRAINT "Orders_pkey" PRIMARY KEY ("order_id")
);

-- CreateTable
CREATE TABLE "Order_Items" (
    "order_id" VARCHAR(25) NOT NULL,
    "product_id" VARCHAR(50) NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unit_price" DOUBLE PRECISION NOT NULL,
    "total_price" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Order_Items_pkey" PRIMARY KEY ("order_id","product_id")
);

-- CreateTable
CREATE TABLE "Invoices" (
    "invoice_id" VARCHAR(50) NOT NULL,
    "order_id" VARCHAR(10),
    "total_price" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Invoices_pkey" PRIMARY KEY ("invoice_id")
);

-- CreateTable
CREATE TABLE "Shipping_Address" (
    "shipping_id" VARCHAR(50) NOT NULL,
    "order_id" VARCHAR(25) NOT NULL,
    "shipping_status" "ORDER_STATUS" NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "delivery_date" TIMESTAMP(3),
    "city" VARCHAR(50) NOT NULL,
    "district" VARCHAR(50),
    "ward" VARCHAR(50),
    "address" TEXT NOT NULL,
    "full_name" VARCHAR(100),
    "phone_number" CHAR(10),

    CONSTRAINT "Shipping_Address_pkey" PRIMARY KEY ("shipping_id")
);

-- CreateTable
CREATE TABLE "Products" (
    "product_id" VARCHAR(50) NOT NULL,
    "product_name" VARCHAR(100) NOT NULL,
    "images" VARCHAR(255)[],
    "description" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "discount" INTEGER DEFAULT 0,
    "stock_quantity" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Products_pkey" PRIMARY KEY ("product_id")
);

-- CreateTable
CREATE TABLE "Categories" (
    "category_id" SERIAL NOT NULL,
    "category_name" VARCHAR(50) NOT NULL,
    "description" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Categories_pkey" PRIMARY KEY ("category_id")
);

-- CreateTable
CREATE TABLE "Product_Feedbacks" (
    "feedback_id" VARCHAR(50) NOT NULL,
    "product_id" VARCHAR(50) NOT NULL,
    "customer_id" VARCHAR(50) NOT NULL,
    "feedback" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Product_Feedbacks_pkey" PRIMARY KEY ("product_id","customer_id")
);

-- CreateTable
CREATE TABLE "Staff" (
    "staff_id" VARCHAR(50) NOT NULL,
    "account_id" VARCHAR(50) NOT NULL,
    "role_id" INTEGER,
    "full_name" VARCHAR(100) NOT NULL,
    "phone_number" VARCHAR(10) NOT NULL,
    "male" BOOLEAN DEFAULT true,
    "birth_date" TIMESTAMP(3),
    "image" VARCHAR(255),
    "employee_status" "EMPLOY_STATUS" NOT NULL DEFAULT 'INACTIVE',
    "hire_date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Staff_pkey" PRIMARY KEY ("staff_id")
);

-- CreateTable
CREATE TABLE "Roles" (
    "role_id" SERIAL NOT NULL,
    "role_name" VARCHAR(50) NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "Roles_pkey" PRIMARY KEY ("role_id")
);

-- CreateTable
CREATE TABLE "Permissions" (
    "permission_id" VARCHAR(50) NOT NULL,
    "permission_name" VARCHAR(50) NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "Permissions_pkey" PRIMARY KEY ("permission_id")
);

-- CreateTable
CREATE TABLE "Vouchers" (
    "voucher_code" VARCHAR(50) NOT NULL,
    "voucher_name" VARCHAR(20) NOT NULL,
    "description" TEXT NOT NULL,
    "discount_amount" DOUBLE PRECISION NOT NULL,
    "valid_from" TIMESTAMP(3) NOT NULL,
    "valid_to" TIMESTAMP(3) NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Vouchers_pkey" PRIMARY KEY ("voucher_code")
);

-- CreateTable
CREATE TABLE "_CategoriesToProducts" (
    "A" INTEGER NOT NULL,
    "B" VARCHAR(50) NOT NULL
);

-- CreateTable
CREATE TABLE "_PermissionsToRoles" (
    "A" VARCHAR(50) NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Accounts_email_key" ON "Accounts"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Customers_account_id_key" ON "Customers"("account_id");

-- CreateIndex
CREATE UNIQUE INDEX "Customers_username_key" ON "Customers"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Suppliers_supplier_name_key" ON "Suppliers"("supplier_name");

-- CreateIndex
CREATE UNIQUE INDEX "Suppliers_email_key" ON "Suppliers"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Shipping_Address_order_id_key" ON "Shipping_Address"("order_id");

-- CreateIndex
CREATE UNIQUE INDEX "Categories_category_name_key" ON "Categories"("category_name");

-- CreateIndex
CREATE UNIQUE INDEX "Staff_account_id_key" ON "Staff"("account_id");

-- CreateIndex
CREATE UNIQUE INDEX "Roles_role_name_key" ON "Roles"("role_name");

-- CreateIndex
CREATE UNIQUE INDEX "Permissions_permission_name_key" ON "Permissions"("permission_name");

-- CreateIndex
CREATE UNIQUE INDEX "Vouchers_voucher_name_key" ON "Vouchers"("voucher_name");

-- CreateIndex
CREATE UNIQUE INDEX "_CategoriesToProducts_AB_unique" ON "_CategoriesToProducts"("A", "B");

-- CreateIndex
CREATE INDEX "_CategoriesToProducts_B_index" ON "_CategoriesToProducts"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_PermissionsToRoles_AB_unique" ON "_PermissionsToRoles"("A", "B");

-- CreateIndex
CREATE INDEX "_PermissionsToRoles_B_index" ON "_PermissionsToRoles"("B");

-- AddForeignKey
ALTER TABLE "Customers" ADD CONSTRAINT "Customers_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "Accounts"("account_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Customer_Address" ADD CONSTRAINT "Customer_Address_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "Customers"("customer_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cart_Item" ADD CONSTRAINT "Cart_Item_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "Customers"("customer_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cart_Item" ADD CONSTRAINT "Cart_Item_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Products"("product_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Importations" ADD CONSTRAINT "Importations_supplier_id_fkey" FOREIGN KEY ("supplier_id") REFERENCES "Suppliers"("supplier_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Import_Items" ADD CONSTRAINT "Import_Items_import_id_fkey" FOREIGN KEY ("import_id") REFERENCES "Importations"("importation_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Import_Items" ADD CONSTRAINT "Import_Items_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Products"("product_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Orders" ADD CONSTRAINT "Orders_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "Customers"("customer_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Orders" ADD CONSTRAINT "Orders_voucher_code_fkey" FOREIGN KEY ("voucher_code") REFERENCES "Vouchers"("voucher_code") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order_Items" ADD CONSTRAINT "Order_Items_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "Orders"("order_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order_Items" ADD CONSTRAINT "Order_Items_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Products"("product_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoices" ADD CONSTRAINT "Invoices_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "Orders"("order_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Shipping_Address" ADD CONSTRAINT "Shipping_Address_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "Orders"("order_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product_Feedbacks" ADD CONSTRAINT "Product_Feedbacks_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "Customers"("customer_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product_Feedbacks" ADD CONSTRAINT "Product_Feedbacks_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Products"("product_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Staff" ADD CONSTRAINT "Staff_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "Accounts"("account_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Staff" ADD CONSTRAINT "Staff_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "Roles"("role_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CategoriesToProducts" ADD CONSTRAINT "_CategoriesToProducts_A_fkey" FOREIGN KEY ("A") REFERENCES "Categories"("category_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CategoriesToProducts" ADD CONSTRAINT "_CategoriesToProducts_B_fkey" FOREIGN KEY ("B") REFERENCES "Products"("product_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PermissionsToRoles" ADD CONSTRAINT "_PermissionsToRoles_A_fkey" FOREIGN KEY ("A") REFERENCES "Permissions"("permission_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PermissionsToRoles" ADD CONSTRAINT "_PermissionsToRoles_B_fkey" FOREIGN KEY ("B") REFERENCES "Roles"("role_id") ON DELETE CASCADE ON UPDATE CASCADE;
