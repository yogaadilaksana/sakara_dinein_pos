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
    // const { userId } = req.query;
    // console.log("this is user_id", userId, req.url)
    const url = new URL(req.url);
    const userId = url.searchParams.get('userId');
    const shift = await prisma.shift.findFirst({
      where: { user_id: userId, end_time: null },
    });

    const members = await prisma.user.findFirst({
      where: {id: userId}
    })
    const member = toObject(members)
    const shifts = toObject(shift) 
    let data = {shifts, member}
    console.log("data jahanam", data);
    return new Response(JSON.stringify(data), {
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
    const { userId, startingCash, total_expected, total_actual } = await req.json();
    const existingShift = await prisma.shift.findFirst({
      where: { user_id: userId, end_time: null }
    });
    // const test = JSON.parse(req.body);
    const existShift = toObject(existingShift)
    console.log('apakah dia exist', userId, startingCash, existShift ? true : false);
    if (existingShift) {
      return new Response(JSON.stringify(existShift), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } else {
        console.log("user id ada?", startingCash);
        const shift = await prisma.shift.create({
          data: {
            user_id: userId,
            start_time: new Date(),
            end_time: null,
            total_expected: total_expected ? parseFloat(total_expected) : 0,
            total_actual: total_actual ? parseFloat(total_actual) : 0,
            start_cash: parseFloat(startingCash)
          },
        });
      const shifts = toObject(shift)
      return new Response(JSON.stringify(shifts), {
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
    // Parse the request body to get user_id and end_time
    const { user_id, end_time, endingCash } = await req.json();

    // Find the most recent active shift for the given user_id (where end_time is null)
    const activeShift = await prisma.shift.findFirst({
      where: {
        user_id: user_id,
        end_time: null,
      },
      orderBy: {
        start_time: 'desc', // Order by start_time in descending order to get the most recent shift
      },
    });

    // If no active shift found, return a 404 response
    if (!activeShift) {
      return new Response(JSON.stringify({ error: "No active shift found for the given user" }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    // Update the end_time of the found shift
    const updatedShift = await prisma.shift.update({
      where: {
        id: activeShift.id, // Use the ID of the active shift to update it
      },
      data: {
        total_actual: parseFloat(endingCash),
        end_time: new Date(end_time), // Ensure end_time is a Date object
      },
    });

    const dataShiftUpdate = toObject(updatedShift);
    // Return the updated shift data
    return new Response(JSON.stringify({data:"success"}), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error("Error updating shift:", error);
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

