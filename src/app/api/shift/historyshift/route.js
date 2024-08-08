import { PrismaClient } from '@prisma/client';
import { parseISO, isWithinInterval } from 'date-fns';

const prisma = new PrismaClient();

function toObject(obj) {
  return JSON.parse(JSON.stringify(obj, (key, value) =>
    typeof value === 'bigint'
      ? value.toString()
      : value
  ));
}

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const userId = parseInt(searchParams.get('userId'), 10);

  if (!userId) {
    return new Response(JSON.stringify({ error: "User ID is required" }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  try {
    const shifts = await prisma.shift.findMany({ where: { user_id: userId } });
    const users = await prisma.user.findMany();
    const incomeExpenses = await prisma.income_Expanses.findMany();
    const orderItems = await prisma.orderItem.findMany();
    const refundDetails = await prisma.refund_Detail.findMany();

    const shiftData = toObject(shifts);
    const userData = toObject(users);
    const incomeExpensesData = toObject(incomeExpenses);
    const orderItemsData = toObject(orderItems);
    const refundDetailsData = toObject(refundDetails);

    // Combine and sort shift data by start_time in descending order
    const combinedData = shiftData.map(shift => {
      const user = userData.find(user => user.id === shift.user_id);
      return {
        ...shift,
        user: user ? { id: user.id, name: user.name, email: user.email, role: user.role } : null,
      };
    }).sort((a, b) => new Date(b.start_time) - new Date(a.start_time));

    const openShifts = combinedData
      .filter(shift => !shift.end_time)
      .map(shift => ({
        id: shift.id,
        date: shift.start_time.split('T')[0],
        time: shift.start_time.split('T')[1].split('.')[0],
        status: 'open'
      }))
      .sort((a, b) => new Date(b.date + 'T' + b.time) - new Date(a.date + 'T' + a.time));

    const closedShifts = combinedData
      .filter(shift => shift.end_time)
      .map(shift => ({
        id: shift.id,
        date: shift.end_time.split('T')[0],
        time: shift.end_time.split('T')[1].split('.')[0],
        status: 'closed'
      }))
      .sort((a, b) => new Date(b.date + 'T' + b.time) - new Date(a.date + 'T' + a.time));

    const detailedShifts = combinedData.map(shift => {
      const shiftStart = new Date(shift.start_time);
      const shiftEnd = new Date(shift.end_time);

      const shiftIncomeExpenses = incomeExpensesData.filter(ie => {
        const ieDate = new Date(ie.transactionDate);
        return ieDate >= shiftStart && ieDate < shiftEnd;
      });

      const totalIncome = shiftIncomeExpenses
        .filter(ie => ie.type === 'INCOME')
        .reduce((sum, ie) => sum + ie.amount, 0);

      const totalExpenses = shiftIncomeExpenses
        .filter(ie => ie.type === 'EXPENSE')
        .reduce((sum, ie) => sum + ie.amount, 0);

      const shiftOrderItems = orderItemsData.filter(oi => {
        const oiDate = new Date(oi.order_date);
        return oiDate >= shiftStart && oiDate < shiftEnd;
      });

      const totalItemsSold = shiftOrderItems
        .reduce((sum, oi) => sum + parseInt(oi.quantity), 0);

      const shiftRefundDetails = refundDetailsData.filter(rd => {
        const rdDate = new Date(rd.refund_date);
        return rdDate >= shiftStart;
      });


      const totalItemsReturned = shiftRefundDetails
        .reduce((sum, rd) => sum + parseInt(rd.quantity), 0);

      return {
        id: shift.id,
        name: shift.user ? shift.user.name : 'Unknown',
        outlet: 'Sakara Kopi Bali Antasura',
        startingShift: `${new Date(shift.start_time).toLocaleDateString('en-GB', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        })} at ${shift.start_time.split('T')[1].split('.')[0]}`,
        itemsSold: totalItemsSold,
        itemsReturned: totalItemsReturned,
        cash: {
          startingCash: `Rp.${Number(shift.start_cash).toLocaleString()}`,
          cashSales: `Rp.${(Number(shift.total_actual) - Number(shift.start_cash)).toLocaleString()}`,
          cashFromInvoice: `Rp.0`,
          cashRefunds: `Rp.0`,
          expenseIncome: `-${totalExpenses.toLocaleString()}`,
          expectedEndingCash: `Rp.${Number(shift.total_actual).toLocaleString()}`
        }
      };
    });

    // Sort detailedShifts by start_time in descending order
    detailedShifts.sort((a, b) => new Date(b.startingShift) - new Date(a.startingShift));

    return new Response(JSON.stringify({ openShifts, closedShifts, detailedShifts }), {
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
