-- AlterTable
ALTER TABLE `sub_categorias` ADD COLUMN `empresa_id` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `sub_categorias` ADD CONSTRAINT `sub_categorias_empresa_id_fkey` FOREIGN KEY (`empresa_id`) REFERENCES `empresas`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
