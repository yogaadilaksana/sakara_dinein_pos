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
    const products = await prisma.product.findMany({
      include: {
        category: true, // Include category if needed
      },
    });

    const productsObj = toObject(products);

    return new Response(JSON.stringify(productsObj), {
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
    const { name, stock, price, categoryId } = await req.json();

    const newProduct = await prisma.product.create({
      data: {
        name,
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
