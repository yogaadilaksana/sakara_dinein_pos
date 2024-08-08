'use client'
import { useState } from 'react';
import Head from 'next/head';

export default function Page() {
  const [menuName, setMenuName] = useState('');
  const [inputValue, setInputValue] = useState('');

  const handleButtonClick = (value) => {
    setInputValue((prev) => prev + value);
  };

  const handleDelete = () => {
    setInputValue((prev) => prev.slice(0, -1));
  };

  const handleClear = () => {
    setInputValue('');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <Head>
        <title>POS System</title>
        <meta name="description" content="POS System Interface" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="w-1/6 bg-blue-900 text-white flex flex-col items-center py-4">
        <div className="flex flex-col items-center w-full mb-8">
          <input
            type="text"
            placeholder="Cari Menu"
            className="w-full p-2 rounded border border-gray-300"
          />
        </div>
        <div className="flex flex-col items-start w-full px-4">
          {['Pastry', 'Beverage', 'Meal', 'Coffee', 'Snack'].map((category) => (
            <button key={category} className="py-2 w-full text-left">
              {category}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-grow p-4">
        <div className="flex justify-between items-center mb-4">
          <input
            type="text"
            value={menuName}
            onChange={(e) => setMenuName(e.target.value)}
            placeholder="Nama Menu"
            className="w-1/2 p-2 rounded border border-gray-300"
          />
          <button className="bg-slate-500 text-white py-2 px-4 rounded">Custom Menu</button>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white rounded p-4 col-span-2">
            <input
              type="text"
              value={inputValue}
              placeholder="Input Angka"
              readOnly
              className="w-full p-2 mb-4 rounded border border-gray-300 text-center text-2xl"
            />
            <div className="grid grid-cols-4 gap-4">
              {[1, 2, 3, '+', 4, 5, 6, "x",7, 8, 9, 'DEL', 0, '00'].map((btn) => (
                <button
                  key={btn}
                  onClick={() => {
                    if (btn === 'DEL') handleDelete();
                    else if (btn === 'x') handleClear();
                    else handleButtonClick(btn.toString());
                  }}
                  className={`py-4 text-2xl ${
                    btn ? 'bg-gray-200' : ''
                  } rounded flex items-center justify-center`}
                >
                  {btn}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-4 space-x-4">
          <button className="bg-blue-500 text-white py-2 px-4 rounded">Input</button>
          <button className="bg-blue-500 text-white py-2 px-4 rounded">Print Bills</button>
          <button className="bg-blue-500 text-white py-2 px-4 rounded">Payment</button>
        </div>
      </div>
    </div>
  );
}
