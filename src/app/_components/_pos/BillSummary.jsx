import { useState } from 'react';
import { FaPlus, FaMinus, FaTable } from 'react-icons/fa';
import Modal from './Modal';

const BillSummary = ({ billItems, addTable, updateQuantity, tables, setTables }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTableName, setNewTableName] = useState('');
  const [selectedTable, setSelectedTable] = useState('');

  const rupiah = (number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR"
    }).format(number);
  };

  const handleAddTable = () => {
    if (newTableName.trim()) {
      addTable({ name: newTableName, details: 'Details here' });
      setNewTableName('');
    }
  };

  const handleDeleteTable = (tableName) => {
    setTables(tables.filter(table => table.name !== tableName));
  };

  const handleSelectTable = (tableName) => {
    setSelectedTable(tableName);
  };

  const subTotal = billItems.reduce((total, item) => total + item.price * item.quantity, 0);
  const pajak = parseInt(subTotal) * 0.1;
  const total = parseInt(subTotal) + parseInt(pajak);

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
    const strukData = `
      Nama Toko
      Alamat Toko
      --------------------
      ${billItems.map(item => `${item.name}: ${rupiah(item.price * item.quantity)}`).join('\n')}
      --------------------
      Subtotal: ${rupiah(subTotal)}
      Pajak: ${rupiah(pajak)}
      Total: ${rupiah(total)}
    `;
    
    try {
      const characteristic = await connectToPrinter();
      if (!characteristic) {
        console.error('Characteristic not found');
        return;
      }
      const encoder = new TextEncoder();
      const data = encoder.encode(strukData);
      await characteristic.writeValue(data);
    } catch (error) {
      console.error('Failed to print:', error);
    }
  };

  const handlePayment = async () => {
    alert("hehehehe")
  };

  return (
    <div className="border p-4 w-full border-gray-300 bg-white rounded-2xl overflow-y-auto">
      <div className="flex flex-col md:flex-row justify-between items-start mb-4">
        <h2 className="text-base md:text-lg">Bills Summary</h2>
        <div className="flex items-center space-x-2 md:space-x-4">
          <span className="text-xs md:text-sm">{selectedTable}</span>
          <button onClick={() => setIsModalOpen(true)} className="text-blue-500 text-xs md:text-sm">
            <FaTable />
          </button>
        </div>
      </div>
      
      <div className="overflow-y-auto max-h-60">
        {billItems.map((item, index) => (
          <div key={index} className="flex flex-col md:flex-row justify-between items-start mb-2 text-xs md:text-sm">
            <div>
              <p className="font-semibold">{item.name}</p>
              <p className="text-gray-500">Rp. {item.price}</p>
              {item.extras.extraEspresso > 0 && (
                <p className="text-gray-700">Extra Espresso: {item.extras.extraEspresso}</p>
              )}
              {item.extras.extraSyrup > 0 && (
                <p className="text-gray-700">Extra Syrup: {item.extras.extraSyrup}</p>
              )}
              {item.note && <p className="text-gray-700">Catatan: {item.note}</p>}
            </div>
            <div className="flex items-center space-x-1 md:space-x-2 mt-2 md:mt-0">
              <button
                onClick={() => updateQuantity(item.name, item.quantity - 1)}
                className="bg-gray-200 text-gray-600 px-1 py-0.5 rounded-l text-xs md:text-sm"
                disabled={item.quantity === 1}
              >
                <FaMinus />
              </button>
              <span className="px-1 md:px-2">{item.quantity}</span>
              <button
                onClick={() => updateQuantity(item.name, item.quantity + 1)}
                className="bg-gray-200 text-gray-600 px-1 py-0.5 rounded-r text-xs md:text-sm"
              >
                <FaPlus />
              </button>
            </div>
          </div>
        ))}
      </div>
      
      <div className="border-t mt-4 pt-4 text-xs md:text-sm">
        <p className="flex justify-between">
          Subtotal <span>{rupiah(subTotal)}</span>
        </p>
        <p className="flex justify-between">
          Pajak <span>{rupiah(pajak)}</span>
        </p>
        <p className="flex justify-between">
          Total <span>{rupiah(total)}</span>
        </p>
      </div>
      
      <div className="border-t mt-4 pt-4 flex flex-col lg:flex-row space-y-2 lg:space-y-0 lg:space-x-3 items-center text-xs md:text-sm">
        <button
          onClick={handlePrint}
          className="bg-blue-500 text-white px-4 py-2 rounded w-full lg:w-1/2"
        >
          Print
        </button>
        <button
          onClick={handlePayment}
          className="bg-blue-500 text-white px-4 py-2 rounded w-full lg:w-1/2"
        >
          Payment
        </button>
      </div>
      
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="mb-4 text-xs md:text-sm">
          <h3 className="text-base md:text-lg mb-2">Select Table:</h3>
          <div className="border-t">
            {tables.map((table, index) => (
              <div
                key={index}
                className={`flex justify-between items-center p-2 cursor-pointer ${selectedTable === table.name ? 'bg-blue-900 text-white' : ''}`}
                onClick={() => handleSelectTable(table.name)}
              >
                <span>{table.name}</span>
                <button onClick={(e) => { e.stopPropagation(); handleDeleteTable(table.name); }} className="text-red-500 text-xs md:text-sm">
                  Delete
                </button>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <input
              type="text"
              value={newTableName}
              onChange={(e) => setNewTableName(e.target.value)}
              className="border p-2 w-full text-xs md:text-sm"
              placeholder="New table name"
            />
            <button
              onClick={handleAddTable}
              className="bg-blue-500 text-white px-4 py-2 rounded mt-2 w-full text-xs md:text-sm"
            >
              Add Table
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default BillSummary;
