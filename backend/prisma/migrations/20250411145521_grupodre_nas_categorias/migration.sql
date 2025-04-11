/*
  Warnings:

  - Added the required column `grupoDre` to the `categorias` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `categorias` ADD COLUMN `grupoDre` ENUM('NAO_EXIBIR_NO_DRE', 'RECEITA_OPERACIONAL_BRUTA', 'RECEITA_FINANCEIRA', 'OUTRAS_RECEITAS', 'DEDUCOES_DA_RECEITA_BRUTA', 'DESPESAS_OPERACIONAIS', 'DESPESAS_FINANCEIRAS', 'OUTRAS_DESPESAS', 'IR_CSLL') NOT NULL;
