/*
  Warnings:

  - A unique constraint covering the columns `[businessIntelligence_id]` on the table `observacoes_bi` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `observacoes_bi_businessIntelligence_id_key` ON `observacoes_bi`(`businessIntelligence_id`);
