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

function formatToStartOfDay(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function formatToEndOfDay(date) {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
}

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const startDateParam = searchParams.get('startDate');
  const endDateParam = searchParams.get('endDate');

  try {
    const whereClause = {};

    if (startDateParam && endDateParam) {
      const startDate = formatToStartOfDay(startDateParam);
      const endDate = formatToEndOfDay(endDateParam);

      whereClause.start_time = {
        gte: startDate,
        lte: endDate,
      };
    }

    const shift = await prisma.shift.findMany({
      where: whereClause,
      include: {
        user: true,
      },
    });

    const shifts = toObject(shift);
    return new Response(JSON.stringify(shifts), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error("Error fetching shifts:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}

// POST a new shift
export async function POST(req) {
  try {
    const { userId } = await req.json();
    const existingShift = await prisma.shift.findFirst({
      where: { userId, endedAt: null }
    });

    if (existingShift) {
      return new Response(JSON.stringify({ error: "Shift exists" }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } else {
      const shift = await prisma.shift.create({
        data: { userId }
      });
      return new Response(JSON.stringify(shift), {
        status: 201,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

  } catch (error) {
    console.error("Error creating shift:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}

// PUT to update a shift
export async function PUT(req) {
  try {
    const { id, userId, startTime, endedAt } = await req.json();

    const updatedShift = await prisma.shift.update({
      where: { id },
      data: {
        userId,
        startTime,
        endedAt,
      },
    });

    return new Response(JSON.stringify(updatedShift), {
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

// DELETE a shift
export async function DELETE(req) {
  try {
    const { id } = await req.json();

    await prisma.shift.delete({
      where: { id },
    });

    return new Response(null, { status: 204 });
  } catch (error) {
    console.error("Error deleting shift:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
