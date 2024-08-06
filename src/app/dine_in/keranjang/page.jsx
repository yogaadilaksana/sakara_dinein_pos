'use client'
import { checkPaymentStatus } from '../../utils/api';
import { PiArrowUUpLeft } from 'react-icons/pi';
import Link from 'next/link';
import { NumericFormat } from 'react-number-format';
import { useCartDineIn } from '@/app/_stores/dineInStore';
import { loadSnap } from '../../utils/loadSnap';
import { useEffect, useState } from 'react';
import EmptyList from '@/app/_components/_dine_in/EmptyList';
import Modal from '@/app/_components/_dine_in/Modal';

function Page() {
  const { cart, handleAddQty, handleSubtractQty } = useCartDineIn();
  const [orderId, setOrderId] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [tableNumber, setTableNumber] = useState('');
  const totalPriceToPay = handleTotalPrice();

  function handleTotalPrice() {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  }

  async function handleCheckout() {
    try {
      const response = await fetch('/api/order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tableNumber: parseInt(tableNumber, 10),  // Use the input table number
          items: cart,
          customerDetails: {
            first_name: 'Uncle',
            last_name: 'BOB',
            email: 'customer@example.com',
            phone: '08111222333',
          },
        }),
      });

      if (response.ok) {
        const { token } = await response.json();
        const snap = await loadSnap();

        snap.pay(token, {
          onSuccess: async function(result) {
            console.log('Payment Success:', result);
            try {
              setOrderId(result.order_id);
              alert('Payment Successful!', result.order_id);
              await printInvoice();
            } catch (error) {
              alert('Failed to update order status.');
            }
          },
          onPending: function(result) {
            console.log('Payment Pending:', result);
            alert('Payment Pending!');
          },
          onError: function(result) {
            console.log('Payment Error:', result);
            alert('Payment Failed!');
          },
          onClose: function() {
            console.log('Customer closed the payment popup');
            alert('Payment popup closed.');
          }
        });
      } else {
        const { error } = await response.json();
        console.error('Payment Initialization Error:', error);
        alert('Failed to initiate payment.');
      }
    } catch (error) {
      console.error('Payment Processing Error:', error);
      alert('An error occurred during payment processing.');
    }
  }

  useEffect(() => {
    if (orderId) {
      const checkPaymentStatus = async () => {
        try {
          const response = await fetch('/api/order/checkPayment', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ orderId }),
          });

          if (response.ok) {
            const result = await response.json();
            setPaymentStatus(result.paymentStatus);
          }
        } catch (error) {
          console.error('Error checking payment status:', error);
        }
      };

      const interval = setInterval(() => {
        checkPaymentStatus();
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [orderId]);

  const printInvoice = async () => {
    const strukData = `
      Nama Toko
      Alamat Toko
      --------------------
      ${cart.map(item => `Item: ${item.name} Rp ${item.price * item.quantity}`).join('\n')}
      --------------------
      Total: Rp ${totalPriceToPay}
    `;

    try {
      const device = await navigator.bluetooth.requestDevice({
        acceptAllDevices: true,
        optionalServices: ['49535343-fe7d-4ae5-8fa9-9fafd205e455']
      });

      const server = await device.gatt.connect();
      const service = await server.getPrimaryService('49535343-fe7d-4ae5-8fa9-9fafd205e455');
      const characteristic = await service.getCharacteristic('49535343-8841-43f4-a8d4-ecbe34729bb3');

      if (!characteristic) {
        console.error('Characteristic not found');
        return;
      }
      const encoder = new TextEncoder();
      const data = encoder.encode(strukData);
      await characteristic.writeValue(data);
      console.log('Data sent to printer');
    } catch (error) {
      console.error('Failed to print:', error);
    }
  };

  return (
    <div className="grid grid-rows-[auto_1fr_auto] overflow-y-auto overflow-x-hidden min-h-screen">
      <div className="fixed flex w-full items-center space-x-6 border-b border-qraccent/20 bg-bcprimary px-6 pb-6 pt-8">
        <Link href="/dine_in">
          <PiArrowUUpLeft
            size="1.5rem"
            className="text-qrprimary hover:drop-shadow-lg hover:size-7 duration-300 transition-all"
          />
        </Link>
        <h1 className="grow text-lg text-qrprimary">Keranjang Belanja</h1>
      </div>
      {cart.length > 0 ? (
        <div>
          <div className="mb-40 mt-28 px-2">
            <ul>
              {cart.map((items, i) => (
                <CartItem
                  product={items}
                  key={i}
                  onAddQty={handleAddQty}
                  onSubtractQty={handleSubtractQty}
                />
              ))}
            </ul>
          </div>
          <div className="fixed bottom-0 w-full border-t border-qraccent/20 bg-bcsecondary px-6 py-6">
            <TotalPriceCard
              totalPriceToPay={totalPriceToPay}
              onCheckout={() => setShowModal(true)} // Open modal on checkout
            />
          </div>
          {showModal && (
            <Modal onClose={() => setShowModal(false)}>
              <div className="p-6">
                <h2 className="text-lg font-semibold mb-4">Masukkan Nomor Meja</h2>
                <input
                  type="text"
                  value={tableNumber}
                  onChange={(e) => setTableNumber(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded mb-4"
                  placeholder="Nomor Meja"
                />
                <button
                  onClick={() => {
                    handleCheckout();
                    setShowModal(false);
                  }}
                  className="bg-qrprimary text-bcprimary py-2 px-4 rounded"
                >
                  Konfirmasi
                </button>
              </div>
            </Modal>
          )}
        </div>
      ) : (
        <div className="mt-20 mb-56">
          <EmptyList
            title={"Belum Ada Pesanan"}
            description={"Mulai pesan menu favoritmu!"}
          />
        </div>
      )}
    </div>
  );
}

function CartItem({ product, onAddQty, onSubtractQty }) {
  return (
    <li className="space-x-4 border border-qraccent/20 bg-bcsecondary px-8 py-6 mb-2">
      <div>
        <div className="flex w-full items-start">
          <p className="truncate text-md font-semibold text-qrprimary">
            {product.name}
          </p>
        </div>

        <div className="flex justify-between items-center">
          <p className="font-semibold text-qrprimary text-lg">
            <NumericFormat
              displayType="text"
              value={product.price * product.quantity}
              prefix={"Rp."}
              thousandSeparator
            />
          </p>
          <div className="flex items-center space-x-4">
            <button
              type="button"
              className="border border-qraccent px-2 text-xs text-qraccent focus:bg-qraccent focus:text-bcprimary"
              onClick={() => onSubtractQty(product.id)}
            >
              -
            </button>
            <p className="my-2 font-semibold">{product.quantity}</p>
            <button
              type="button"
              className="border border-qraccent px-2 text-xs text-qraccent focus:bg-qraccent focus:text-bcprimary"
              onClick={() => onAddQty(product.id)}
            >
              +
            </button>
          </div>
        </div>
      </div>
    </li>
  );
}

function TotalPriceCard({ totalPriceToPay, onCheckout }) {
  return (
    <div className="flex justify-between items-center">
      <p className="text-lg font-semibold text-qrprimary">
        Total: <NumericFormat value={totalPriceToPay} prefix={"Rp."} thousandSeparator />
      </p>
      <button
        onClick={onCheckout}
        className="bg-qrprimary text-bcprimary py-2 px-4 rounded"
      >
        Checkout
      </button>
    </div>
  );
}

export default Page;
