-- CreateTable
CREATE TABLE `usuarios` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `cpf_cnpj` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `bairro` VARCHAR(100) NULL,
    `cep` VARCHAR(10) NULL,
    `cidade` VARCHAR(100) NULL,
    `endereco` VARCHAR(255) NULL,
    `estado` VARCHAR(2) NULL,
    `ibge` VARCHAR(10) NULL,
    `img_usuario` VARCHAR(255) NULL,
    `numero` VARCHAR(10) NULL,
    `telefone` VARCHAR(13) NULL,

    UNIQUE INDEX `usuarios_email_key`(`email`),
    UNIQUE INDEX `usuarios_cpf_cnpj_key`(`cpf_cnpj`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `grupo_empresas` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `email_grupo` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `usuario_id` VARCHAR(191) NULL,

    INDEX `grupo_empresas_usuario_id_fkey`(`usuario_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `empresas` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `cnpj_empresa` VARCHAR(191) NULL,
    `logo_empresa` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `usuario_id` VARCHAR(191) NOT NULL,
    `grupo_empresa_id` VARCHAR(191) NULL,
    `email_empresa` VARCHAR(191) NOT NULL,
    `link_bi` VARCHAR(20) NOT NULL,

    UNIQUE INDEX `empresas_link_bi_key`(`link_bi`),
    INDEX `empresas_usuario_id_fkey`(`usuario_id`),
    INDEX `empresas_grupo_empresa_id_fkey`(`grupo_empresa_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `categorias` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `tipo` ENUM('RECEITA', 'DESPESA') NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `usuario_id` VARCHAR(191) NOT NULL,

    INDEX `categorias_usuario_id_fkey`(`usuario_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sub_categorias` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `categoria_id` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `sub_categorias_categoria_id_fkey`(`categoria_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `business_intelligence` (
    `id` VARCHAR(191) NOT NULL,
    `mes` VARCHAR(191) NOT NULL,
    `ano` INTEGER NOT NULL,
    `status` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `empresa_id` VARCHAR(191) NOT NULL,

    INDEX `business_intelligence_empresa_id_fkey`(`empresa_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `lancamentos_bi` (
    `id` VARCHAR(191) NOT NULL,
    `valor` DECIMAL(65, 30) NOT NULL,
    `tipo` ENUM('RECEITA', 'DESPESA') NOT NULL,
    `categoria_id` VARCHAR(191) NOT NULL,
    `subcategoria_id` VARCHAR(191) NULL,
    `businessIntelligence_id` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `lancamento_bi_categoria_id_fkey`(`categoria_id`),
    INDEX `lancamento_bi_subcategoria_id_fkey`(`subcategoria_id`),
    INDEX `lancamentos_bi_businessIntelligence_id_fkey`(`businessIntelligence_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `grupo_empresas` ADD CONSTRAINT `grupo_empresas_usuario_id_fkey` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `empresas` ADD CONSTRAINT `empresas_grupo_empresa_id_fkey` FOREIGN KEY (`grupo_empresa_id`) REFERENCES `grupo_empresas`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `empresas` ADD CONSTRAINT `empresas_usuario_id_fkey` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `categorias` ADD CONSTRAINT `categorias_usuario_id_fkey` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `sub_categorias` ADD CONSTRAINT `sub_categorias_categoria_id_fkey` FOREIGN KEY (`categoria_id`) REFERENCES `categorias`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `business_intelligence` ADD CONSTRAINT `business_intelligence_empresa_id_fkey` FOREIGN KEY (`empresa_id`) REFERENCES `empresas`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `lancamentos_bi` ADD CONSTRAINT `lancamentos_bi_businessIntelligence_id_fkey` FOREIGN KEY (`businessIntelligence_id`) REFERENCES `business_intelligence`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `lancamentos_bi` ADD CONSTRAINT `lancamentos_bi_categoria_id_fkey` FOREIGN KEY (`categoria_id`) REFERENCES `categorias`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `lancamentos_bi` ADD CONSTRAINT `lancamentos_bi_subcategoria_id_fkey` FOREIGN KEY (`subcategoria_id`) REFERENCES `sub_categorias`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
