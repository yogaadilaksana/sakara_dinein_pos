/*
  Warnings:

  - You are about to drop the `order` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `orderitem` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[name]` on the table `Category` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `category_name` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `orderitem` DROP FOREIGN KEY `OrderItem_order_id_fkey`;

-- DropForeignKey
ALTER TABLE `orderitem` DROP FOREIGN KEY `OrderItem_product_id_fkey`;

-- DropForeignKey
ALTER TABLE `product` DROP FOREIGN KEY `Product_category_id_fkey`;

-- AlterTable
ALTER TABLE `product` ADD COLUMN `category_name` VARCHAR(191) NOT NULL;

-- DropTable
DROP TABLE `order`;

-- DropTable
DROP TABLE `orderitem`;

-- DropTable
DROP TABLE `user`;

-- CreateIndex
CREATE UNIQUE INDEX `Category_name_key` ON `Category`(`name`);

-- AddForeignKey
ALTER TABLE `Product` ADD CONSTRAINT `Product_category_name_fkey` FOREIGN KEY (`category_name`) REFERENCES `Category`(`name`) ON DELETE RESTRICT ON UPDATE CASCADE;
