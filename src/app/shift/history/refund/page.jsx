"use client"

import Sidebar from "@/app/_components/_shift/sidebar";
import RightSidebar from "@/app/_components/_shift/righSidebar";

import { useEffect, useState } from "react";

const Page = () => {
  const [itemsSold, setItemSold]= useState([]);

  useEffect(() => {
    // Fetch shift data when the component mounts
    fetch('/api/shift/historyrefund')
      .then(response => response.json())
      .then(data => {
        console.log("apasih si data", data)
        setItemSold(data.itemsSold);
      })
      .catch(error => console.error("Error fetching shift data:", error));
  }, []); 
  console.log('this is itemsold', itemsSold)
    // const itemsSold = [
    //   { name: 'Sakara Tea', quantity: 2 },
    //   { name: 'Hot Cafe Latte', quantity: 3 },
    //   { name: 'Extrajoss Susu', quantity: 1 },
    //   { name: 'Sakara Tea', quantity: 2 },
    //   { name: 'Hot Cafe Latte', quantity: 3 },
    //   { name: 'Extrajoss Susu', quantity: 1 },
    //   { name: 'Sakara Tea', quantity: 2 },
    //   { name: 'Hot Cafe Latte', quantity: 3 },
    //   { name: 'Extrajoss Susu', quantity: 1 },
    //   { name: 'Sakara Tea', quantity: 2 },
    //   { name: 'Hot Cafe Latte', quantity: 3 },
    //   { name: 'Extrajoss Susu', quantity: 1 },
    //   { name: 'Sakara Tea', quantity: 2 },
    //   { name: 'Hot Cafe Latte', quantity: 3 },
    //   { name: 'Extrajoss Susu', quantity: 1 },
    //   { name: 'Sakara Tea', quantity: 2 },
    //   { name: 'Hot Cafe Latte', quantity: 3 },
    //   { name: 'Extrajoss Susu', quantity: 1 },
    //   { name: 'Sakara Tea', quantity: 2 },
    //   { name: 'Hot Cafe Latte', quantity: 3 },
    // ];
  
    const totalItems = itemsSold.length ? itemsSold.length :0;
  
    return (
      <div className="flex">
        <Sidebar />
        <div className="w-3/6 pr-6 pl-16 bg-zinc-100">
            <RightSidebar />
        </div>
        <div className="w-2/3 p-5">
          <h2 className="text-2xl font-bold mb-5">Items Refund: {totalItems} Items</h2>
          <ul className="list-none mt-3">
            {itemsSold.map((item, index) => (
              <li key={index} className="flex justify-between border-b py-2">
                <span>{item.name}</span>
                <span>{item.quantity}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  };
  
  export default Page;
  