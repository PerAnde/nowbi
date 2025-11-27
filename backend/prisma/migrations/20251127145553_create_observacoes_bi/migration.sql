-- CreateTable
CREATE TABLE `observacoes_bi` (
    `id` VARCHAR(191) NOT NULL,
    `conteudo` VARCHAR(191) NOT NULL,
    `businessIntelligence_id` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `observacoes_bi` ADD CONSTRAINT `observacoes_bi_businessIntelligence_id_fkey` FOREIGN KEY (`businessIntelligence_id`) REFERENCES `business_intelligence`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
