-- CreateEnum
CREATE TYPE "ItemStatus" AS ENUM ('in_stock', 'sold', 'removed');

-- CreateTable
CREATE TABLE "items" (
    "id" SERIAL NOT NULL,
    "item_code" VARCHAR(50) NOT NULL,
    "name" VARCHAR(150),
    "serial_number" VARCHAR(100),
    "product_id" INTEGER NOT NULL,
    "warehouse_id" INTEGER NOT NULL,
    "status" "ItemStatus" NOT NULL DEFAULT 'in_stock',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "items_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "items_item_code_key" ON "items"("item_code");

-- CreateIndex
CREATE UNIQUE INDEX "items_serial_number_key" ON "items"("serial_number");

-- CreateIndex
CREATE INDEX "items_product_id_idx" ON "items"("product_id");

-- CreateIndex
CREATE INDEX "items_warehouse_id_idx" ON "items"("warehouse_id");

-- CreateIndex
CREATE INDEX "items_status_idx" ON "items"("status");

-- CreateIndex
CREATE INDEX "items_serial_number_idx" ON "items"("serial_number");

-- AddForeignKey
ALTER TABLE "items" ADD CONSTRAINT "items_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "items" ADD CONSTRAINT "items_warehouse_id_fkey" FOREIGN KEY ("warehouse_id") REFERENCES "warehouses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
