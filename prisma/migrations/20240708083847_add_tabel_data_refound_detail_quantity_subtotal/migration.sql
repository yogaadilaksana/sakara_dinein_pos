/*
  Warnings:

  - Added the required column `quantity` to the `Refund_Detail` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subtotal` to the `Refund_Detail` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Refund_Detail` ADD COLUMN `quantity` BIGINT NOT NULL,
    ADD COLUMN `subtotal` DECIMAL(65, 30) NOT NULL;
