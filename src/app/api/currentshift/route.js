import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function toObject(obj) {
  return JSON.parse(JSON.stringify(obj, (key, value) =>
    typeof value === 'bigint'
      ? value.toString()
      : value
  ));
}

// GET all products
export async function GET(req) {
  try {
    // const products = await prisma.product.findMany({
    //   include: {
    //     category: true, // Include category if needed
    //   },
    // });

    // const productsObj = toObject(products);

    // return new Response(JSON.stringify(productsObj), {
    //   status: 200,
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    // });
    let data = {
        name: 'Ari Pratama',
        outlet: 'Sakara Kopi Bali Antasura',
        startingShift: 'Friday, 3rd of September 2024 at 11.30',
        expenseIncome: '-Rp.11.000',
        itemsSold: 6,
        itemsReturned: 2,
        startingCash: 'Rp.300.000',
        cashSales: 'Rp.638.000'
    }
    return new Response(JSON.stringify(data),{
        status: 200,
        headers: {
            'Content-Type': 'appication/json'
        }
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}