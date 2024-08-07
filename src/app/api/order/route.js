import { PrismaClient } from '@prisma/client';
import midtransClient from 'midtrans-client';

const prisma = new PrismaClient();

const serverKey = process.env.NODE_ENV === 'production'
  ? process.env.MIDTRANS_SERVER_KEY_PRODUCTION
  : process.env.MIDTRANS_SERVER_KEY_SANDBOX;

let snap = new midtransClient.Snap({
  isProduction: process.env.NODE_ENV === 'production',
  serverKey: serverKey,
});

export async function POST(req, res) {
  const { tableNumber, items, customerDetails, type='' } = await req.json();
  const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const discount = 0; // Define your discount calculation if applicable
  const tax = total * 0.1; // Define your tax calculation if applicable
  var transaction;
  try {
    // Create the order
    const order = await prisma.order.create({
      data: {
        table_number: tableNumber,
        total: total,
        status: 'PENDING_PAYMENT',
        OrderItem: {
          create: items.map(item => ({
            product_id: item.id,
            price: item.price,
            quantity: item.quantity,
            subtotal: item.price * item.quantity,
          })),
        },
      },
      include: {
        OrderItem: true,
      },
    });

    // Create Midtrans transaction parameters
    const parameter = {
      transaction_details: {
        order_id: `order-${order.id}`,
        gross_amount: total,
      },
      item_details: items.map(item => ({
        id: item.id,
        price: item.price,
        quantity: item.quantity,
        name: item.name,
      })),
      customer_details: customerDetails,
    };

    if(type === ''){
      transaction = await snap.createTransaction(parameter);
    }

    // Create Midtrans transaction

    // Create payment record
    const payment = await prisma.payment.create({
      data: {
        id: `order-${order.id}`,
        payment_name: 'Midtrans',
        snap_token: type === '' ? transaction.token : '',
        status: type === '' ? 'PENDING_PAYMENT' : 'PAID',
        expiry: new Date(new Date().getTime() + 30 * 60000), // 30 minutes expiry
      },
    });

    // Create receipt record
    const receipt = await prisma.receipt.create({
      data: {
        total: total,
        diskon: discount,
        pajak: tax,
        payment_id: payment.id,
        payment_status: type === '' ? 'PENDING_PAYMENT' : "PAID",
        Receipt_Detail: {
          create: items.map(item => ({
            product_id: item.id,
            quantity: item.quantity,
            subtotal: item.price * item.quantity,
          })),
        },
      },
    });

    return new Response(JSON.stringify(type === '' ?{ token: transaction.token } : {message: "SUCCESS"}), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}

export async function PUT(req) {
  const { orderId } = await req.json();

  try {
    // Fetch the payment record
    const payment = await prisma.payment.findUnique({
      where: { id: orderId },
    });

    if (!payment) {
      return new Response(JSON.stringify({ error: 'Payment record not found' }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    // Check the payment status with Midtrans
    const transactionStatus = await snap.transaction.status(payment.snap_token);

    let status = 'PENDING_PAYMENT';
    if (transactionStatus.transaction_status === 'settlement') {
      status = 'PAID';
    } else if (transactionStatus.transaction_status === 'cancel' || transactionStatus.transaction_status === 'expire') {
      status = 'CANCELED';
    }

    // Update the payment record
    await prisma.payment.update({
      where: { id: orderId },
      data: { status: status },
    });

    // Update the receipt status
    await prisma.receipt.update({
      where: { payment_id: orderId },
      data: { payment_status: status },
    });

    // Optionally: Update order status based on payment status
    if (status === 'PAID') {
      await prisma.order.update({
        where: { id: BigInt(orderId.replace('order-', '')) },
        data: { status: 'PAID' },
      });
    }

    return new Response(JSON.stringify({ status: status }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
