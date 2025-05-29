import prismaClient from "./prisma";
import { Decimal } from '@prisma/client/runtime/library';

async function main() {
    await prismaClient.plano.createMany({
        data: [
            {
                nome: 'Essencial',
                valor: new Decimal('19.90'),
                limiteEmpresas: 1,
            },
            {
                nome: 'Pro',
                valor: new Decimal('95.90'),
                limiteEmpresas: 5,
            },
            {
                nome: 'Premium',
                valor: new Decimal('184.90'),
                limiteEmpresas: 10,
            },
        ],
    })

    console.log('Planos criados com sucesso!');
}

main()
    .catch((error) => {
        console.error('Erro ao criar planos:', error);
    })
    .then(async () => {
        await prismaClient.$disconnect();
    });