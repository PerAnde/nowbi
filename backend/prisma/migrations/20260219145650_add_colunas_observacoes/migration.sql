-- AlterTable
ALTER TABLE `observacoes_bi` ADD COLUMN `analise_despesa` LONGTEXT NULL,
    ADD COLUMN `analise_receita` LONGTEXT NULL,
    ADD COLUMN `conclusao` LONGTEXT NULL,
    ADD COLUMN `periodo_mes` VARCHAR(255) NULL,
    ADD COLUMN `pontos_atencao` LONGTEXT NULL,
    ADD COLUMN `recomendacoes` LONGTEXT NULL,
    ADD COLUMN `resumo_geral` LONGTEXT NULL;
