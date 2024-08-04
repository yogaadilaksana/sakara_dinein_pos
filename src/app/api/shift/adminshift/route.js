// app/api/shifts/route.js
import { PrismaClient } from '@prisma/client';
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
    // Fetch all shifts
    const shifts = await prisma.shift.findMany();
    
    // Fetch all users
    const users = await prisma.user.findMany();

    // Convert data to plain objects to handle BigInt fields
    const shiftData = toObject(shifts);
    const userData = toObject(users);

    // Combine data based on user_id
    const combinedData = shiftData.map(shift => {
      const user = userData.find(user => user.id === shift.user_id);
      return {
        ...shift,
        users: user ? { id: user.id, name: user.name, email: user.email, role: user.role } : null,
      };
    });

    console.log("Combined data:", combinedData);

    return new Response(JSON.stringify(toObject(combinedData)), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error("Error fetching data:", error);
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
    const { userId } = req.body;
    const existingShift = await prisma.shift.findFirst({
      where: { userId, endedAt: null }
    });

    if (existingShift) {
      return new Response(JSON.stringify({error: "Shift Exist"}), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } else {
      const shift = await prisma.shift.create({
        data: { userId }
      });
      // res.json(shift);
      return new Response(JSON.stringify(shift), {
        status: 201,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

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

