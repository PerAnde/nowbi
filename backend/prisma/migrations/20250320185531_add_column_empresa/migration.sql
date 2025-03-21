/*
  Warnings:

  - Added the required column `email_empresa` to the `empresas` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `empresas` ADD COLUMN `email_empresa` VARCHAR(191) NOT NULL;
