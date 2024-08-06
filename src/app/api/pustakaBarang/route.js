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
export async function GET() {
  try {
    const barang = await prisma.OrderItem.findMany({
      include: {
        order: true,
        product: true,
      },
    });
    const pustakaBarang = toObject(barang)
    return NextResponse.json(pustakaBarang, { status: 200 });
  } catch (error) {
    console.error("Something went wrong", error);
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
  }
}
