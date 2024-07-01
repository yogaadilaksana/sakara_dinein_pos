import { PrismaClient } from "@prisma/client"
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export const GET = async () => {
    try{
        const users = await prisma.user.findMany();
        return new NextResponse(JSON.stringify(users), {status: 200})
    }catch(err) {
        console.log(err)
        return new NextResponse(JSON.stringify({message: "ada yang error nihh"}), {status: 500})
    }
}