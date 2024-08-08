import { useState } from 'react';
import { FaPlus, FaMinus, FaTable } from 'react-icons/fa';
import Modal from './Modal';
import PaymentModal from './PaymentModal';

const BillSummary = ({
  billItems,
  addTable,
  updateQuantity,
  tables,
  setTables,
  selectedPaymentMethod,
  setSelectedPaymentMethod,
  updateBillItems
}) => {
  const [isTableModalOpen, setIsTableModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [newTableName, setNewTableName] = useState('');
  const [selectedTable, setSelectedTable] = useState('');
  const [paymentMethod, setPaymentMethod] = useState(null);

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
    const updatedBillItems = billItems.map(item => ({
      ...item,
      table: [{ name: tableName, details: 'Details here' }] // Assuming `table` is an array
    }));
    updateBillItems(updatedBillItems);
    setSelectedTable(tableName);
  };

  const subTotal = billItems.reduce((total, item) => total + item.price * item.quantity, 0);
  const pajak = subTotal * 0.1;
  const total = subTotal + pajak;
  
  const updatePaymentMethod = async (method) => {
    setPaymentMethod(method)
    const updatedBillItems = billItems.map(item => ({
      ...item,
      paymentMethod: method,
      total: total,
      subTotal: subTotal
    }));

    setSelectedPaymentMethod(method);
    updateBillItems(updatedBillItems);
    // Format data
    const formattedData = {
      tableNumber: selectedTable.match(/\d+/)?.[0],
      type:'CASHIER', // Extract table number as string
      paymentMethod: method,
      items: updatedBillItems.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price.toString(),
        quantity: item.quantity
      })),
    };

    console.log("formatter data", formattedData)
    // Post data to API
    try {
      const response = await fetch('/api/order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formattedData)
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.json();
      
      // Clear bill items after successful post
      updateBillItems([]);
      setIsPaymentModalOpen(false); // Close payment modal after successful payment
    } catch (error) {
      console.error('Error:', error);
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

  const handlePayment = () => {
    setIsPaymentModalOpen(true);
  };

  return (
    <div className="border p-4 w-full border-gray-300 bg-white rounded-2xl overflow-y-auto">
      <div className="flex flex-col md:flex-row justify-between items-start mb-4">
        <h2 className="text-base md:text-lg">Bills Summary</h2>
        <div className="flex items-center space-x-2 md:space-x-4">
          <span className="text-xs md:text-sm">{selectedTable}</span>
          <button onClick={() => setIsTableModalOpen(true)} className="text-blue-500 text-xs md:text-sm">
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
                className="bg-slate-500 text-white px-1 py-0.5 rounded-l text-xs md:text-sm"
                disabled={item.quantity === 1}
              >
                <FaMinus />
              </button>
              <span className="px-1 md:px-2">{item.quantity}</span>
              <button
                onClick={() => updateQuantity(item.name, item.quantity + 1)}
                className="bg-slate-500 text-white px-1 py-0.5 rounded-r text-xs md:text-sm"
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
        <p className="flex justify-between font-semibold">
          Total <span>{rupiah(total)}</span>
        </p>
      </div>
      
      <div className="flex justify-end mt-4 space-x-3">
        <button onClick={handlePrint} className="bg-slate-500 text-white px-4 py-2 rounded">Print Bills</button>
        <button onClick={handlePayment} className="bg-slate-500 text-white px-4 py-2 rounded">Payment</button>
      </div>
      
      <Modal isOpen={isTableModalOpen} onClose={() => setIsTableModalOpen(false)}>
        <div className="p-4 w-full">
          <h3 className="text-lg font-semibold mb-4">Manage Tables</h3>
          <div className="mb-4">
            <label htmlFor="newTableName" className="block text-sm font-medium text-gray-700">
              Table Name
            </label>
            <input
              id="newTableName"
              value={newTableName}
              onChange={(e) => setNewTableName(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <button onClick={handleAddTable} className="bg-blue-500 text-white px-4 py-2 rounded mb-4">Add Table</button>
          <ul className="space-y-2">
            {tables.map((table) => (
              <li key={table.name} className="flex justify-between items-center p-2 border border-gray-300 rounded">
                <span>{table.name}</span>
                <div className="flex space-x-2">
                  <button onClick={() => handleSelectTable(table.name)} className="bg-gray-300 text-gray-700 px-4 py-2 rounded">Select</button>
                  <button onClick={() => handleDeleteTable(table.name)} className="bg-red-500 text-white px-4 py-2 rounded">Delete</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </Modal>

      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        setSelectedPaymentMethod={updatePaymentMethod}
        totalPayment={rupiah(total)}
      />
    </div>
  );
};

export default BillSummary;
