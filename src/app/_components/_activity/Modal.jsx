// components/Modal.js
import React from 'react';

const Modal = ({ show, onClose, children }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white w-3/4 max-w-4xl p-6 rounded-lg relative">
        {/* <button onClick={onClose} className="absolute top-4 right-4 text-gray-600">
          &times;
        </button> */}
        {children}
      </div>
    </div>
  );
};

export default Modal;
