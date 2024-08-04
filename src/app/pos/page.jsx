'use client'
import { useState } from 'react';
import Sidebar from '../_components/_pos/Sidebar';
import Header from '../_components/_pos/Header';
import MenuCard from '../_components/_pos/MenuCard';
import BillSummary from '../_components/_pos/BillSummary';

const Page = () => {
  const [billItems, setBillItems] = useState([]);
  const [isSidebarMinimized, setIsSidebarMinimized] = useState(false);
  const [tables, setTables] = useState([
    { name: "Meja 1", details: "Details for Meja 1" },
    { name: "Meja 2", details: "Details for Meja 2" },
    { name: "Meja 3", details: "Details for Meja 3" },
  ]);

  const addToBill = (newItem) => {
    setBillItems((prevItems) => {
      const existingItem = prevItems.find(item => item.name === newItem.name);
      if (existingItem) {
        return prevItems.map(item =>
          item.name === newItem.name
            ? { ...item, quantity: newItem.quantity }
            : item
        );
      } else {
        return [...prevItems, newItem];
      }
    });
  };

  const toggleSidebar = () => {
    setIsSidebarMinimized(!isSidebarMinimized);
  };

  const addTable = (newTable) => {
    setTables([...tables, newTable]);
  };

  const menuItems = [
    { image: "/vanilla_latte.jpg", name: "Vanilla Latte", price: 23000 },
    { image: "/hazelnut_latte.jpg", name: "Hazelnut Latte", price: 23000 },
    { image: "/caramel_latte.jpg", name: "Caramel Latte", price: 23000 },
    { image: "/americano.jpg", name: "Americano", price: 23000 },
    { image: "/cappucino.jpg", name: "Cappucino", price: 23000 },
    { image: "/rum_latte.jpg", name: "Rum Latte", price: 23000 },
  ];

  return (
    <div className="flex h-screen">
      <Sidebar isMinimized={isSidebarMinimized} toggleSidebar={toggleSidebar} />
      <div className="flex flex-col w-full p-4">
        <Header />
        <div className="flex mt-4">
          <div className={`grid grid-cols-3 gap-4 ${isSidebarMinimized ? 'w-full' : 'w-3/4'}`}>
            {menuItems.map((item, index) => (
              <MenuCard key={index} image={item.image} name={item.name} price={item.price} addToBill={addToBill} />
            ))}
          </div>
          <BillSummary billItems={billItems} addTable={addTable} />
        </div>
      </div>
    </div>
  );
};

export default Page;
