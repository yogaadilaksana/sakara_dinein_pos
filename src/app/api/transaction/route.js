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
    const transaction = await prisma.Receipt_Detail.findMany({
    include: {
        receipt: {
          include: {
            payment: true,
          },
        },
        product: true,
      },
    });
    const salesSummary = await prisma.receipt.aggregate({
        _count: {
          id: true, // Menghitung jumlah transaksi
        },
        _sum: {
          total: true, // Menghitung total penjualan
          diskon: true, // Menghitung total diskon
          pajak: true, // Menghitung total pajak
        },
      });
    const penjulanBersih = parseInt(salesSummary._sum.total) - parseInt(salesSummary._sum.diskon) - parseInt(salesSummary._sum.pajak);
    console.log("this is data transactional", penjulanBersih);
    const transactionData = toObject(transaction);
    const allSalesSummary = {
        ...salesSummary,
        penjulanBersih
    }
    const salesSummaryFormatted = [
        {
          title: "Transaksi",
          type: "quantity",
          desc: allSalesSummary._count.id.toString(),
        },
        {
          title: "Keuntungan Dihasilkan",
          type: "price",
          desc: allSalesSummary._sum.total.toString(),
        },
        {
          title: "Penjualan bersih",
          type: "price",
          desc: allSalesSummary.penjulanBersih.toString(),
        }
      ];
    const finalTransactionData = {
        transactionData,
        salesSummaryFormatted
    }
    console.log("this is data manipulation", finalTransactionData);
    return NextResponse.json(finalTransactionData, { status: 200 });
  } catch (error) {
    console.error("Something went wrong", error);
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
  }
}