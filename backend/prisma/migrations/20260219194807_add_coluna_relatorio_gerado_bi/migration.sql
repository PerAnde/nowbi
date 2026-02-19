-- AlterTable
ALTER TABLE `business_intelligence` ADD COLUMN `relatorio_ia_gerado` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `observacoes_bi` MODIFY `conteudo` LONGTEXT NULL;
