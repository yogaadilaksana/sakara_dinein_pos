// components/_activity/SendReceiptModal.js
import React, { useEffect } from 'react';

const SendReceiptModal = ({ show, onClose, transaction }) => {
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (event.target.closest('#modal-content')) return;
      onClose();
    };

    if (show) {
      document.addEventListener('mousedown', handleOutsideClick);
    } else {
      document.removeEventListener('mousedown', handleOutsideClick);
    }

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div id="modal-content" className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-center text-2xl font-semibold mb-4">Send Receipt</h2>
        <div className="text-center text-4xl font-bold mb-2">{transaction.total}</div>
        <div className="text-center mb-4">How would you like to receive your receipt?</div>
        <div className="space-y-4">
          <div className="flex space-x-2">
            <input
              type="email"
              placeholder="Email Receipt"
              className="w-full p-2 border border-gray-300 rounded"
            />
            <button className="px-4 py-2 bg-blue-500 text-white rounded">SEND</button>
          </div>
          <div className="flex space-x-2">
            <input
              type="text"
              placeholder="+62 1234"
              className="w-full p-2 border border-gray-300 rounded"
            />
            <button className="px-4 py-2 bg-blue-500 text-white rounded">SEND</button>
          </div>
        </div>
        <button className="mt-4 w-full px-4 py-2 bg-slate-500 text-white rounded">PRINT RECEIPT</button>
      </div>
    </div>
  );
};

export default SendReceiptModal;
