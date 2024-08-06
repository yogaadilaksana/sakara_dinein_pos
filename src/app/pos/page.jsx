'use client'
import { useState, useEffect } from 'react';
import Sidebar from '../_components/_pos/Sidebar';
import Header from '../_components/_pos/Header';
import MenuCard from '../_components/_pos/MenuCard';
import BillSummary from '../_components/_pos/BillSummary';
import CustomMenu from '../_components/_pos/CustomMenu';

const Page = () => {
  const [billItems, setBillItems] = useState([]);
  const [isSidebarMinimized, setIsSidebarMinimized] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [tables, setTables] = useState([
    { name: "Meja 1", details: "Details for Meja 1" },
    { name: "Meja 2", details: "Details for Meja 2" },
    { name: "Meja 3", details: "Details for Meja 3" },
  ]);
  const [dataz, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCustomMenu, setShowCustomMenu] = useState(false);

  useEffect(() => {
    fetch('/api/product')
      .then(response => response.json())
      .then(data => {
        setData(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setError('Error fetching data');
        setLoading(false);
      });
  }, []);

  const addToBill = (newItem) => {
    setBillItems((prevItems) => {
      const existingItem = prevItems.find(item => item.name === newItem.name);
      if (existingItem) {
        return prevItems.map(item =>
          item.name === newItem.name
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevItems, { ...newItem, quantity: 1 }];
      }
    });
  };

  const updateQuantity = (itemName, newQuantity) => {
    setBillItems((prevItems) =>
      prevItems.map(item =>
        item.name === itemName ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const toggleSidebar = () => {
    setIsSidebarMinimized(!isSidebarMinimized);
  };

  const addTable = (newTable) => {
    setTables([...tables, newTable]);
  };

  if (loading) {
    return <div>Loading...</div>;
  }
  const products =  dataz.products;

  const filteredMenuItems = products.filter(item => {
    const matchesCategory = selectedCategory ? item.category.name === selectedCategory : true;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="flex bg-gray-200">
      <Sidebar isMinimized={isSidebarMinimized} toggleSidebar={toggleSidebar} setSelectedCategory={setSelectedCategory} />
      <div className={`flex flex-col flex-1 p-4 transition-all duration-300 ${isSidebarMinimized ? 'pl-14' : 'pl-64'}`}>
        <div className="flex flex-col md:flex-row items-center justify-between mb-4">
          <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          <button
            onClick={() => setShowCustomMenu(!showCustomMenu)}
            className="mt-2 md:mt-0 p-2 bg-blue-500 text-white rounded"
          >
            Custom Menu
          </button>
        </div>
        <div className="flex flex-col md:flex-row gap-4 mt-4">
          <div className="flex-1 overflow-hidden"> {/* Added overflow-y-auto and h-full */}
            {showCustomMenu ? (
              <CustomMenu addToBill={addToBill} />
            ) : (
              <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-2 md:gap-2 lg:gap-6`}>
                {filteredMenuItems.map((item, index) => (
                  <MenuCard key={index} image={item.image} name={item.name} price={parseInt(item.price)} addToBill={addToBill} />
                ))}
              </div>
            )}
          </div>
          <div className="w-full md:w-1/4 flex-shrink-1">
            <div className="border p-2 md:p-4 bg-white rounded-lg shadow-md h-auto"> {/* Ensure this container has a height */}
              <BillSummary 
                billItems={billItems} 
                addTable={addTable} 
                updateQuantity={updateQuantity} 
                tables={tables} 
                setTables={setTables} 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
