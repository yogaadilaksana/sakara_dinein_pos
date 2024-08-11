import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function toObject(obj) {
    return JSON.parse(JSON.stringify(obj, (key, value) =>
        typeof value === 'bigint'
            ? value.toString()
            : value
    ));
}

function convertUTCToLocalTime(utcDateStr, timeZone = 'Asia/Makassar') {
    const utcDate = new Date(utcDateStr);
    return utcDate.toLocaleString('en-GB', { timeZone });
}

export async function GET(req) {
    try {
        const shifts = await prisma.shift.findMany();
        const users = await prisma.user.findMany();
        const incomeExpenses = await prisma.income_Expanses.findMany();
        const orderItems = await prisma.orderItem.findMany();
        // const refundDetails = await prisma.refund.findMany();
        const refundDetails = await prisma.refund.findMany({
          include: {
            refund_detail: true, // Include the related refund_detail
          },
        });

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
        }).sort((a, b) => new Date(b.start_time) - new Date(a.start_time));

        const openShifts = combinedData
            .filter(shift => !shift.end_time)
            .map(shift => ({
                id: shift.id,
                date: convertUTCToLocalTime(shift.start_time).split(', ')[0],
                time: convertUTCToLocalTime(shift.start_time).split(', ')[1],
                status: 'open'
            }))
            .sort((a, b) => new Date(b.date + 'T' + b.time) - new Date(a.date + 'T' + a.time));

        const closedShifts = combinedData
            .filter(shift => shift.end_time)
            .map(shift => ({
                id: shift.id,
                date: convertUTCToLocalTime(shift.end_time).split(', ')[0],
                time: convertUTCToLocalTime(shift.end_time).split(', ')[1],
                status: 'closed'
            }))
            .sort((a, b) => new Date(b.date + 'T' + b.time) - new Date(a.date + 'T' + a.time));

        const detailedShifts = combinedData.map(shift => {
            const shiftStart = new Date(shift.start_time);
            const shiftEnd = shift.end_time ? new Date(shift.end_time) : null;

            const shiftIncomeExpenses = incomeExpensesData.filter(ie => {
                const ieDate = new Date(ie.transactionDate);
                return ieDate >= shiftStart;
            });

            const totalIncome = shiftIncomeExpenses
                .filter(ie => ie.type === 'INCOME')
                .reduce((sum, ie) => sum + ie.amount, 0);

            const totalExpenses = shiftIncomeExpenses
                .filter(ie => ie.type === 'EXPENSE')
                .reduce((sum, ie) => sum + ie.amount, 0);

            const shiftOrderItems = orderItemsData.filter(oi => {
                const oiDate = new Date(oi.order_date);
                return oiDate >= shiftStart && shiftStart <= oiDate;
            });

            const totalItemsSold = shiftOrderItems
                .reduce((sum, oi) => sum + parseInt(oi.quantity, 10), 0);

            // Calculate subtotal for each order item
            // console.log("this is shiftOredersItems", shiftOrderItems)
            const totalSales = shiftOrderItems
                .reduce((sum, oi) => sum + parseInt(oi.subtotal),0 )

            // console.log("this is data from total sales", totalSales);            
            // Total cash from invoices
            const totalCashFromInvoice = totalSales;

            // Filter refund details berdasarkan shift time
            const shiftRefundDetails = refundDetailsData.filter(rd => {
              const rdDate = new Date(rd.date_time);
              return rdDate >= shiftStart && shiftStart <=rdDate;
            });
            
            // Menghitung total item yang dikembalikan
            const totalItemsReturned = shiftRefundDetails.reduce((sum, rd) => {
              return sum + rd.refund_detail.reduce((innerSum, detail) => innerSum + parseInt(detail.quantity), 0);
            }, 0);

            // Menghitung total harga refund

              // console.log("this is total price refund", shiftRefundDetails[0].refund_detail);
            const expanseIncomePrice = parseInt(totalIncome) - parseInt(totalExpenses);

            const totalRefundPrice = shiftRefundDetails
                .reduce((sum, bd) => sum + parseInt(bd.subtotal), 0)

            return {
                id: shift.id,
                name: shift.user ? shift.user.name : 'Unknown',
                outlet: 'Sakara Kopi Bali Antasura',
                startingShift: convertUTCToLocalTime(shift.start_time), // Menggunakan format lokal
                itemsSold: totalItemsSold,
                totalSales: `Rp.${totalSales.toLocaleString()}`, // Total harga dari item yang terjual
                itemsReturned: totalItemsReturned,
                cash: {
                    startingCash: `Rp.${Number(shift.start_cash).toLocaleString()}`,
                    cashSales: `Rp.${totalCashFromInvoice.toLocaleString()}`,
                    cashFromInvoice:`Rp.${totalCashFromInvoice.toLocaleString()}`, // Cash from invoices
                    cashRefunds: `Rp.${totalRefundPrice.toLocaleString()}`,
                    expenseIncome: `-${expanseIncomePrice.toLocaleString()}`,
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
