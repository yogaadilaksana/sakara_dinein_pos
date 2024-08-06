// Misalkan ini adalah fungsi API route Next.js
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
    try {
      const shifts = await prisma.shift.findMany();
      const users = await prisma.user.findMany();
      const incomeExpenses = await prisma.income_Expanses.findMany();
      const orderItems = await prisma.orderItem.findMany();
      const refundDetails = await prisma.refund_Detail.findMany();
  
      const shiftData = toObject(shifts);
      const userData = toObject(users);
      const incomeExpensesData = toObject(incomeExpenses);
      const orderItemsData = toObject(orderItems);
      const refundDetailsData = toObject(refundDetails);
  
      const combinedData = shiftData.map(shift => {
        const user = userData.find(user => user.id === shift.user_id);
        return {
          ...shift,
          user: user ? { id: user.id, name: user.name, email: user.email, role: user.role } : null,
        };
      });
  
      const openShifts = combinedData
        .filter(shift => !shift.end_time)
        .map(shift => ({
          id: shift.id,
          date: shift.start_time.split('T')[0],
          time: shift.start_time.split('T')[1].split('.')[0],
          status: 'open'
        }));
      
      const closedShifts = combinedData
        .filter(shift => shift.end_time)
        .map(shift => ({
          id: shift.id,
          date: shift.end_time.split('T')[0],
          time: shift.end_time.split('T')[1].split('.')[0],
          status: 'closed'
        }));
  
      const detailedShifts = combinedData.map(shift => {
        const shiftStart = new Date(shift.start_time);
        const shiftEnd = new Date(shift.end_time);

        const shiftIncomeExpenses = incomeExpensesData.filter(ie => {
            const ieDate = new Date(ie.transactionDate);
   
            // Periksa apakah tanggal income/expense berada dalam rentang shift
            const withinRange = ieDate >= shiftStart;

            return withinRange;
        });

        const totalIncome = shiftIncomeExpenses
          .filter(ie => ie.type === 'INCOME')
          .reduce((sum, ie) => sum + ie.amount, 0);
  
        const totalExpenses = shiftIncomeExpenses
          .filter(ie => ie.type === 'EXPENSE')
          .reduce((sum, ie) => sum + ie.amount, 0);
  
        const shiftOrderItems = orderItemsData.filter(oi => {
          const oiDate = new Date(oi.orderDate);
          return oiDate >= shiftStart && oiDate < shiftEnd;
        });
  
        const totalItemsSold = shiftOrderItems
          .reduce((sum, oi) => sum + oi.quantity, 0);
  
        const shiftRefundDetails = refundDetailsData.filter(rd => {
          const rdDate = new Date(rd.refundDate);
          return rdDate >= shiftStart && rdDate < shiftEnd;
        });
  
        const totalItemsReturned = shiftRefundDetails
          .reduce((sum, rd) => sum + rd.quantity, 0);
  
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
  
    //   console.log("Detailed shifts:", detailedShifts);
  
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
