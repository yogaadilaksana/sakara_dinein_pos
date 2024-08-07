// pages/api/midtransPayment.js

import midtransClient from 'midtrans-client';

const serverKey = process.env.MIDTRANS_SERVER_KEY;

let snap = new midtransClient.Snap({
  isProduction: false,
  serverKey: serverKey,
});

function toObject(obj) {
    return JSON.parse(JSON.stringify(obj, (key, value) =>
      typeof value === 'bigint'
        ? value.toString()
        : value
    ));
  }
export async function POST(req, res) {
    try {
      const { items, customerDetails } = await req.json();
      const parameter = {
        transaction_details: {
          order_id: `order-id-${Math.floor(Math.random() * 1000000000)}`,
          gross_amount: items.reduce((total, item) => total + item.price * item.quantity, 0),
        },
        item_details: items.map((item) => ({
          id: item.id,
          price: item.price,
          quantity: item.quantity,
          name: item.name,
        })),
        customer_details: customerDetails,
      };

      const transaction = await snap.createTransaction(parameter);
      return new Response(JSON.stringify({token: transaction.token }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch (err) {
        return new Response(JSON.stringify({error: err}), {
            status: 500,
            headers: {
              'Content-Type': 'application/json',
            },
          });
    }
}
