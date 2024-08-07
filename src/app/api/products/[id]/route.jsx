import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";


const prisma = new PrismaClient();

export const GET = async (req, { params }) => {
    const { id } = params;

    try {
        const product = await prisma.product.findUnique({
            where: {
                id: Number(id),
            },
        });
        return new NextResponse(JSON.stringify(product), { status: 200 })
    }catch(err){
        return new NextResponse(JSON.stringify({message: "ada yang error"}), {status: 500})
    }
}