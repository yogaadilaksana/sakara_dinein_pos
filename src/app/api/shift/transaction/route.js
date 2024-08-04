// app/api/shifts/route.js
import { PrismaClient, TransactionType } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();
function toObject(obj) {
  return JSON.parse(JSON.stringify(obj, (key, value) =>
    typeof value === 'bigint'
      ? value.toString()
      : value
  ));
}

export async function GET(req) {
  try {
    // Ambil data dari database (misalnya dari tabel Income_Expanses atau tabel lain sesuai kebutuhan)
    const transactions = await prisma.income_Expanses.findMany();

    // Transformasi data
    // const formattedTransactions = transactions.map(transaction => ({
    //   description: transaction.description || 'No description', // Menyediakan default value jika description kosong
    //   amount: transaction.amount
    // }));
    const transaction = toObject(transactions);
    // Kirimkan data terformat sebagai respons
    return new Response(JSON.stringify(transaction), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error("Error fetching transactions:", error);
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
    const { type, amount, description, transactionDate } = await req.json();

    // Validate the input
    if (!type || !amount || !transactionDate) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    // Check if the transaction type is valid
    if (!Object.values(TransactionType).includes(type)) {
      return new Response(JSON.stringify({ error: "Invalid transaction type" }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    // Create a new Income_Expanses entry
    const incomeExpense = await prisma.income_Expanses.create({
      data: {
        type,
        amount: parseFloat(amount),
        description,
        transactionDate: new Date(transactionDate),
      },
    });

    return new Response(JSON.stringify(incomeExpense), {
      status: 201,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error("Error creating income/expense:", error);
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

