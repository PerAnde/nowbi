/*
  Warnings:

  - Added the required column `link_grupo` to the `grupo_empresas` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `grupo_empresas` ADD COLUMN `link_grupo` VARCHAR(191) NOT NULL;
