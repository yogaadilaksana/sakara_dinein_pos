import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";


const prisma = new PrismaClient();

export const GET = async (req) => {
    const { searchParams } = new URL(req.url);
    const cat = searchParams.get("cat");

    console.log("ini adalah category:" +cat);
  
    try {
      const products = await prisma.product.findMany({
        where: {
          ...(cat ? { catSlug: cat } : { isFeatured: true }),
        },
      });
      return new NextResponse(JSON.stringify(products), { status: 200 });
    } catch (err) {
      console.log(err);
      return new NextResponse(
        JSON.stringify({ message: "Something went wrong!" }),
        { status: 500 }
      );
    }
  };