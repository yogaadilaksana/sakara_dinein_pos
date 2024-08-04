import { useState } from 'react';
import Modal from './Modal';

const BillSummary = ({ billItems, addTable }) => {
  const [showTableData, setShowTableData] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tables, setTables] = useState([
    { name: "Meja 1", details: "Details for Meja 1" },
    { name: "Meja 2", details: "Details for Meja 2" },
    { name: "Meja 3", details: "Details for Meja 3" },
  ]);

  const handleAddTable = (tableName) => {
    const newTable = { name: tableName, details: `Details for ${tableName}` };
    setTables([...tables, newTable]);
    addTable(newTable);
  };

  const subtotal = billItems.reduce((total, item) => total + (item.price * item.quantity), 0);

  return (
    <div className="bg-white rounded-lg shadow p-4 w-1/4">
      <div className="flex justify-between items-center mb-4">
        <div className="text-lg font-semibold">Bills Name</div>
        <div className="flex space-x-2">
          <button
            onClick={() => setShowTableData(!showTableData)}
            className="bg-blue-900 text-white px-2 py-1 rounded-lg"
          >
            {showTableData ? "Hide Tables" : "Show Tables"}
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-900 text-white px-2 py-1 rounded-lg"
          >
            Add Table
          </button>
        </div>
      </div>

      {showTableData && (
        <div className="mb-4">
          {tables.map((table, index) => (
            <div key={index} className="mb-2">
              <div className="font-semibold">{table.name}</div>
              <div className="text-gray-500">{table.details}</div>
            </div>
          ))}
        </div>
      )}

      {billItems.map((item, index) => (
        <div key={index} className="flex justify-between">
          <div>{item.name}</div>
          <div>{item.quantity}</div>
          <div>Rp. {item.price * item.quantity}</div>
        </div>
      ))}
      <div className="mt-4">
        <div className="flex justify-between">
          <div>Subtotal</div>
          <div>Rp. {subtotal}</div>
        </div>
        <div className="flex justify-between">
          <div>Diskon</div>
          <div>Rp. 0</div>
        </div>
        <div className="flex justify-between">
          <div>Pajak</div>
          <div>Rp. 0</div>
        </div>
        <div className="flex justify-between mt-4 font-semibold">
          <div>Total</div>
          <div>Rp. {subtotal}</div>
        </div>
      </div>
      <div className="flex justify-between mt-4">
        <button className="bg-blue-900 text-white px-4 py-2 rounded-lg">Print Bills</button>
        <button className="bg-blue-900 text-white px-4 py-2 rounded-lg">Payment</button>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onAddTable={handleAddTable} />
    </div>
  );
};

export default BillSummary;
