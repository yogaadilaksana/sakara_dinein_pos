import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const RefundTransaction = ({ onClose, transaction, userId }) => {
  const [items, setItems] = useState([]);
  const [refundReason, setRefundReason] = useState('');
  const [otherReason, setOtherReason] = useState('');

  useEffect(() => {
    if (transaction && transaction.items) {
      setItems(transaction.items.map(item => ({ ...item, selected: false })));
    }
  }, [transaction]);

  const handleQuantityChange = (index, delta) => {
    const newItems = [...items];
    newItems[index].quantity += delta;
    if (newItems[index].quantity < 0) newItems[index].quantity = 0;
    setItems(newItems);
  };

  const handleSelectionChange = (index) => {
    const newItems = [...items];
    newItems[index].selected = !newItems[index].selected;
    setItems(newItems);
  };

  const calculateTotal = () => {
    const subTotal = items.reduce((total, item) => {
      if (item.selected) {
        return total + item.quantity * parseFloat(item.product_price.replace('Rp. ', '').replace('.', ''));
      }
      return total;
    }, 0);
    const tax = subTotal * 0.1;
    const total = subTotal + tax;
    return { subTotal, tax, total };
  };

  const { subTotal, tax, total } = calculateTotal();

  const handleReasonSelect = (reason) => {
    setRefundReason(reason);
    if (reason !== 'Other') {
      setOtherReason('');
    }
  };

  const connectToPrinter = async () => {
    try {
      const device = await navigator.bluetooth.requestDevice({
        acceptAllDevices: true,
        optionalServices: ['49535343-fe7d-4ae5-8fa9-9fafd205e455']
      });

      const server = await device.gatt.connect();
      const service = await server.getPrimaryService('49535343-fe7d-4ae5-8fa9-9fafd205e455');
      const characteristic = await service.getCharacteristic('49535343-8841-43f4-a8d4-ecbe34729bb3');

      return characteristic;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  };

  const handlePrint = async () => {
    const rupiah = (number) => `Rp. ${number.toLocaleString('id-ID')}`;
    console.log("this is fuckif data", transaction)
    // Mapping the data to the strukData template
    const itemsText = transaction.items.map(item => `
        ${item.name}: ${rupiah(item.product_price * item.quantity)}
        @x ${item.quantity}
    `).join('\n');

      const strukData =  `
        Sakara Coffee Bali
        receiptId: ${transaction.receiptNumber}

        ${itemsText}

        --------------------

        Subtotal: ${rupiah(transaction.subTotal)}
                
        --------------------
        
        Total: ${rupiah(transaction.total)}

        ${transaction.refundReason ? `Refund Reason: ${transaction.refundReason}\n` : ''}
        ${transaction.otherReason ? `Other Reason: ${transaction.otherReason}\n` : ''}
        User ID: ${transaction.userId || '1'}



    `;

    
  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    try {
      const characteristic = await connectToPrinter();
      if (!characteristic) {
        console.error('Characteristic not found');
        return;
      }
      const encoder = new TextEncoder();
      const data = encoder.encode(strukData);
      await characteristic.writeValue(data);
      setOrderID(null);
      updateBillItems([]);
    } catch (error) {
      console.error('Failed to print:', error);
    }
  };

  
  const handleRefund = async () => {
    try {
      const response = await fetch('/api/activities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          receiptId: transaction.receiptNumber,
          items: items.filter(item => item.selected).map(item => ({
            code: item.code,
            name: item.name,
            quantity: item.quantity,
            product_price: item.product_price,
          })),
          refundReason,
          otherReason,
          userId: userId ? userId : "1",
        }),
      });

      const result = await response.json();
      if (response.ok) {
        handlePrint()
        alert('Refund processed successfully');
        onClose();
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to process refund');
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <button onClick={onClose} className="py-2 px-4 border border-red-500 text-red-500 rounded">
          Back
        </button>
        <h2 className="text-2xl font-semibold">Refund Transaction</h2>
        <button
          onClick={handleRefund}
          className={`py-2 px-4 border rounded ${refundReason ? ' border-slate-500 text-black' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
          disabled={!refundReason}
        >
          Refund
        </button>
      </div>
      <div className="bg-gray-100 p-4 mb-4">
        <p className="font-semibold">Total amount to refund</p>
        <p className="font-semibold text-blue-500">{`Rp. ${total.toLocaleString('id-ID')}`}</p>
      </div>
      {items.map((item, index) => (
        <div
          key={index}
          className={`flex justify-between items-center mb-4 border-b pb-2 ${item.selected ? 'border border-blue-500' : ''}`}
        >
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={item.selected}
              onChange={() => handleSelectionChange(index)}
              className="form-checkbox h-5 w-5 text-blue-600"
            />
            <span className="bg-gray-200 p-1 rounded">{item.code}</span>
            <span>{item.name}</span>
          </div>
          <span>{`Rp. ${parseFloat(item.product_price.replace('Rp. ', '').replace('.', '')).toLocaleString('id-ID')}`}</span>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleQuantityChange(index, -1)}
              className="bg-gray-200 px-2 py-1 rounded"
              disabled={item.quantity <= 0}
            >
              -
            </button>
            <span>{item.quantity}</span>
            <button
              onClick={() => handleQuantityChange(index, 1)}
              className="bg-gray-200 px-2 py-1 rounded"
            >
              +
            </button>
          </div>
        </div>
      ))}
      <div className="flex justify-between font-semibold mb-2">
        <span>Sub Total:</span>
        <span>{`Rp. ${subTotal.toLocaleString('id-ID')}`}</span>
      </div>
      <div className="flex justify-between font-semibold mb-2">
        <span>PPN (10%):</span>
        <span>{`Rp. ${tax.toLocaleString('id-ID')}`}</span>
      </div>
      <div className="flex justify-between font-semibold mb-2">
        <span>Total:</span>
        <span>{`Rp. ${total.toLocaleString('id-ID')}`}</span>
      </div>
      <h3 className="text-xl font-semibold mb-2 text-center">Return Reason</h3>
      <div className="bg-gray-100 p-4 mb-4">
        <div className="flex flex-col gap-2">
          {['Products returned', 'Transaction issue', 'Transaction canceled', 'Other'].map((reason) => (
            <button
              key={reason}
              onClick={() => handleReasonSelect(reason)}
              className={`py-2 px-4 rounded ${refundReason === reason ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}
            >
              {reason}
            </button>
          ))}
        </div>
        {refundReason === 'Other' && (
          <div className="mt-2">
            <input
              type="text"
              value={otherReason}
              onChange={(e) => setOtherReason(e.target.value)}
              placeholder="Please specify"
              className="p-2 border rounded w-full"
            />
          </div>
        )}
      </div>
    </div>
  );
};

RefundTransaction.propTypes = {
  onClose: PropTypes.func.isRequired,
  transaction: PropTypes.shape({
    id: PropTypes.string.isRequired,
    items: PropTypes.arrayOf(
      PropTypes.shape({
        code: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        product_price: PropTypes.string.isRequired,
        quantity: PropTypes.number.isRequired,
        selected: PropTypes.bool,
      })
    ).isRequired,
  }).isRequired,
  userId: PropTypes.number.isRequired,
};

export default RefundTransaction;
