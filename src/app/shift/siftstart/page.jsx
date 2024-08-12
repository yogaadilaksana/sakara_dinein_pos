"use client"

import { useEffect, useState } from "react";
import Sidebar from "../../_components/_shift/sidebar";
import RightSidebar from "../../_components/_shift/righSidebar";
import Image from "next/image";
import cashierIcon from "@/../../public/shift/cash-register.png";

const Page = () => {
  const [data, setData] = useState({});
  const [error, setError] = useState(null);
  const [currentShift, setCurrentShift] =useState(null);

  useEffect(() => {
    fetch('/api/currentshift')
      .then(response => response.json())
      .then(data => {
        if (data.error) {
          setError(data.error); // Capture the error message
        } else {
          setData(data); // Set data if no error
        }
      })
      .catch(error => setError('An unexpected error occurred.'));
  }, []);

  // useEffect(() => {
  //   // Fetch shift data when the component mounts
  //   fetch('/api/shift/historyshift')
  //     .then(response => response.json())
  //     .then(data => {
  //       // if (data.openShifts && data.closedShifts) {
  //       //   setOpenShifts(data.openShifts);
  //       //   setClosedShifts(data.closedShifts);
  //       // }
  //       setCurrentShift(data);
  //     })
  //     .catch(error => console.error("Error fetching shift data:", error));
  // }, []);


  console.log("this is shiftData", currentShift)
  // Render error message if present
  if (error) {
    return (
      <div className="w-3/4 p-5">
        <h2 className="text-2xl font-bold mb-5">Error</h2>
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

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
        <p className={data.expenseIncome < 0 ? "text-red-500" : "text-green-500"}>
          {data.expenseIncome < 0 ? `-Rp.${Math.abs(data.expenseIncome)}` : `Rp.${data.expenseIncome}`}
        </p>
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
        <p>Starting Cash: Rp.{data.startingCash}</p>
        <p>Cash Sales: Rp.{data.cashSales}</p>
      </div>
    </div>
  );
}

export default Page;
