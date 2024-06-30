import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient();

export const GET = async () => {
    try{
        const users = await prisma.user.findMany();
        return new Response(JSON.stringify(users), {status: 200})
    }catch(err) {
        console.log(err)
        return new Response(JSON.stringify({message: "ada yang error nihh"}), {status: 500})
    }
}