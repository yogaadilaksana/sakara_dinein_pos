import { PrismaClient } from "@prisma/client"
import { NextResponse } from "next/server"


const prisma = new PrismaClient

function toObject(obj) {
    return JSON.parse(JSON.stringify(obj, (key, value) =>
      typeof value === 'bigint'
        ? value.toString()
        : value
    ));
  }

export const GET = async () => {
    try {
        const categories = await prisma.category.findMany()
        const category = toObject(categories);
        return new NextResponse(JSON.stringify(category, {status: 200}))
    } catch (err) {
        console.log(err)
        return new NextResponse(JSON.stringify({message: "ada yang error"}), {status: 500})
    }
    
}