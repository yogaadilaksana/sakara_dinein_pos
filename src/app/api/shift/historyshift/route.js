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
        const refundDetails = await prisma.refund.findMany({
          include: {
            refund_detail: true,
          },
        });

        // Tambahkan query untuk mengambil data receipt dan payment
        const receipts = await prisma.receipt.findMany();
        const payments = await prisma.payment.findMany();

        const shiftData = toObject(shifts);
        const userData = toObject(users);
        const incomeExpensesData = toObject(incomeExpenses);
        const orderItemsData = toObject(orderItems);
        const refundDetailsData = toObject(refundDetails);
        const receiptData = toObject(receipts);
        const paymentData = toObject(payments);

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
                .reduce((sum, ie) => sum + (parseInt(ie.amount) || 0), 0);

            const totalExpenses = shiftIncomeExpenses
                .filter(ie => ie.type === 'EXPENSE')
                .reduce((sum, ie) => sum + (parseInt(ie.amount) || 0), 0);

            const shiftOrderItems = orderItemsData.filter(oi => {
                const oiDate = new Date(oi.order_date);
                return oiDate >= shiftStart && (shiftEnd ? oiDate <= shiftEnd : true);
            });

            const totalItemsSold = shiftOrderItems
                .reduce((sum, oi) => sum + (parseInt(oi.quantity) || 0), 0);

            const totalSales = shiftOrderItems
                .reduce((sum, oi) => sum + (parseInt(oi.subtotal) || 0), 0);

            const totalCashFromInvoice = totalSales;

            const cashPayments = paymentData.filter(payment => payment.payment_name === 'Cash');
            const cashReceipts = receiptData.filter(receipt => {
                const receiptDate = new Date(receipt.date);
                return receiptDate >= shiftStart && (shiftEnd ? receiptDate <= shiftEnd : true);
            });

            const totalCashSales = cashReceipts
                .filter(receipt => cashPayments.some(payment => payment.receipt_id === receipt.id))
                .reduce((sum, receipt) => sum + (parseInt(receipt.amount) || 0), 0);

                const shiftRefundDetails = refundDetailsData.filter(rd => {
                    // Memastikan rd.date_time valid
                    const rdDate = new Date(rd.date_time);
                    const isValidDate = !isNaN(rdDate.getTime());
                
                    // Memastikan rd.refund_detail valid dan merupakan array
                    const hasValidRefundDetails = Array.isArray(rd.refund_detail) && rd.refund_detail.length > 0;
                
                    // Mengembalikan hanya entri yang valid
                    return isValidDate &&
                           rdDate >= shiftStart &&
                           (shiftEnd ? rdDate <= shiftEnd : true) &&
                           hasValidRefundDetails;
                });
            console.log("this is data from refund", shiftRefundDetails);
            const totalItemsReturned = shiftRefundDetails.reduce((sum, rd) => {
              return sum + rd.refund_detail.reduce((innerSum, detail) => innerSum + (parseInt(detail.quantity) || 0), 0);
            }, 0);

            const expanseIncomePrice = totalIncome - totalExpenses;

            const totalRefundPrice = shiftRefundDetails
                .reduce((sum, bd) => sum + (parseInt(bd.total) || 0), 0);

                console.log("this is data from totalRefundPrice", totalRefundPrice)
            return {
                id: shift.id,
                name: shift.user ? shift.user.name : 'Unknown',
                outlet: 'Sakara Kopi Bali Antasura',
                startingShift: convertUTCToLocalTime(shift.start_time),
                itemsSold: totalItemsSold,
                totalSales: `Rp.${totalSales.toLocaleString()}`,
                itemsReturned: totalItemsReturned,
                cash: {
                    startingCash: `Rp.${Number(shift.start_cash).toLocaleString()}`,
                    cashSales: `Rp.${totalCashSales.toLocaleString()}`, // Updated cash sales
                    cashFromInvoice: `Rp.${totalCashFromInvoice.toLocaleString()}`,
                    cashRefunds: `Rp.${totalRefundPrice.toLocaleString()}`,
                    expenseIncome: `${expanseIncomePrice.toLocaleString()}`,
                    expectedEndingCash: `Rp.${Number(shift.total_actual).toLocaleString()}`
                }
            };
        });

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

