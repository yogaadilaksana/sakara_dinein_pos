// components/Sidebar.js
import React from 'react';
import { HomeIcon, CurrencyDollarIcon, ClockIcon, ClipboardDocumentListIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';

const Sidebar = () => {
  return (
    <aside className="w-16 h-screen bg-gray-100 text-black flex flex-col items-center py-8 space-y-9 fixed top-20 left-0">
    <a href="/shift" className="flex flex-col items-center hover:bg-gray-700 p-2 rounded">
      <HomeIcon className="h-6 w-6 text-black" />
      <span className="text-xs mt-1">Home</span>
    </a>
    <a href="/shift/historyshift" className="flex flex-col items-center hover:bg-gray-700 p-2 rounded">
      <CurrencyDollarIcon className="h-6 w-6 text-black" />
      <span className="text-xs mt-1">Shift</span>
    </a>
    <a href="/shift/history" className="flex flex-col items-center hover:bg-gray-700 p-2 rounded">
      <ClockIcon className="h-6 w-6 text-black" />
      <span className="text-xs mt-1">History Penjualan</span>
    </a>
    <a href="/shift/history/refund" className="flex flex-col items-center hover:bg-gray-700 p-2 rounded">
      <ClockIcon className="h-6 w-6 text-black" />
      <span className="text-xs mt-1">History Refund</span>
    </a>
    <a href="/shift/transactional" className="flex flex-col items-center hover:bg-gray-700 p-2 rounded">
      <ClipboardDocumentListIcon className="h-6 w-6 text-black" />
      <span className="text-xs mt-1">Reports</span>
    </a>
    <a href="#" className="flex flex-col items-center hover:bg-gray-700 p-2 rounded">
      <Cog6ToothIcon className="h-6 w-6 text-black" />
      <span className="text-xs mt-1">Settings</span>
    </a>
  </aside>
    
  );
};

export default Sidebar;
