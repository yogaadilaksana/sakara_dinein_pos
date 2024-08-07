import Modal from './Modal';

const PaymentModal = ({ isOpen, onClose, setSelectedPaymentMethod, totalPayment }) => {
  const paymentMethods = [
    { type: 'Cash', methods: ['Cash'] },
    { type: 'E-Wallet', methods: ['Gopay', 'Qris'] },
    { type: 'Pengiriman Online', methods: ['Go-jek', 'Grab'] },
    { type: 'EDC', methods: ['Mandiri', 'BNI'] },
    { type: 'Lainnya', methods: ['Other', 'Bank Transfer'] },
  ];

  const handlePaymentMethodSelect = (method) => {
    setSelectedPaymentMethod(method);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-6 md:p-8 w-full max-w-4xl mx-auto bg-white rounded-lg shadow-lg">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 border-b border-gray-200 pb-4">
          <button
            onClick={onClose}
            className="text-slate-700 hover:text-slate-500 px-4 py-2 text-base border border-slate-500 rounded-lg"
          >
            Cancel
          </button>
          <span className="text-xl md:text-2xl font-semibold text-gray-800">{totalPayment}</span>
          <button
            onClick={() => handlePaymentMethodSelect('Selected')}
            className="bg-slate-500 hover:bg-slate-400 text-white px-4 py-2 rounded-lg"
          >
            Payment
          </button>
        </div>
        {paymentMethods.map((category) => (
          <div key={category.type} className="mb-6">
            <p className="text-lg font-semibold mb-4 text-gray-700">{category.type}</p>
            <div className="flex flex-wrap gap-4">
              {category.methods.map((method) => (
                <button
                  key={method}
                  onClick={() => handlePaymentMethodSelect(method)}
                  className="bg-gray-100 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200"
                >
                  {method}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Modal>
  );
};

export default PaymentModal;
