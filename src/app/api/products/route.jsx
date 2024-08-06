import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";


const prisma = new PrismaClient();

function toObject(obj) {
  return JSON.parse(JSON.stringify(obj, (key, value) =>
    typeof value === 'bigint'
      ? value.toString()
      : value
  ));
}

export const GET = async (req) => {
    const { searchParams } = new URL(req.url);
    const name = searchParams.get("name");

    console.log("ini adalah category:" +name);
  
    try {
      const products = await prisma.product.findMany({
        where: {
          ...(name ? { category_name: name } : {}),
        },
      });
      const product = toObject(products)
      return new NextResponse(JSON.stringify(product), { status: 200 });
    } catch (err) {
      console.log(err);
      return new NextResponse(
        JSON.stringify({ message: "Something went wrong!" }),
        { status: 500 }
      );
    }
  };