/*
  Warnings:

  - You are about to drop the column `category_id` on the `product` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `Product_category_id_fkey` ON `product`;

-- AlterTable
ALTER TABLE `product` DROP COLUMN `category_id`;
