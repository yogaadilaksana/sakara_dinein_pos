import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function toObject(obj) {
  return JSON.parse(JSON.stringify(obj, (key, value) =>
    typeof value === 'bigint'
      ? value.toString()
      : value
  ));
}

export async function GET(req, res) {
  if (req.method === 'GET') {
    try {
      const receipts = await prisma.receipt.findMany({
        include: {
          payment: true,
          Receipt_Detail: {
            include: {
              product: true,
            },
          },
        },
        orderBy: {
          date_time: 'desc', // Sort by latest date_time
        },
      });

      // Process the receipts and map to activities
      const activities = receipts.map((receipt) => {
        // Group items by their order
        const itemDescriptions = receipt.Receipt_Detail.map(detail => {
          return `${detail.quantity}x ${detail.product.name}`;
        }).join(' / ');

        return {
          id: receipt.id,
          amount: `Rp. ${parseInt(receipt.total).toLocaleString('id-ID')}`,
          time: receipt.date_time.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
          status: receipt.payment_status === 'CANCELED' ? 'CANCELED' : '',
          description: itemDescriptions,
          transaction_date: receipt.date_time
        };
      });

      return new Response(JSON.stringify(activities), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch activities' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

export async function POST(req, res) {
  const { receiptId, items, refundReason, otherReason, userId, subtotal } = await req.json();

  if (!receiptId) {
    return new Response(JSON.stringify({ error: "no receipt found" }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  try {
    // Check if receipt exists
    const receipt = await prisma.receipt.findUnique({
      where: { id: receiptId },
      include: { Receipt_Detail: true, payment: true } // Include payment to update status later
    });

    if (!receipt) {
      return new Response(JSON.stringify({ error: "RECEIPT NOT FOUND" }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    // Calculate total refund amount
    const total = items.reduce((sum, item) => {
      return sum + item.quantity * parseFloat(item.product_price.replace('Rp. ', '').replace('.', ''));
    }, 0);
    const subTotal = parseFloat(total) * 0.1;

    // Create a refund record
    const refund = await prisma.refund.create({
      data: {
        total: total,
        reason: refundReason === 'Other' ? otherReason : refundReason,
        status: 'CANCELED', // Set initial status as 'Pending'
        user: { connect: { id: userId } }, // Connect existing user
        refund_detail: {
          create: items.map(item => ({
            product: { connect: { id: item.code } },
            quantity: item.quantity,
            subtotal: item.subtotal ? item.subtotal : subTotal
          }))
        },
        receipt: { connect: { id: receiptId } } // Connect existing receipt
      },
      include: { // Include related models if needed
        refund_detail: true,
        receipt: true,
        user: true // Ensure user relationship is included
      }
    });

    // Update receipt payment status
    await prisma.receipt.update({
      where: { id: receiptId },
      data: { payment_status: 'CANCELED' }
    });

    // Update payment status if payment exists
    if (receipt.payment) {
      await prisma.payment.update({
        where: { id: receipt.payment_id },
        data: { status: 'CANCELED' }
      });
    }

    // Respond with success
    return new Response(JSON.stringify({ message: "SUCCESS" }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error processing refund:', error);
    return new Response(JSON.stringify({ message: "Something Went Wrong" }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}

