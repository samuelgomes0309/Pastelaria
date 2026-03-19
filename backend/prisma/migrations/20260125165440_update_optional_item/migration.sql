-- CreateTable
CREATE TABLE "items_optionals" (
    "id" TEXT NOT NULL,
    "itemOrder_id" TEXT NOT NULL,
    "optional_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "items_optionals_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "items_optionals" ADD CONSTRAINT "items_optionals_itemOrder_id_fkey" FOREIGN KEY ("itemOrder_id") REFERENCES "items_orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "items_optionals" ADD CONSTRAINT "items_optionals_optional_id_fkey" FOREIGN KEY ("optional_id") REFERENCES "optionals"("id") ON DELETE CASCADE ON UPDATE CASCADE;
