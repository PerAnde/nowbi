import prismaClient from "../../prisma";

interface ClientRequest {
    name: string;
    logo_client?: string;
    user_id: string;
}

class CreateClientService {
    async execute({ name, logo_client, user_id }: ClientRequest) {

        if (name === "") {
            throw new Error("Nome inválido!")
        }

        const client = await prismaClient.client.create({
            data: {
                name: name,
                logo_client: logo_client,
                user_id: user_id
            },
            select: {
                id: true,
                name: true,
                logo_client: true,
                user_id: true,
            }
        })

        return client

    }
}

export { CreateClientService }