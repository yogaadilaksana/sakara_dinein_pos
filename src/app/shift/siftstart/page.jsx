"use client"

import { useEffect, useState } from "react";
import Sidebar from "../../_components/_shift/sidebar";
import RightSidebar from "../../_components/_shift/righSidebar";
import Image from "next/image";
import cashierIcon from "@/../../public/shift/cash-register.png"
// components/ShiftManagement.js

// const Page = () => {
//     const shiftData = {
//       name: "Ari Pratama",
//       outlet: "Sakara Kopi Bali Antasura",
//       startingShift: "Friday, 3rd of September 2024 at 11.30",
//       expenseIncome: -11000,
//       itemsSold: 6,
//       itemsReturned: 2,
//       startingCash: 300000,
//       cashSales: 638000,
//     };
  
//     return (
//       <div className="flex h-screen bg-gray-100">
//         <Sidebar />
//         <div className="w-3/6 pr-6 pl-16 bg-zinc-100">
//           <RightSidebar />
//         </div>
//         <div className="w-3/4 p-4">
//           <div className=" items-center mb-4">
//             <div className="text-lg font-bold">Current Shift</div>
//             <button className="bg-blue-500 text-white px-4 py-2 rounded-lg">End Shift</button>
//           </div>
//           <div className="bg-white p-4 rounded-lg shadow">
//             <div className="grid grid-cols-2 gap-4 mb-4">
//               <div className="font-semibold">Name</div>
//               <div>{shiftData.name}</div>
//               <div className="font-semibold">Outlet</div>
//               <div>{shiftData.outlet}</div>
//               <div className="font-semibold">Starting Shift</div>
//               <div>{shiftData.startingShift}</div>
//               <div className="font-semibold">Expense/Income</div>
//               <div className={shiftData.expenseIncome < 0 ? "text-red-500" : "text-green-500"}>
//                 {shiftData.expenseIncome < 0 ? `-Rp.${Math.abs(shiftData.expenseIncome)}` : `Rp.${shiftData.expenseIncome}`}
//               </div>
//               <div className="font-semibold">Items Sold</div>
//               <div>{shiftData.itemsSold}</div>
//               <div className="font-semibold">Items Returned</div>
//               <div>{shiftData.itemsReturned}</div>
//             </div>
//             <div className="bg-gray-100 p-4 rounded-lg">
//               <div className="text-lg font-bold mb-2">Cash</div>
//               <div className="grid grid-cols-2 gap-4">
//                 <div className="font-semibold">Starting Cash</div>
//                 <div>Rp.{shiftData.startingCash}</div>
//                 <div className="font-semibold">Cash Sales</div>
//                 <div>Rp.{shiftData.cashSales}</div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   };
  
const Page = () => {
  const [data, setData] = useState({});

  useEffect(() => {
    fetch('/api/currentshift')
      .then(response => response.json())
      .then(data => setData(data));
  }, []);

  return (
    <div className="w-3/4 p-5">
      <h2 className="text-2xl font-bold mb-5">Current Shift</h2>
      <button className="mb-5 px-4 py-2 bg-blue-500 text-white rounded">End Shift</button>
      <div className="mb-5">
        <h3 className="text-xl font-medium mb-2">Name</h3>
        <p>{data.name}</p>
      </div>
      <div className="mb-5">
        <h3 className="text-xl font-medium mb-2">Outlet</h3>
        <p>{data.outlet}</p>
      </div>
      <div className="mb-5">
        <h3 className="text-xl font-medium mb-2">Starting Shift</h3>
        <p>{data.startingShift}</p>
      </div>
      <div className="mb-5">
        <h3 className="text-xl font-medium mb-2">Expense/Income</h3>
        <p className="text-red-500">{data.expenseIncome}</p>
      </div>
      <div className="mb-5">
        <h3 className="text-xl font-medium mb-2">Items Sold</h3>
        <p>{data.itemsSold}</p>
      </div>
      <div className="mb-5">
        <h3 className="text-xl font-medium mb-2">Items Returned</h3>
        <p>{data.itemsReturned}</p>
      </div>
      <div className="mb-5">
        <h3 className="text-xl font-medium mb-2">Cash</h3>
        <p>Starting Cash: {data.startingCash}</p>
        <p>Cash Sales: {data.cashSales}</p>
      </div>
    </div>
  );
}

  export default Page;
  