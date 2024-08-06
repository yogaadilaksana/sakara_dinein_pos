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
    const response = await fetch(`https://api.sandbox.midtrans.com/v2/${orderId}/status`, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${Buffer.from(serverKey + ':').toString('base64')}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch transaction status: ${response.statusText}`);
    }

    const transactionStatus = await response.json();

    if (!transactionStatus || !transactionStatus.transaction_status) {
      throw new Error('Invalid transaction status response');
    }


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

    // Find the receipts using payment_id
    const receipts = await prisma.receipt.findMany({
      where: { payment_id: orderId }, // Ensure this field is properly indexed
    });

    if (receipts.length > 0) {
      // Update each receipt status
      await Promise.all(
        receipts.map(receipt => 
          prisma.receipt.update({
            where: { id: receipt.id },
            data: { payment_status: status },
          })
        )
      );
    } else {
      console.warn(`No receipts found with payment_id ${orderId}`);
    }

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
    console.error('Error processing payment status:', error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
