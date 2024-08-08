import { PrismaClient } from "@prisma/client";

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
    const url = new URL(req.url);
    const startTime = url.searchParams.get('start');
    const endTime = url.searchParams.get('end');

    if (!startTime || !endTime) {
      return new Response(JSON.stringify({ error: "start and end time are required" }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    const newStartDate = new Date(startTime.replace(' ', 'T'));
    const newEndDate = new Date(endTime.replace(' ', 'T'));

    if (isNaN(newStartDate.getTime()) || isNaN(newEndDate.getTime())) {
      return new Response(JSON.stringify({ error: "Invalid date format" }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    const orderItems = await prisma.orderItem.findMany({
      where: {
        order_date: {
          gte: newStartDate, // Start time
          lte: newEndDate,   // End time
        },
      },
    });

    const productsObj = toObject(orderItems);

    const orderQuantities = productsObj.reduce((acc, item) => {
      const quantity = typeof item.quantity === 'number' ? item.quantity : parseFloat(item.quantity);
      return acc + quantity;
    }, 0);


    return new Response(JSON.stringify(orderQuantities), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error("Error fetching order items:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
