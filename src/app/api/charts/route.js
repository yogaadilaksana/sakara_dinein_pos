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
    const transactions = await prisma.Receipt_Detail.findMany({
      include: {
        receipt: {
          include: {
            payment: true,
          },
        },
        product: {
          include: {
            category: true,
          },
        },
      },
    });

    const data = toObject(transactions);

    // Prepare data for product volume
    const productVolume = data.reduce((acc, item) => {
      const productName = item.product.name;
      const quantity = Number(item.quantity);
      acc[productName] = (acc[productName] || 0) + quantity;
      return acc;
    }, {});

    // Prepare data for top-selling products
    const sortedProducts = Object.entries(productVolume)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5); // Top 5 products
    const topSellingProductChartData = {
      labels: sortedProducts.map(([name]) => name),
      datasets: [
        {
          label: 'Top Selling Products',
          data: sortedProducts.map(([, quantity]) => quantity),
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
        },
      ],
    };

    const pieChartData = {
      labels: Object.keys(productVolume),
      datasets: [
        {
          label: 'Product Volume',
          data: Object.values(productVolume),
          backgroundColor: ['#36A2EB', '#FF6384', '#FFCE56', '#4BC0C0', '#9966FF'],
        },
      ],
    };

    // Prepare data for bar chart (remains unchanged)
    const barChartData = data.reduce((acc, item) => {
      const month = new Date(item.receipt.date_time).toLocaleString('default', { month: 'long', year: 'numeric' });
      const category = item.product.category.name;
      const productName = item.product.name;
      const quantity = item.quantity;

      if (!acc[month]) {
        acc[month] = {};
      }
      if (!acc[month][category]) {
        acc[month][category] = { labels: [], data: [] };
      }

      const productIndex = acc[month][category].labels.indexOf(productName);
      if (productIndex >= 0) {
        acc[month][category].data[productIndex] += quantity;
      } else {
        acc[month][category].labels.push(productName);
        acc[month][category].data.push(quantity);
      }

      return acc;
    }, {});

    const formattedBarChartData = Object.keys(barChartData).map(month => ({
      month,
      categories: Object.keys(barChartData[month]).map(category => ({
        category,
        labels: barChartData[month][category].labels,
        data: barChartData[month][category].data,
      }))
    }));

    return NextResponse.json({
      pieChart: pieChartData,
      topSellingProductChart: topSellingProductChartData, // Send top-selling product chart data
      barChart: formattedBarChartData,
    }, { status: 200 });
  } catch (error) {
    console.error("Something went wrong", error);
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
  }
}



