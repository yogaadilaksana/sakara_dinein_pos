import React from 'react';

const PrintInvoice = ({ invoiceData }) => {
  const connectToPrinter = async () => {
    try {
      const device = await navigator.bluetooth.requestDevice({
        acceptAllDevices: true,
        optionalServices: ['49535343-fe7d-4ae5-8fa9-9fafd205e455'] // UUID layanan dari gambar
      });

      const server = await device.gatt.connect();
      const service = await server.getPrimaryService('49535343-fe7d-4ae5-8fa9-9fafd205e455'); // UUID layanan dari gambar
      const characteristic = await service.getCharacteristic('49535343-8841-43f4-a8d4-ecbe34729bb3'); // UUID karakteristik yang mendukung Write without Response

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
      Item 1: Rp 10,000
      Item 2: Rp 20,000
      Item 3: Rp 30,000
      --------------------
      Total: Rp 60,000
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
      console.log('Data sent to printer');
    } catch (error) {
      console.error('Failed to print:', error);
    }
  };

  return (
    <div>
      <h1>Print Struk Belanja</h1>
      <button onClick={handlePrint}>Print</button>
    </div>
  );
};

export default PrintInvoice;
