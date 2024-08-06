/*
  Warnings:

  - Added the required column `table_number` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `total` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `order_id` to the `OrderItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `OrderItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `product_id` to the `OrderItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quantity` to the `OrderItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
<<<<<<< HEAD
ALTER TABLE `Order` ADD COLUMN `order_date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
=======
ALTER TABLE `order` ADD COLUMN `order_date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
>>>>>>> dine_in
    ADD COLUMN `table_number` BIGINT NOT NULL,
    ADD COLUMN `total` DECIMAL(65, 30) NOT NULL;

-- AlterTable
<<<<<<< HEAD
ALTER TABLE `OrderItem` ADD COLUMN `order_id` BIGINT NOT NULL,
=======
ALTER TABLE `orderitem` ADD COLUMN `order_id` BIGINT NOT NULL,
>>>>>>> dine_in
    ADD COLUMN `price` DECIMAL(65, 30) NOT NULL,
    ADD COLUMN `product_id` BIGINT NOT NULL,
    ADD COLUMN `quantity` BIGINT NOT NULL;

-- AddForeignKey
ALTER TABLE `OrderItem` ADD CONSTRAINT `OrderItem_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `Product`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OrderItem` ADD CONSTRAINT `OrderItem_order_id_fkey` FOREIGN KEY (`order_id`) REFERENCES `Order`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
