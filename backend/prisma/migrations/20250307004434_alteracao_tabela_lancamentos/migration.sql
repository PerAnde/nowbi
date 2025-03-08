-- DropForeignKey
ALTER TABLE `lancamentos_bi` DROP FOREIGN KEY `lancamentos_bi_subcategoria_id_fkey`;

-- AlterTable
ALTER TABLE `lancamentos_bi` MODIFY `subcategoria_id` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `lancamentos_bi` ADD CONSTRAINT `lancamentos_bi_subcategoria_id_fkey` FOREIGN KEY (`subcategoria_id`) REFERENCES `sub_categorias`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
