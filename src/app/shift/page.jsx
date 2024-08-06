"use client";

import { useState, useEffect } from "react";
import Sidebar from "../_components/_shift/sidebar";
import RightSidebar from "../_components/_shift/righSidebar";
import { format, formatDistanceToNow, parseISO } from 'date-fns';
import { enUS } from 'date-fns/locale';

const Page = () => {
  const [isIncome, setIsIncome] = useState(true);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [shiftStarted, setShiftStarted] = useState(false);
  const [memberData, setMemberData] = useState([]);
  const [userData, setUserData] = useState([]);
  const [tableContent, setTableContent] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [endingCash, setEndingCash] = useState("");
  const [startingCashInput, setStartingCashInput] = useState(""); // State baru untuk menyimpan input starting cash
  const [userId, setUserId] = useState(2); //dummy
  const [outlet, setoutlet] = useState("Sakara Coffe Bali Antasura")
  const [confirmEnd, setConfirmEnd] = useState(false);
  const [productTerjual, setProductTerjual] = useState(null)
  const [productRefund, setProductRefund] = useState(null);
  const [dated, setDated] = useState(new Date().toISOString()); // Misalnya inisialisasi date
  const [expansi, setExpansi] = useState(null)

  //fungsi untuk formating nominal rupiah
  const formatRupiah = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(amount);
  };
  //end fungsi
  const date = new Date(Date.now())

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(`/api/shift?userId=${encodeURIComponent(userId)}`);
        if (response.ok) {
          const data = await response.json();
          setMemberData(data.shifts);
          setUserData(data.member);
        } else {
          console.error("Failed to fetch data:", await response.text());
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, [userId]);

  useEffect(()=>{
    fetch(`/api/product/terjual?start=${encodeURIComponent(dated)}&end=${encodeURIComponent(dated)}`)
      .then(response => response.json())
      .then(data => setProductTerjual(data));
  }, [dated]);

  useEffect(()=>{
    fetch(`/api/product/refund?start=${encodeURIComponent(dated)}&end=${encodeURIComponent(dated)}`)
      .then(response => response.json())
      .then(data => setProductRefund(data));
  }, [dated]);

  //expanse income
  useEffect(() => {
    fetch('/api/expanse')
      .then(response => response.json())
      .then(data => setExpansi(data));
  }, []);

  useEffect(() => {
  }, [memberData]);

  const handleSubmit = async () => {
    const newTransaction = { description, amount: isIncome ? +amount : -amount };
    const response = await fetch("/api/shift/transaction", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newTransaction)
    });
    const data = await response.json();
    setTransactions([...transactions, data]);
    setDescription("");
    setAmount("");
  };

  const total = transactions.reduce((acc, transaction) => acc + transaction.amount, 0);

  const handleStartShift = async () => {
    const payload = { userId: userId, startingCash: startingCashInput };
    const response = await fetch("/api/shift", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    if (response.ok) {
      const data = await response.json();
      setMemberData(data);
      setShiftStarted(true);
    } 
  };

  const handleEndShift = async () => {

    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setConfirmEnd(false);
  };

  const handleModalSubmit = async () => {
    const response = await fetch("/api/shift", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: userId, end_time: date, endingCash: parseFloat(endingCash) })
    });
    if (response.ok) {
      setShowModal(false);
      // setShiftStarted(false);
      setConfirmEnd(true);
      // handleModalClose()

    } else {
      console.error("Failed to end shift:", await response.text());
    }
    
  };

  if (!shiftStarted) {
    return (
      <div className="flex h-screen bg-gray-100">
        <Sidebar />
        <div className="w-3/6 pr-6 pl-16 bg-zinc-100">
          <RightSidebar />
        </div>
        <main className="flex-grow pr-4 pt-6">
          <div className="bg-zinc-100 p-6">
            <h2 className="text-2xl font-bold mb-4">Shift Saat Ini</h2>
            <form>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="cashInDrawer"
                >
                  Uang Tunai Awal di Laci
                </label>
                <input
                  type="number"
                  id="cashInDrawer"
                  placeholder="Rp.0"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={startingCashInput}
                  onChange={(e) => setStartingCashInput(e.target.value)}
                />
              </div>
              <button
                type="button"
                onClick={handleStartShift}
                className="bg-slate-500 text-white py-2 px-4 rounded-lg hover:bg-slate-500"
              >
                MULAI SHIFT
              </button>
            </form>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="w-3/6 pr-6 pl-16 bg-zinc-100">
        <RightSidebar />
      </div>
      <div className="w-3/4 p-4">
        <div className="items-center mb-4">
          <div className="text-lg font-bold">Current Shift</div>
          <button onClick={handleEndShift} className="bg-blue-500 text-white px-4 py-2 rounded-lg">
            End Shift
          </button>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          {memberData ? ( // Pastikan memberData sudah di-load
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="font-semibold">Name</div>
              <div>{userData.name}</div>
              <div className="font-semibold">Outlet</div>
              <div>{outlet}</div>
              <div className="font-semibold">Starting Shift</div>
              <div>{format(memberData.start_time, "eeee, do 'of' MMMM yyyy 'at' hh:mm a", { locale: enUS })}</div>
              <div className="font-semibold">Expense/Income</div>
              <div className={expansi.netAmount < 0 ? "text-red-500" : "text-green-500"}>
                {expansi.netAmount < 0
                  ? `-${formatRupiah(Math.abs(expansi.netAmount))}`
                  : `${formatRupiah(expansi.netAmount)}`}
              </div>
              <div className="font-semibold">Items Sold</div>
              <div>{productTerjual ? productTerjual : 0}</div>
              <div className="font-semibold">Items Returned</div>
              <div>{productRefund ? productRefund : 0}</div>
            </div>
          ) : (
            <p>Loading...</p> // Tampilkan pesan loading saat data belum ada
          )}
          <div className="bg-gray-100 p-4 rounded-lg">
            <div className="text-lg font-bold mb-2">Cash</div>
            <div className="grid grid-cols-2 gap-4">
              <div className="font-semibold">Starting Cash</div>
              <div>{formatRupiah(memberData.start_cash)}</div>
              <div className="font-semibold">Cash Sales</div>
              <div>{formatRupiah(memberData.cashSales ? memberData.cashSales : 0)}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal for Ending Cash */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="bg-zinc-100 rounded-lg shadow-lg w-[700px]"> 
          <div className="p-8"> 
            <div className="flex justify-between items-center mb-4">
              <button
                className="text-red-500 border border-red-500 rounded px-4 py-2"
                onClick={handleModalClose}
              >
                Cancel
              </button>
              <h2 className="text-center text-xl font-bold">End Current Shift</h2>
            </div>
            <div className="mb-6 border border-gray-300 bg-white p-4 rounded">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-gray-600">Starting Shift</h3>
                <p className="text-gray-600">{format(memberData.start_time, "eeee, do 'of' MMMM yyyy 'at' hh:mm a", { locale: enUS })}</p>
              </div>
            </div>
            <div className="mb-6">
              <h2 className="font-bold text-gray-600 text-2xl">Cash Details</h2>
              <table className="w-full">
                <tbody>
                <tr className="border-b border-gray-300 bg-white">
                  <td className="py-3 px-4 text-gray-600">Starting Cash</td>
                  <td className="py-3 px-4 text-right text-gray-600">{formatRupiah(memberData.start_cash ? memberData.start_cash :0)}</td>
                </tr>
                  <tr className="border-b border-gray-300 bg-white">
                    <td className="py-3 px-4 text-gray-600">Cash Sales</td>
                    <td className="py-3 px-4 text-right text-gray-600">{formatRupiah(memberData.cash_sales ? memberData.cash_sales :0)}</td>
                  </tr>
                  <tr className="border-b border-gray-300 bg-white">
                    <td className="py-3 px-4 text-gray-600">Cash from Invoice</td>
                    <td className="py-3 px-4 text-right text-gray-600">{formatRupiah(memberData.cash_invoice ? memberData.cash_invoice :0)}</td>
                  </tr>
                  <tr className="border-b border-gray-300 bg-white">
                    <td className="py-3 px-4 text-gray-600">Cash Refunds</td>
                    <td className="py-3 px-4 text-right text-gray-600">{formatRupiah(memberData.cash_refunds ? memberData.cash_refunds:0)}</td>
                  </tr>
                  <tr className="border-b border-gray-300 bg-white">
                    <td className="py-3-b px-4 text-gray-600">Expense/Income</td>
                    <td className="py-3 px-4 text-right text-gray-600">{formatRupiah(expansi.netAmount)}</td>
                  </tr>
                  <tr className="border-b border-gray-300 bg-white">
                    <td className="py-3 px-4 text-gray-600">Expected Ending Cash</td>
                    <td className="py-3 px-4 text-right text-gray-600">{formatRupiah(1526000)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="mb-6 ">
              <label className="block font-bold text-gray-600 mb-2">Actual Ending Cash</label>
              <input
                type="text"
                className="border border-gray-300 w-full p-2 rounded"
                placeholder="Rp. 0"
                onChange={(e) => setEndingCash(e.target.value)}
              />
            </div>
            <button
              className="w-full bg-slate-500 text-white py-2 rounded-lg"
              onClick={handleModalSubmit}
            >
              END SHIFT
            </button>
          </div>
        </div>
      </div>
      
      )}
      {confirmEnd && (
        <div class="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
        <div class="bg-white rounded-xl shadow-xl p-10 w-full max-w-2xl">
          <h2 class="text-3xl font-bold text-center text-gray-800">Shift Ended</h2>
          <div class="mt-8">
            <div class="border-t border-gray-300 py-4">
              <div class="flex justify-between">
                <span class="text-gray-600">Name</span>
                <span class="text-gray-800">{userData.name}</span>
              </div>
            </div>
            <div class="border-t border-gray-300 py-4">
              <div class="flex justify-between">
                <span class="text-gray-600">Outlet</span>
                <span class="text-gray-800">{outlet}</span>
              </div>
            </div>
            <div class="border-t border-gray-300 py-4">
              <div class="flex justify-between">
                <span class="text-gray-600">Starting Shift</span>
                <span class="text-gray-800">{format(memberData.start_time, "eeee, do 'of' MMMM yyyy 'at' hh:mm a", { locale: enUS })}</span>
              </div>
            </div>
            <div class="border-t border-b border-gray-300 py-4">
              <div class="flex justify-between">
                <span class="text-gray-600">Ending Shift</span>
                <span class="text-gray-800">{format(date, "eeee, do 'of' MMMM yyyy 'at' hh:mm a", { locale: enUS })}</span>
              </div>
            </div>
          </div>
          <div class="mt-8 flex justify-center space-x-6">
            <button onClick={handleModalClose} class="bg-rose-400 text-white py-3 px-8 rounded-full font-semibold hover:bg-rose-600">No, Thanks</button>
            <button class="bg-slate-500 text-white py-3 px-8 rounded-full font-semibold hover:bg-slate-600">Print Receipt</button>
          </div>
        </div>
      </div>
      
      
      
      )}
    </div>
  );
};

export default Page;
