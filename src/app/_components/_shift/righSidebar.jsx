"use client"
import React, { useState } from 'react';
import Image from "next/image";
import cashierIcon from "@/../../public/shift/cash-register.png";

const Sidebar = () => {
  const [activeItem, setActiveItem] = useState('currentShift');

  const handleItemClick = (item) => {
    setActiveItem(item);
  };

  return (
    <aside className="w-10/12 h-screen bg-zinc-200 shadow-md">
      <div className="p-6 text-center border-b border-gray-200">
        <Image
          src={cashierIcon}
          alt="Mesin Kasir"
          className="mx-auto mb-4"
        />
        <h2 className="text-xl font-bold">Manajemen Shift</h2>
      </div>
      <nav className="mt-4">
        <ul>
          <li className={`border-l-4 ${activeItem === 'currentShift' ? 'border-slate-500 bg-slate-500' : 'border-transparent'} bg-gray-100`}>
            <a
              href="/shift"
              className={`block px-4 py-2 font-medium ${activeItem === 'currentShift' ? 'text-white' : 'text-gray-700'} hover:bg-gray-500`}
              onClick={() => handleItemClick('currentShift')}
            >
              Shift Saat Ini
            </a>
          </li>
          <li className={`border-l-4 ${activeItem === 'shiftHistory' ? 'border-slate-500 bg-slate-500' : 'border-transparent'} bg-gray-100`}>
            <a
              href="/shift/historyshift"
              className={`block px-4 py-2 ${activeItem === 'shiftHistory' ? 'text-white' : 'text-gray-700'} hover:bg-gray-500`}
              onClick={() => handleItemClick('shiftHistory')}
            >
              Riwayat Shift
            </a>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
