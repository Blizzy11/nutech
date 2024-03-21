/*
  Warnings:

  - Added the required column `createdBy` to the `Transactions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `transactions` ADD COLUMN `createdBy` VARCHAR(191) NOT NULL;
