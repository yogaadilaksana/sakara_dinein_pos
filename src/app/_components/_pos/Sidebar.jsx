import { useState } from 'react';
import { FaBars } from 'react-icons/fa'; // Icon untuk tombol minimize

const Sidebar = ({ isMinimized, toggleSidebar }) => {
  return (
    <div className={`bg-blue-900 text-white ${isMinimized ? 'w-20' : 'w-1/5'} p-4 transition-all duration-300`}>
      <button onClick={toggleSidebar} className="text-white mb-4">
        <FaBars />
      </button>
      <div className="flex flex-col space-y-4">
        <div className={`${isMinimized ? 'hidden' : 'block'}`}>Pastry</div>
        <div className={`${isMinimized ? 'hidden' : 'block'}`}>Beverage</div>
        <div className={`${isMinimized ? 'hidden' : 'block'}`}>Meal</div>
        <div className={`${isMinimized ? 'hidden' : 'block'}`}>Coffee</div>
        <div className={`${isMinimized ? 'hidden' : 'block'}`}>Snack</div>
      </div>
    </div>
  );
};

export default Sidebar;
