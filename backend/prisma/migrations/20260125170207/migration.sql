/*
  Warnings:

  - You are about to drop the column `itemOrder_id` on the `items_optionals` table. All the data in the column will be lost.
  - Added the required column `items_order_id` to the `items_optionals` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "items_optionals" DROP CONSTRAINT "items_optionals_itemOrder_id_fkey";

-- AlterTable
ALTER TABLE "items_optionals" DROP COLUMN "itemOrder_id",
ADD COLUMN     "items_order_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "items_optionals" ADD CONSTRAINT "items_optionals_items_order_id_fkey" FOREIGN KEY ("items_order_id") REFERENCES "items_orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;
