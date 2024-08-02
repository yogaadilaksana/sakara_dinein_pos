/*
  Warnings:

  - Added the required column `receipt_id` to the `Receipt_Detail` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Receipt_Detail` ADD COLUMN `receipt_id` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `Receipt_Detail` ADD CONSTRAINT `Receipt_Detail_receipt_id_fkey` FOREIGN KEY (`receipt_id`) REFERENCES `Receipt`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
