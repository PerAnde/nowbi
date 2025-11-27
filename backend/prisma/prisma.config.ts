import { defineConfig } from 'prisma';

export default defineConfig({
    datasources: {
        db: {
            url: process.env.DATABASE_URL, // vem do .env
        },
    },
});