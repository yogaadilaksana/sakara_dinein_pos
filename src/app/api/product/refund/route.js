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
    const url = new URL(req.url);
    // const startTime = url.searchParams.get('start');
    // const endTime = url.searchParams.get('end');

    const startTime = '2024-07-31 23:17:09.339'
    const endTime = '2024-07-31 23:17:09.439'
    const newStartDate = new Date(startTime.replace(' ', 'T') + 'Z');;
    const newEndDate = new Date(endTime.replace(' ', 'T') + 'Z');
    const orderItems = await prisma.refund_Detail.findMany({
        where: {
          refund_date: {
            gte: newStartDate, // Mulai waktu
            lte: newEndDate,   // Akhir waktu
          },
        },
      });
      const productsObj = toObject(orderItems);

      console.log("this is item refund", orderItems, startTime, newStartDate);
      // Mengelompokkan data berdasarkan orderId dan menghitung total kuantitas untuk setiap produk
      const orderQuantities = productsObj.reduce((acc, item) => {
        const quantity = typeof item.quantity === 'number' ? item.quantity : parseFloat(item.quantity);
        return acc + quantity;
    }, 0);
      console.log("total angka yang refund", orderQuantities);

    return new Response(JSON.stringify(orderQuantities), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
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

// POST a new product
export async function POST(req) {
  try {
    const { name, stock, price, categoryId, description } = await req.json();

    const newProduct = await prisma.product.create({
      data: {
        name,
        description,
        stock,
        price,
        categoryId,
      },
    });

    return new Response(JSON.stringify(newProduct), {
      status: 201,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error("Error creating product:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}

// PUT to update a product
export async function PUT(req) {
  try {
    const { id, name, stock, price, categoryId } = await req.json();

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        name,
        stock,
        price,
        categoryId,
      },
    });

    return new Response(JSON.stringify(updatedProduct), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error("Error updating product:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}

// DELETE a product
export async function DELETE(req) {
  try {
    const { id } = await req.json();

    await prisma.product.delete({
      where: { id },
    });

    return new Response(null, { status: 204 });
  } catch (error) {
    console.error("Error deleting product:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
