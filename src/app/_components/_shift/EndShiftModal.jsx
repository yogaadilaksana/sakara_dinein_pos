// components/ShiftManagement.js

const ShiftManagement = () => {
    const shiftData = {
      name: "Ari Pratama",
      outlet: "Sakara Kopi Bali Antasura",
      startingShift: "Friday, 3rd of September 2024 at 11.30",
      expenseIncome: -11000,
      itemsSold: 6,
      itemsReturned: 2,
      startingCash: 300000,
      cashSales: 638000,
    };
  
    return (
      <div className="flex">
        <div className="w-1/4 p-4">
          <div className="text-lg font-bold mb-4">Shift Management</div>
          <div className="mb-4">
            <div className="bg-gray-100 p-4 rounded-lg">
              <img
                src="/cash-register.png"
                alt="Cash Register"
                className="w-16 h-16 mb-4"
              />
              <div className="text-sm font-semibold">Current Shift</div>
            </div>
          </div>
          <div>
            <div className="text-sm">Shift History</div>
          </div>
        </div>
        <div className="w-3/4 p-4">
          <div className="flex justify-between items-center mb-4">
            <div className="text-lg font-bold">Current Shift</div>
            <button className="bg-blue-500 text-white px-4 py-2 rounded-lg">End Shift</button>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="font-semibold">Name</div>
              <div>{shiftData.name}</div>
              <div className="font-semibold">Outlet</div>
              <div>{shiftData.outlet}</div>
              <div className="font-semibold">Starting Shift</div>
              <div>{shiftData.startingShift}</div>
              <div className="font-semibold">Expense/Income</div>
              <div className={shiftData.expenseIncome < 0 ? "text-red-500" : "text-green-500"}>
                {shiftData.expenseIncome < 0 ? `-Rp.${Math.abs(shiftData.expenseIncome)}` : `Rp.${shiftData.expenseIncome}`}
              </div>
              <div className="font-semibold">Items Sold</div>
              <div>{shiftData.itemsSold}</div>
              <div className="font-semibold">Items Returned</div>
              <div>{shiftData.itemsReturned}</div>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg">
              <div className="text-lg font-bold mb-2">Cash</div>
              <div className="grid grid-cols-2 gap-4">
                <div className="font-semibold">Starting Cash</div>
                <div>Rp.{shiftData.startingCash}</div>
                <div className="font-semibold">Cash Sales</div>
                <div>Rp.{shiftData.cashSales}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default ShiftManagement;
  