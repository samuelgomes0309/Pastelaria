/*
  Warnings:

  - You are about to drop the column `optional_id` on the `items_optionals` table. All the data in the column will be lost.
  - Added the required column `product_optional_id` to the `items_optionals` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "items_optionals" DROP CONSTRAINT "items_optionals_optional_id_fkey";

-- AlterTable
ALTER TABLE "items_optionals" DROP COLUMN "optional_id",
ADD COLUMN     "product_optional_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "items_optionals" ADD CONSTRAINT "items_optionals_product_optional_id_fkey" FOREIGN KEY ("product_optional_id") REFERENCES "products_optionals"("id") ON DELETE CASCADE ON UPDATE CASCADE;
