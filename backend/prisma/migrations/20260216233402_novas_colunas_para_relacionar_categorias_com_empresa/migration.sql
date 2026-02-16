/*
  Warnings:

  - A unique constraint covering the columns `[id_externo,origem,empresa_id]` on the table `categorias` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `sub_categorias` DROP FOREIGN KEY `sub_categorias_categoria_id_fkey`;

-- AlterTable
ALTER TABLE `categorias` ADD COLUMN `empresa_id` VARCHAR(191) NULL,
    ADD COLUMN `id_externo` VARCHAR(191) NULL,
    ADD COLUMN `origem` VARCHAR(191) NULL DEFAULT 'MANUAL';

-- CreateIndex
CREATE INDEX `categorias_empresa_id_idx` ON `categorias`(`empresa_id`);

-- CreateIndex
CREATE UNIQUE INDEX `categorias_id_externo_origem_empresa_id_key` ON `categorias`(`id_externo`, `origem`, `empresa_id`);

-- AddForeignKey
ALTER TABLE `categorias` ADD CONSTRAINT `categorias_empresa_id_fkey` FOREIGN KEY (`empresa_id`) REFERENCES `empresas`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `sub_categorias` ADD CONSTRAINT `sub_categorias_categoria_id_fkey` FOREIGN KEY (`categoria_id`) REFERENCES `categorias`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
