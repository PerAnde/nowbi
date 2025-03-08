-- AlterTable
ALTER TABLE `usuarios` ADD COLUMN `bairro` VARCHAR(100) NULL,
    ADD COLUMN `cep` VARCHAR(10) NULL,
    ADD COLUMN `cidade` VARCHAR(100) NULL,
    ADD COLUMN `endereco` VARCHAR(255) NULL,
    ADD COLUMN `estado` VARCHAR(2) NULL,
    ADD COLUMN `ibge` VARCHAR(10) NULL,
    ADD COLUMN `img_usuario` VARCHAR(255) NULL,
    ADD COLUMN `numero` VARCHAR(10) NULL,
    ADD COLUMN `telefone` VARCHAR(13) NULL;

-- CreateTable
CREATE TABLE `lancamentos_bi` (
    `id` VARCHAR(191) NOT NULL,
    `valor` DECIMAL(65, 30) NOT NULL,
    `tipo` ENUM('RECEITA', 'DESPESA') NOT NULL,
    `categoria_id` VARCHAR(191) NOT NULL,
    `subcategoria_id` VARCHAR(191) NOT NULL,
    `businessIntelligence_id` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `lancamento_bi_categoria_id_fkey`(`categoria_id`),
    INDEX `lancamento_bi_subcategoria_id_fkey`(`subcategoria_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `lancamentos_bi` ADD CONSTRAINT `lancamentos_bi_categoria_id_fkey` FOREIGN KEY (`categoria_id`) REFERENCES `categorias`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `lancamentos_bi` ADD CONSTRAINT `lancamentos_bi_subcategoria_id_fkey` FOREIGN KEY (`subcategoria_id`) REFERENCES `sub_categorias`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `lancamentos_bi` ADD CONSTRAINT `lancamentos_bi_businessIntelligence_id_fkey` FOREIGN KEY (`businessIntelligence_id`) REFERENCES `business_intelligence`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
