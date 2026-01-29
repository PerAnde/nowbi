/*
  Warnings:

  - You are about to drop the `blingintegration` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `blingintegration` DROP FOREIGN KEY `BlingIntegration_empresaId_fkey`;

-- AlterTable
ALTER TABLE `integracao_bling` MODIFY `blingUserId` VARCHAR(191) NULL;

-- DropTable
DROP TABLE `blingintegration`;
