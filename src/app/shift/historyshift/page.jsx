"use client"
import React, { useState, useEffect } from 'react';
import Sidebar from "../../_components/_shift/sidebar";
import RightSidebar from "../../_components/_shift/righSidebar";
import { useRouter } from 'next/navigation';

const Page = () => {
  const router = useRouter();
  const [shiftId, setShiftId] = useState(null);

  const [dataShifts, setDataShifts] = useState([]);
  const [openShifts, setOpenShifts] = useState([]);
  const [closedShifts, setClosedShifts] = useState([]);
  const [shiftData, setShiftData] = useState([]);

  useEffect(() => {
    // Fetch shift data when the component mounts
    fetch('/api/shift/historyshift')
      .then(response => response.json())
      .then(data => {
        setOpenShifts(data.openShifts);
        setClosedShifts(data.closedShifts);
        setShiftData(data.detailedShifts);
        setDataShifts(data);
      })
      .catch(error => console.error("Error fetching shift data:", error));
  }, []); // Empty dependency array ensures this runs only once

  const [formattedOpenShifts, setFormattedOpenShifts] = useState([]);
  const [formattedClosedShifts, setFormattedClosedShifts] = useState([]);

  useEffect(() => {
    // Format dates after the component mounts
    const formatDate = (dateStr) => {
      return new Intl.DateTimeFormat('en-GB', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }).format(new Date(dateStr));
    };

    setFormattedOpenShifts(openShifts.map(shift => ({
      ...shift,
      formattedDate: formatDate(shift.date),
    })));

    setFormattedClosedShifts(closedShifts.map(shift => ({
      ...shift,
      formattedDate: formatDate(shift.date),
    })));
  }, [openShifts, closedShifts]);

  const handleShiftClick = (id) => {
    console.log("Shift ID clicked:", id);
    setShiftId(id);
  };

  const selectedShiftDetails = shiftData.find(shift => shift.id === shiftId);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="w-3/6 pr-6 pl-16 bg-zinc-100">
        <RightSidebar />
      </div>
      <div className="flex-1 p-6">
        {shiftId ? (
          // Show shift details if shiftId is present
          <>
            <div className="flex justify-between items-center mb-6">
              <button onClick={() => window.location.reload()} className="text-blue-500">&lt; Back</button>
              <h2 className="text-2xl font-bold">Shift Details</h2>
            </div>
            <button className="mb-6 px-4 py-2 border rounded border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white">Print Shift Report</button>
            {selectedShiftDetails && (
              <div className="bg-white p-4 rounded shadow mb-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="border-b pb-2"><strong>Name</strong></div>
                  <div className="border-b pb-2">{selectedShiftDetails.name}</div>
                  <div className="border-b pb-2"><strong>Outlet</strong></div>
                  <div className="border-b pb-2">{selectedShiftDetails.outlet}</div>
                  <div className="border-b pb-2"><strong>Starting Shift</strong></div>
                  <div className="border-b pb-2">{selectedShiftDetails.startingShift}</div>
                  <div className="border-b pb-2"><strong>Items Sold</strong></div>
                  <div className="border-b pb-2">{selectedShiftDetails.itemsSold} &gt;</div>
                  <div className="border-b pb-2"><strong>Items Returned</strong></div>
                  <div className="border-b pb-2">{selectedShiftDetails.itemsReturned} &gt;</div>
                </div>
              </div>
            )}
            {selectedShiftDetails && (
              <>
                <h3 className="text-xl font-bold mb-2">Cash</h3>
                <div className="bg-white p-4 rounded shadow mb-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="border-b pb-2"><strong>Starting Cash</strong></div>
                    <div className="border-b pb-2">{selectedShiftDetails.cash.startingCash}</div>
                    <div className="border-b pb-2"><strong>Cash Sales</strong></div>
                    <div className="border-b pb-2">{selectedShiftDetails.cash.cashSales}</div>
                    <div className="border-b pb-2"><strong>Cash From Invoice</strong></div>
                    <div className="border-b pb-2">{selectedShiftDetails.cash.cashFromInvoice}</div>
                    <div className="border-b pb-2"><strong>Cash Refunds</strong></div>
                    <div className="border-b pb-2">{selectedShiftDetails.cash.cashRefunds}</div>
                    <div className="border-b pb-2"><strong>Expense Income</strong></div>
                    <div className="border-b pb-2">{selectedShiftDetails.cash.expenseIncome}</div>
                    <div className="border-b pb-2"><strong>Expected Ending Cash</strong></div>
                    <div className="border-b pb-2">{selectedShiftDetails.cash.expectedEndingCash}</div>
                  </div>
                </div>
              </>
            )}
          </>
        ) : (
          // Show shift lists if no shiftId is present
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Shift History</h2>
              <button className="px-4 py-2 border rounded border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white">Export</button>
            </div>
            <div className="mb-6">
              <h3 className="text-xl font-bold mb-2">Open Shifts</h3>
              {formattedOpenShifts.map(shift => (
                <div key={shift.id} className="bg-white p-4 rounded shadow mb-4">
                  <button onClick={() => handleShiftClick(shift.id)} className="flex justify-between cursor-pointer">
                    <span>{`${shift.formattedDate} at ${shift.time}`}</span>
                  </button>
                </div>
              ))}
            </div>
            <div className="mb-6">
              <h3 className="text-xl font-bold mb-2">Closed Shifts</h3>
              {formattedClosedShifts.map(shift => (
                <div key={shift.id} className="bg-white p-4 rounded shadow mb-4">
                  <button onClick={() => handleShiftClick(shift.id)} className="flex justify-between cursor-pointer">
                    <span>{`${shift.formattedDate} at ${shift.time}`}</span>
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Page;
