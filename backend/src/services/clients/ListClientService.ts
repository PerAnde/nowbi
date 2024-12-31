import prismaClient from "../../prisma";

class ListClientService {
    async execute(user_id: string) {

        const client = await prismaClient.client.findMany({
            where: {
                user_id: user_id,
            }
        })

        return client;

    }
}

export { ListClientService }