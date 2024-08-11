import { NextResponse } from 'next/server'; // Make sure to import NextResponse
import { startOfDay, endOfDay } from 'date-fns'; // Import date utilities
import { PrismaClient } from '@prisma/client';

function toObject(obj) {
  return JSON.parse(
    JSON.stringify(obj, (key, value) =>
      typeof value === "bigint" ? value.toString() : value
    )
  );
}


const prisma = new PrismaClient();
export async function GET(req) {
  try {
    // Get current date and time
    const now = new Date();
    
    // Define start and end of the day
    const startDate = startOfDay(now);
    const endDate = endOfDay(now);

    // Fetch transaction details for the current day
    const transaction = await prisma.Receipt_Detail.findMany({
      where: {
        receipt: {
          date_time: {
            gte: startDate,
            lte: endDate,
          },
        },
      },
      include: {
        receipt: {
          include: {
            payment: true,
          },
        },
        product: true,
      },
    });

    // Aggregate sales summary for the current day
    const salesSummary = await prisma.receipt.aggregate({
      where: {
        date_time: {
          gte: startDate,
          lte: endDate,
        },
      },
      _count: {
        id: true, // Count transactions
      },
      _sum: {
        total: true, // Sum of total sales
        diskon: true, // Sum of discounts
        pajak: true, // Sum of taxes
      },
    });

    // Calculate net sales
    const penjulanBersih = parseInt(salesSummary._sum.total || 0) - parseInt(salesSummary._sum.diskon || 0) - parseInt(salesSummary._sum.pajak || 0);
    const transactionData = toObject(transaction);
    const allSalesSummary = {
      ...salesSummary,
      penjulanBersih
    };

    console.log("this is data allSalesSumarry", allSalesSummary)
    // Format sales summary data
    const salesSummaryFormatted = [
      {
        title: "Transaksi",
        type: "quantity",
        desc: (allSalesSummary._count?.id != null ? allSalesSummary._count.id.toString() : "0"),
      },
      {
        title: "Keuntungan Dihasilkan",
        type: "price",
        desc: (allSalesSummary._count?.total != null ? allSalesSummary._count.total.toString() : "0"),
      },
      {
        title: "Penjualan bersih",
        type: "price",
        desc: allSalesSummary?.penjulanBersih.toString() ?? "0",
      }
    ];

    // Combine results
    const finalTransactionData = {
      transactionData,
      salesSummaryFormatted
    };

    // Return the data as JSON
    return NextResponse.json(finalTransactionData, { status: 200 });
  } catch (error) {
    console.error("Something went wrong", error);
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
  }
}
