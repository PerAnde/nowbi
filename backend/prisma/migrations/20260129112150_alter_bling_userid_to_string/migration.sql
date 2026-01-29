/*
  Warnings:

  - You are about to drop the `blingintegration` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `blingUserId` on table `integracao_bling` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `blingintegration` DROP FOREIGN KEY `BlingIntegration_empresaId_fkey`;

-- AlterTable
ALTER TABLE `integracao_bling` MODIFY `blingUserId` VARCHAR(191) NOT NULL;

-- DropTable
DROP TABLE `blingintegration`;
