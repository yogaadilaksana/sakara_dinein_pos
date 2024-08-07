"use client"
// import { useRouter } from 'next/router';
import Sidebar from "@/app/_components/_shift/sidebar";
import RightSidebar from "@/app/_components/_shift/righSidebar";

const Page = () => {
  // Data dummy untuk demonstrasi
  const [dataShifts, setDataShifts] = useState(null)
  useEffect(() => {
    // Fetch shift data when the component mounts
    fetch('/api/shift/historyshift')
      .then(response => response.json())
      .then(data => {
        // if (data.openShifts && data.closedShifts) {
        //   setOpenShifts(data.openShifts);
        //   setClosedShifts(data.closedShifts);
        // }
        setDataShifts(data);
      })
      .catch(error => console.error("Error fetching shift data:", error));
  }, []); // Empty dependency array ensures this runs only once

  const shiftData = {
    name: 'Ari Pratama',
    outlet: 'Sakara Kopi Bali Antasura',
    startingShift: 'Friday, 3rd of September 2024 at 8.00',
    itemsSold: 6,
    itemsReturned: 2,
    cash: {
      startingCash: 'Rp.300.000',
      cashSales: 'Rp.638.000',
      cashFromInvoice: 'Rp.188.000',
      cashRefunds: 'Rp.0',
      expenseIncome: '-Rp.11.000',
      expectedEndingCash: 'Rp.1.099.000',
    },
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
        <div className="w-3/6 pr-6 pl-16 bg-zinc-100">
            <RightSidebar />
        </div>
      <div className="flex-1 p-6">
        <div className="flex justify-between items-center mb-6">
          <button onClick={() => router.back()} className="text-blue-500">&lt; Back</button>
          <h2 className="text-2xl font-bold">Shift Details</h2>
        </div>
        <button className="mb-6 px-4 py-2 border rounded border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white">Print Shift Report</button>
        <div className="bg-white p-4 rounded shadow mb-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="border-b pb-2"><strong>Name</strong></div>
            <div className="border-b pb-2">{shiftData.name}</div>
            <div className="border-b pb-2"><strong>Outlet</strong></div>
            <div className="border-b pb-2">{shiftData.outlet}</div>
            <div className="border-b pb-2"><strong>Starting Shift</strong></div>
            <div className="border-b pb-2">{shiftData.startingShift}</div>
            <div className="border-b pb-2"><strong>Items Sold</strong></div>
            <div className="border-b pb-2">{shiftData.itemsSold} &gt;</div>
            <div className="border-b pb-2"><strong>Items Returned</strong></div>
            <div className="border-b pb-2">{shiftData.itemsReturned} &gt;</div>
          </div>
        </div>
        <h3 className="text-xl font-bold mb-2">Cash</h3>
        <div className="bg-white p-4 rounded shadow mb-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="border-b pb-2"><strong>Starting Cash</strong></div>
            <div className="border-b pb-2">{shiftData.cash.startingCash}</div>
            <div className="border-b pb-2"><strong>Cash Sales</strong></div>
            <div className="border-b pb-2">{shiftData.cash.cashSales}</div>
            <div className="border-b pb-2"><strong>Cash From Invoice</strong></div>
            <div className="border-b pb-2">{shiftData.cash.cashFromInvoice}</div>
            <div className="border-b pb-2"><strong>Cash Refunds</strong></div>
            <div className="border-b pb-2">{shiftData.cash.cashRefunds}</div>
            <div className="border-b pb-2"><strong>Expense/Income</strong></div>
            <div className="border-b pb-2 text-red-500">{shiftData.cash.expenseIncome}</div>
            <div className="border-b pb-2"><strong>Expected Ending Cash</strong></div>
            <div className="border-b pb-2">{shiftData.cash.expectedEndingCash}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
