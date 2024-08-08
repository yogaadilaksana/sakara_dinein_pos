import { PrismaClient } from "@prisma/client";
import { parseISO } from 'date-fns';

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
    // Parse URL search params
    const url = new URL(req.url);
    const startTime = url.searchParams.get('startTime');
    const endTime = url.searchParams.get('endTime');

    // Check if startTime and endTime are provided and valid dates
    if (!startTime || !endTime || isNaN(Date.parse(startTime)) || isNaN(Date.parse(endTime))) {
      return new Response(JSON.stringify({ error: "Invalid or missing date parameters" }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    // Convert string dates to Date objects
    const startDate = parseISO(startTime);
    const endDate = parseISO(endTime);

    // Fetch data from database
    const data = await prisma.Income_Expanses.findMany({
      where: {
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    // Calculate total income and total expense
    const totalIncome = data
      .filter(item => item.type === 'INCOME')
      .reduce((acc, curr) => acc + curr.amount, 0);

    const totalExpense = data
      .filter(item => item.type === 'EXPENSE')
      .reduce((acc, curr) => acc + curr.amount, 0);

    // Calculate net amount
    const netAmount = totalIncome - totalExpense;

    // Prepare result
    const result = {
      data: data,
      netAmount: netAmount.toFixed(2), // Formatting to 2 decimal places
    };

    // Return data in JSON format
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error("Error fetching income and expenses:", error);
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
