'use client';
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
  const [tables, setTables] = useState([]);
  const [dataz, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCustomMenu, setShowCustomMenu] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);

  console.log('this is item', billItems);

  useEffect(() => {
    fetch('/api/product')
      .then((response) => response.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setError('Error fetching data');
        setLoading(false);
      });
  }, []);

  const addToBill = (newItem) => {
    setBillItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.name === newItem.name);
      if (existingItem) {
        return prevItems.map((item) =>
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
      prevItems.map((item) =>
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
  

  const updateBillItems = async (updatedItems) => {
    console.log('updated bill items', updatedItems)
    setBillItems(updatedItems);

    //sebelum post kita mapping data supaya sesuai dengan req order api

// Format data
    const formattedData = {
      tableNumber: '1',
      items: billItems.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price.toString(),
        quantity: item.quantity
      }))
    };
    // const formattedData = {
    //   tableNumber: '1',
    //   items: billItems.map(item => ({
    //     id: item.id,
    //     name: item.name,
    //     price: item.price.toString(), // Mengubah harga ke string
    //     quantity: item.quantity
    //   }))
    // };




    //lakukan post ke api order untuk order item by cashier

    // try {
    //   const response = await fetch('/api/order', {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({
    //       tableNumber: 
    //     }),
    //   });
      
    //   if (!response.ok) {
    //     throw new Error('Network response was not ok');
    //   }
      
    //   const result = await response.json();
    //   console.log('Order successful:', result);
    //   // Tangani hasil setelah berhasil melakukan order
    // } catch (error) {
    //   console.error('Error:', error);
    //   // Tangani error
    // }

  };

  if (loading) {
    return <div>Loading...</div>;
  }

  const products = dataz.products;

  const filteredMenuItems = products.filter((item) => {
    const matchesCategory = selectedCategory
      ? item.category.name === selectedCategory
      : true;
    const matchesSearch = item.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="flex bg-gray-200 min-h-screen">
      <Sidebar
        isMinimized={isSidebarMinimized}
        toggleSidebar={toggleSidebar}
        setSelectedCategory={setSelectedCategory}
      />
      <div
        className={`flex flex-col flex-1 p-4 transition-all duration-300 ${isSidebarMinimized ? 'pl-6' : 'pl-64'}`}
      >
        <div className="flex flex-col md:flex-row items-center justify-between">
          <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          <button
            onClick={() => setShowCustomMenu(!showCustomMenu)}
            className="mt-2 md:mt-0 p-2 bg-blue-500 text-white rounded"
          >
            Custom Menu
          </button>
        </div>
        <div className="flex flex-col md:flex-row gap-4 mt-4">
          <div className="flex-1 overflow-y-auto max-h-screen">
            {showCustomMenu ? (
              <CustomMenu addToBill={addToBill} />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredMenuItems.map((item, index) => (
                  <MenuCard
                    key={index}
                    id={item.id}
                    image={item.image}
                    name={item.name}
                    price={parseInt(item.price)}
                    addToBill={addToBill}
                  />
                ))}
              </div>
            )}
          </div>
          <div className="w-full md:w-1/3 lg:w-1/4">
            <div className="border p-4 bg-white rounded-lg shadow-md h-full">
              <BillSummary
                billItems={billItems}
                addTable={addTable}
                updateQuantity={updateQuantity}
                tables={tables}
                setTables={setTables}
                setSelectedPaymentMethod={setSelectedPaymentMethod}
                updateBillItems={updateBillItems}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
