/*
  Warnings:

  - The primary key for the `payment` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `status` to the `Payment` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Receipt` DROP FOREIGN KEY `Receipt_payment_id_fkey`;

-- AlterTable
ALTER TABLE `Category` MODIFY `name` VARCHAR(255) NOT NULL;

-- AlterTable
ALTER TABLE `extras` MODIFY `name` VARCHAR(255) NOT NULL;

-- AlterTable
ALTER TABLE `Payment` DROP PRIMARY KEY,
    ADD COLUMN `status` ENUM('PENDING_PAYMENT', 'PAID', 'CANCELED') NOT NULL,
    MODIFY `id` VARCHAR(110) NOT NULL,
    MODIFY `snap_token` VARCHAR(255) NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `Product` MODIFY `name` VARCHAR(255) NOT NULL,
    MODIFY `description` TEXT NOT NULL;

-- AlterTable
ALTER TABLE `Receipt` MODIFY `payment_id` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `User` MODIFY `name` VARCHAR(255) NOT NULL;

-- AddForeignKey
ALTER TABLE `Receipt` ADD CONSTRAINT `Receipt_payment_id_fkey` FOREIGN KEY (`payment_id`) REFERENCES `Payment`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
