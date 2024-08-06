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

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const startDateParam = searchParams.get('startDate');
  const endDateParam = searchParams.get('endDate');

  try {
    const whereClause = {};

    if (startDateParam && endDateParam) {
      const startDate = formatToStartOfDay(startDateParam);
      const endDate = formatToEndOfDay(endDateParam);

      whereClause.date_time = {
        gte: startDate,
        lte: endDate,
      };
    }

    // Fetch all relevant receipts first
    const receipts = await prisma.receipt.findMany({
      where: whereClause,
      include: {
        Receipt_Detail: {
          include: {
            product: true,
          },
        },
        payment: true,
      },
    });

    if (receipts.length === 0) {
      return NextResponse.json({ message: "No data found for the given date range." }, { status: 404 });
    }

    // Map receipts to get all related receipt details
    const transactionData = receipts.flatMap(receipt => 
      receipt.Receipt_Detail.map(detail => ({
        ...detail,
        receipt: {
          ...receipt,
          payment: receipt.payment,
        },
        product: detail.product,
      }))
    );

    const salesSummary = await prisma.receipt.aggregate({
      _count: {
        id: true, // Menghitung jumlah transaksi
      },
      _sum: {
        total: true, // Menghitung total penjualan
        diskon: true, // Menghitung total diskon
        pajak: true, // Menghitung total pajak
      },
      where: whereClause,
    });

    const penjulanBersih = parseInt(salesSummary._sum.total) - parseInt(salesSummary._sum.diskon) - parseInt(salesSummary._sum.pajak);

    const transactionDataFormatted = toObject(transactionData);
    const allSalesSummary = {
      ...salesSummary,
      penjulanBersih
    };

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
      transactionData: transactionDataFormatted,
      salesSummaryFormatted
    };

    return NextResponse.json(finalTransactionData, { status: 200 });
  } catch (error) {
    console.error("Something went wrong", error);
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
  }
}
