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

// Helper function to aggregate items by name
function aggregateItems(items) {
  const aggregated = items.reduce((acc, item) => {
    const quantity = Number(item.quantity); // Convert to number
    const existingItem = acc.find((i) => i.name === item.product.name);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      acc.push({ name: item.product.name, quantity: quantity });
    }
    return acc;
  }, []);

  return aggregated;
}

// GET all products
export async function GET(req) {
  try {
    // Fetch order items with associated products
    const orderItems = await prisma.orderItem.findMany({
      include: {
        product: true, // Include related product data
      },
    });

    // Convert order items data to a plain object
    const orderItemsObj = toObject(orderItems);

    // Transform order items into a list of items with quantities aggregated
    const itemsSold = aggregateItems(orderItemsObj);

    // Prepare response data
    const result = {
      itemsSold,
    };

    const item = toObject(result)
    console.log("this is item sold", itemsSold)
    // Send the data as JSON
    return new Response(JSON.stringify(item), {
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
