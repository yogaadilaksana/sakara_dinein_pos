// src/pages/index.js

"use client"; // Menandai file ini sebagai Client Component

import React from 'react';
import PrintInvoice from '../components/PrintInvoice';

const invoiceData = {
  number: '12345',
  date: '2024-07-23',
  items: [
    { name: 'Item 1', quantity: 2, price: '10.00' },
    { name: 'Item 2', quantity: 1, price: '20.00' }
  ],
  total: '40.00'
};

const Home = () => {
  return (
    <div>
      <h1>Invoice Printing Example</h1>
      <PrintInvoice invoiceData={invoiceData} />
    </div>
  );
};

export default Home;
