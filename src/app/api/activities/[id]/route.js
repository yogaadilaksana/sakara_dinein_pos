// pages/api/activities/[id].js

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function toObject(obj) {
  return JSON.parse(JSON.stringify(obj, (key, value) =>
    typeof value === 'bigint'
      ? value.toString()
      : value
  ));
}
export async function GET(req, { params }) {
  const { id } = params;
    try {
      const receipt = await prisma.receipt.findUnique({
        where: { id },
        include: {
          payment: true,
          Receipt_Detail: {
            include: {
              product: true,
            },
          },
        },
      });

      if (!receipt) {
        return res.status(404).json({ error: 'Receipt not found' });
      }

      const selectedActivity = {
        receiptNumber: receipt.id,
        paymentMethod: receipt.payment.payment_name,
        transactionTime: receipt.date_time.toLocaleString('id-ID'),
        items: receipt.Receipt_Detail.map((detail) => ({
          code: detail.product.id,
          name: detail.product.name,
          product_price: detail.product.price,
          quantity: detail.quantity,
          price: `Rp. ${parseInt(detail.subtotal).toLocaleString('id-ID')}`,
        })),
        subTotal: `Rp. ${parseInt(receipt.total).toLocaleString('id-ID')}`,
        tax: `Rp. ${parseInt(receipt.pajak).toLocaleString('id-ID')}`,
        total: `Rp. ${(parseInt(receipt.total) + parseInt(receipt.pajak)).toLocaleString('id-ID')}`,
      };

      const newReponse = toObject(selectedActivity)
      return new Response(JSON.stringify(newReponse), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      });    
    } catch (error) {
      console.log("this is error", error)
      return new Response(JSON.stringify({error: "something went wrong"}), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      });   
    }
}
