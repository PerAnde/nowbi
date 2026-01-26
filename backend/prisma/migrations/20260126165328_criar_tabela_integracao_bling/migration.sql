-- CreateTable
CREATE TABLE `integracao_bling` (
    `id` VARCHAR(191) NOT NULL,
    `empresaId` VARCHAR(191) NOT NULL,
    `accessToken` TEXT NOT NULL,
    `refreshToken` TEXT NOT NULL,
    `scope` VARCHAR(191) NULL,
    `blingUserId` INTEGER NULL,
    `expiresAt` DATETIME(3) NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `integracao_bling_empresaId_key`(`empresaId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `integracao_bling` ADD CONSTRAINT `integracao_bling_empresaId_fkey` FOREIGN KEY (`empresaId`) REFERENCES `empresas`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
