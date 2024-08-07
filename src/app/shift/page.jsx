"use client";

import { useState, useEffect } from "react";
import Sidebar from "../_components/_shift/sidebar";
import RightSidebar from "../_components/_shift/righSidebar";
import { format } from 'date-fns';
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
  const [startingCashInput, setStartingCashInput] = useState("");
  const [userId, setUserId] = useState(null);
  const [outlet, setoutlet] = useState("Sakara Coffe Bali Antasura");
  const [confirmEnd, setConfirmEnd] = useState(false);
  const [productTerjual, setProductTerjual] = useState(null);
  const [productRefund, setProductRefund] = useState(null);
  const [dated, setDated] = useState(new Date().toISOString());
  const [expansi, setExpansi] = useState(null);

  useEffect(() => {
    async function fetchUserId() {
      const response = await fetch('/api/login');
      if (response.ok) {
        const data = await response.json();
        window.sessionStorage.setItem('userId', data.userId);
        setUserId(parseInt(data.userID));
      } else {
        console.error('Failed to fetch userId:', await response.text());
      }
    }
    fetchUserId();
  }, []);

  useEffect(() => {
    const storedUserId = window.sessionStorage.getItem('userId');
    if (storedUserId) {
      setUserId(parseInt(storedUserId, 10));
    }
  }, []);

  useEffect(() => {
    async function fetchData() {
      if (userId !== null) {
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
    }

    fetchData();
  }, [userId]);

  useEffect(() => {
    if (dated) {
      fetch(`/api/product/terjual?start=${encodeURIComponent(dated)}&end=${encodeURIComponent(dated)}`)
        .then(response => response.json())
        .then(data => setProductTerjual(data));
    }
  }, [dated]);

  useEffect(() => {
    if (dated) {
      fetch(`/api/product/refund?start=${encodeURIComponent(dated)}&end=${encodeURIComponent(dated)}`)
        .then(response => response.json())
        .then(data => setProductRefund(data));
    }
  }, [dated]);

  useEffect(() => {
    fetch('/api/expanse')
      .then(response => response.json())
      .then(data => setExpansi(data));
  }, []);

  const formatRupiah = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(amount);
  };

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
      body: JSON.stringify({ user_id: userId, end_time: new Date(), endingCash: parseFloat(endingCash) })
    });
    if (response.ok) {
      setShowModal(false);
      setConfirmEnd(true);
    } else {
      console.error("Failed to end shift:", await response.text());
    }
  };

  if (userId === null) {
    return <div>Loading...</div>;
  }

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
          {memberData ? (
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="font-semibold">Name</div>
              <div>{userData.name}</div>
              <div className="font-semibold">Outlet</div>
              <div>{outlet}</div>
              <div className="font-semibold">Starting Shift</div>
              <div>{format(new Date(memberData.start_time), "eeee, do 'of' MMMM yyyy 'at' hh:mm a", { locale: enUS })}</div>
              <div className="font-semibold">Expense/Income</div>
              <div className={expansi.netAmount < 0 ? "text-red-500" : "text-green-500"}>
                {formatRupiah(expansi.netAmount)}
              </div>
              {/* Other details */}
            </div>
          ) : (
            <div>No shift data available</div>
          )}
        </div>
        {/* Transaction form */}
        <div className="bg-white p-4 rounded-lg shadow mt-4">
          <h2 className="text-2xl font-bold mb-4">Transaction Form</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
                Description
              </label>
              <input
                type="text"
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="amount">
                Amount
              </label>
              <input
                type="number"
                id="amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="transactionType">
                Transaction Type
              </label>
              <select
                id="transactionType"
                value={isIncome}
                onChange={(e) => setIsIncome(e.target.value === "true")}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="true">Income</option>
                <option value="false">Expense</option>
              </select>
            </div>
            <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-700">
              Add Transaction
            </button>
          </form>
        </div>
        {/* Modal for ending shift */}
        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-4 rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold mb-4">End Shift</h2>
              <p>Are you sure you want to end the shift?</p>
              <div className="flex justify-end mt-4">
                <button onClick={handleModalClose} className="bg-gray-500 text-white py-2 px-4 rounded-lg mr-2">
                  Cancel
                </button>
                <button onClick={handleModalSubmit} className="bg-red-500 text-white py-2 px-4 rounded-lg">
                  End Shift
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
