'use client'
import { checkPaymentStatus } from '../../utils/api';
import { PiArrowUUpLeft } from 'react-icons/pi';
import Link from 'next/link';
import { NumericFormat } from 'react-number-format';
import { useCartDineIn } from '@/app/_stores/dineInStore';
import { loadSnap } from '../../../utils/loadSnap';
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
          tableNumber: parseInt(tableNumber, 10),
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
            try {
              setOrderId(result.order_id);
              alert('Payment Successful!', result.order_id);
              await handlePrint();
            } catch (error) {
              alert('Failed to update order status.');
            }
          },
          onPending: function(result) {
            alert('Payment Pending!');
          },
          onError: function(result) {
            alert('Payment Failed!');
          },
          onClose: function() {
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

  // const connectToPrinter = async () => {
  //   try {
  //     const device = await navigator.bluetooth.requestDevice({
  //       acceptAllDevices: true,
  //       optionalServices: ['49535343-fe7d-4ae5-8fa9-9fafd205e455']
  //     });

  //     const server = await device.gatt.connect();
  //     const service = await server.getPrimaryService('49535343-fe7d-4ae5-8fa9-9fafd205e455');
  //     const characteristic = await service.getCharacteristic('49535343-8841-43f4-a8d4-ecbe34729bb3');

  //     return characteristic;
  //   } catch (error) {
  //     console.error('Error:', error);
  //     throw error;
  //   }
  // };

  // const handlePrint = async () => {
  //   const strukData = `
  //     Sakara Coffee Bali

  //     Bill Name : ${tableNumber}
    
  //   --------------------
  //          *Dine In*

  //    ${cart.map(item => `Item: ${item.name} Rp ${item.price * item.quantity}`).join('\n')}


  //   --------------------

  //   Subtotal: ${rupiah(subTotal)}
    
  //   --------------------
    
  //   Total: ${rupiah(subTotal)}



  // `;
    
  // const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  //   try {
  //     const characteristic = await connectToPrinter();
  //     if (!characteristic) {
  //       console.error('Characteristic not found');
  //       return;
  //     }
  //     const encoder = new TextEncoder();
  //     const data = encoder.encode(strukData);
  //     await characteristic.writeValue(data);
  //     updateBillItems([]);
  //   } catch (error) {
  //     console.error('Failed to print:', error);
  //   }
  // };

  // const printInvoice = async () => {
  //   const strukData = `
  //     Nama Toko
  //     Alamat Toko
  //     --------------------
  //     ${cart.map(item => `Item: ${item.name} Rp ${item.price * item.quantity}`).join('\n')}
  //     --------------------
  //     Total: Rp ${totalPriceToPay}
  //   `;

  //   try {
  //     const device = await navigator.bluetooth.requestDevice({
  //       acceptAllDevices: true,
  //       optionalServices: ['49535343-fe7d-4ae5-8fa9-9fafd205e455']
  //     });

  //     const server = await device.gatt.connect();
  //     const service = await server.getPrimaryService('49535343-fe7d-4ae5-8fa9-9fafd205e455');
  //     const characteristic = await service.getCharacteristic('49535343-8841-43f4-a8d4-ecbe34729bb3');

  //     if (!characteristic) {
  //       console.error('Characteristic not found');
  //       return;
  //     }
  //     const encoder = new TextEncoder();
  //     const data = encoder.encode(strukData);
  //     await characteristic.writeValue(data);
  //   } catch (error) {
  //     console.error('Failed to print:', error);
  //   }
  // };


  const connectToPrinter = async () => {
    try {
      const device = await navigator.bluetooth.requestDevice({
        filters: [{ name: 'rpp02n' }], // Nama printer yang spesifik
        optionalServices: ['49535343-fe7d-4ae5-8fa9-9fafd205e455']
      });
  
      const server = await device.gatt.connect();
      const service = await server.getPrimaryService('49535343-fe7d-4ae5-8fa9-9fafd205e455');
      const characteristic = await service.getCharacteristic('49535343-8841-43f4-a8d4-ecbe34729bb3');
  
      return { characteristic, server }; // Mengembalikan server untuk pemutusan koneksi nanti
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  };
  
  const printData = async (characteristic, strukData) => {
    try {
      const encoder = new TextEncoder();
      const data = encoder.encode(strukData);
      await characteristic.writeValue(data);
    } catch (error) {
      console.error('Error printing data:', error);
      throw error;
    }
  };
  
  const handlePrint = async () => {
    try {
      const { characteristic, server } = await connectToPrinter();
  
      const strukData = `
        Sakara Coffee Bali
  
        Bill Name : ${tableNumber}
  
        --------------------
             *Dine In*
  
       ${cart.map(item => `Item: ${item.name} Rp ${item.price * item.quantity}`).join('\n')}
  
        --------------------
  
      Subtotal: ${rupiah(subTotal)}
  
        --------------------
  
      Total: ${rupiah(subTotal)}
  
      `;
  
      await printData(characteristic, strukData);
  
      // Setelah selesai mencetak, putuskan koneksi
      await server.disconnect();
    } catch (error) {
      console.error('Error in handlePrint:', error);
    }
  };
  
  return (
    <div className="grid grid-rows-[auto_1fr_auto] min-h-screen overflow-hidden">
      <header className="fixed top-0 left-0 w-full flex items-center justify-between border-b border-qraccent/20 bg-bcprimary px-4 py-2 md:px-6 md:py-4 z-10">
        <Link href="/dine_in">
          <PiArrowUUpLeft
            size="1.5rem"
            className="text-qrprimary hover:drop-shadow-lg transition-all"
          />
        </Link>
        <h1 className="text-lg text-qrprimary md:text-xl">Keranjang Belanja</h1>
      </header>
      <main className="pt-20 md:pt-24 pb-16 md:pb-24 flex-1 overflow-y-auto">
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
                <h2 className="text-lg font-semibold mb-4">Masukkan Nomor Meja (terdapat pada meja)</h2>
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
      </main>
      {cart.length > 0 && (
        <footer className="fixed bottom-0 left-0 w-full border-t border-qraccent/20 bg-bcsecondary px-4 py-2 md:px-6 md:py-4 z-10">
          <TotalPriceCard
            totalPriceToPay={totalPriceToPay}
            onCheckout={() => setShowModal(true)} // Open modal on checkout
          />
        </footer>
      )}
    </div>
  );
}

function CartItem({ product, onAddQty, onSubtractQty }) {
  return (
    <li className="space-y-4 border border-qraccent/20 bg-bcsecondary p-4 md:p-6">
      <div className="flex flex-col md:flex-row md:items-center">
        <p className="text-md font-semibold text-qrprimary truncate">{product.name}</p>
        <div className="flex justify-between items-center mt-2 md:mt-0 md:ml-auto">
          <p className="font-semibold text-qrprimary text-lg">
            <NumericFormat
              displayType="text"
              value={product.price * product.quantity}
              prefix={"Rp."}
              thousandSeparator
            />
          </p>
          <div className="flex items-center space-x-2">
            <button
              type="button"
              className="border border-qraccent px-2 py-1 text-xs text-qraccent rounded hover:bg-qraccent hover:text-bcprimary transition-all"
              onClick={() => onSubtractQty(product.id)}
            >
              -
            </button>
            <p className="my-2 font-semibold">{product.quantity}</p>
            <button
              type="button"
              className="border border-qraccent px-2 py-1 text-xs text-qraccent rounded hover:bg-qraccent hover:text-bcprimary transition-all"
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
    <div className="flex flex-col md:flex-row justify-between items-center">
      <p className="text-lg font-semibold text-qrprimary">
        Total: <NumericFormat value={totalPriceToPay} prefix={"Rp."} thousandSeparator />
      </p>
      <button
        onClick={onCheckout}
        className="bg-qrprimary text-bcprimary py-2 px-4 rounded mt-4 md:mt-0"
      >
        Checkout
      </button>
    </div>
  );
}

export default Page;
