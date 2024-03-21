/*
  Warnings:

  - A unique constraint covering the columns `[service_code]` on the table `Services` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Services_service_code_key` ON `Services`(`service_code`);

-- AddForeignKey
ALTER TABLE `Transactions` ADD CONSTRAINT `Transactions_service_code_fkey` FOREIGN KEY (`service_code`) REFERENCES `Services`(`service_code`) ON DELETE RESTRICT ON UPDATE CASCADE;
