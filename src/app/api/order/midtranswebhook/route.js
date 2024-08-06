import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();
const serverKey = process.env.NODE_ENV === 'production'
  ? process.env.MIDTRANS_SERVER_KEY_PRODUCTION
  : process.env.MIDTRANS_SERVER_KEY_SANDBOX;

export  async function POST(req, res) {
    const signatureKey = req.headers['x-signature-key'];
    const body = JSON.stringify(await req.json());

    const hash = crypto.createHmac('sha512', serverKey).update(body).digest('hex');

    if (hash === signatureKey) {
      const { order_id, transaction_status } = await req.json();

      let status;
      switch (transaction_status) {
        case 'settlement':
          status = 'PAID';
          break;
        case 'pending':
          status = 'PENDING_PAYMENT';
          break;
        case 'cancel':
        case 'deny':
        case 'expire':
          status = 'CANCELED';
          break;
        default:
          status = 'PENDING_PAYMENT';
      }

      try {
        await prisma.payment.update({
          where: { id: order_id },
          data: {
            status,
          },
        });

        if (status === 'PAID') {
          await prisma.order.update({
            where: { id: order_id },
            data: {
              status: 'PAID',
            },
          });
        }

        // res.status(200).json({ message: 'Payment status updated successfully' });
        return new Response(JSON.stringify({message: 'Payment status updated successfully' }), {
            status: 200,
            headers: {
              'Content-Type': 'application/json',
            },
          });
      } catch (error) {
        console.error(error);
        // res.status(500).json({ error: 'Failed to update payment status' });
        return new Response(JSON.stringify({error: 'Failed Update Payment Status' }), {
            status: 500,
            headers: {
              'Content-Type': 'application/json',
            },
          });
      }
    } else {
    //   res.status(400).json({ error: 'Invalid signature key' });
    return new Response(JSON.stringify({error: 'Invalida signature key' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }
}
