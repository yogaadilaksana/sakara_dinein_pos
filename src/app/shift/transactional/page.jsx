"use client"

import { useState, useEffect } from 'react';

import Sidebar from "../../_components/_shift/sidebar";
import RightSidebar from "../../_components/_shift/righSidebar";

const Page = () => {
  const [isIncome, setIsIncome] = useState(true);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  // const [transactions, setTransactions] = useState([
  //   { description: 'Uang jackpot', amount: 300000 },
  //   { description: 'Es Batu Besar 10kilo', amount: -11000 },
  //   { description: 'Uang Jackpot Hangus', amount: -300000 },
  // ]);
  const [transactions, setTransactions] = useState([])

  const handleSubmit = async () => {
    const now = new Date().toISOString(); // Current date and time in ISO 8601 format
    const payload = {type: isIncome ? "INCOME" : "EXPENSE", amount: amount, description: description, transactionDate: now}

    const response = await fetch("/api/shift/transaction",{
      method: "POST",
      headers: { "Content-Type": "application/json"},
      body: JSON.stringify(payload)
    })
    const newTransaction = { description, amount: isIncome ? +amount : -amount };
    setTransactions([...transactions, newTransaction]);
    setDescription('');
    setAmount('');
  };


  useEffect(() => {
    // Fetch shift data when the component mounts
    fetch('/api/shift/transaction')
      .then(response => response.json())
      .then(data => {
        setTransactions(data)
      })
      .catch(error => console.error("Error fetching shift data:", error));
  }, []);

  // const total = transactions.reduce((acc, transaction) => acc + transaction.amount, 0);

  const totalIncome = transactions
  .filter(transaction => transaction.type === 'INCOME')
  .reduce((acc, transaction) => acc + transaction.amount, 0);

  // Calculate total expense
  const totalExpense = transactions
    .filter(transaction => transaction.type === 'EXPENSE')
    .reduce((acc, transaction) => acc + transaction.amount, 0);

  const total = parseInt(totalIncome) - parseInt(totalExpense);

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="w-3/6 pr-6 pl-16 bg-zinc-100">
        <RightSidebar />
      </div>
      <div className=" bg-gray-100 p-5">
        
      </div>
      <div className="w-2/3 p-5">
        <h2 className="text-2xl font-bold mb-5">Expense/Income</h2>
        <button
          onClick={() => setIsIncome(true)}
          className={`mr-2 px-4 py-2 rounded ${isIncome ? 'bg-green-500 text-white' : 'bg-gray-300'}`}
        >
          Income
        </button>
        <button
          onClick={() => setIsIncome(false)}
          className={`px-4 py-2 rounded ${!isIncome ? 'bg-red-500 text-white' : 'bg-gray-300'}`}
        >
          Expense
        </button>
        <div className=' pt-9'>
          <input
            type="text"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border p-2 w-full mb-4"
          />
          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="border p-2 w-full mb-4"
          />
          <button onClick={handleSubmit} className="bg-blue-500 text-white px-4 py-2 rounded">
            Submit
          </button>
        </div>
        <h3 className="text-xl font-bold mt-5">Expense/Income</h3>
        <ul className="list-none mt-3">
          {transactions.map((transaction, index) => (
            <li key={index} className="mb-2">
              <span>{transaction.description}</span>
              <span
                className={`float-right ${
                  transaction.type === 'EXPENSE' ? 'text-red-500' : 'text-green-500'
                }`}
              >
                {transaction.type === 'EXPENSE' ? '-' : '+'}Rp.{Math.abs(transaction.amount).toLocaleString()}
              </span>
            </li>
          ))}
        </ul>
        <div className="mt-5 font-bold">
          Total Expense/Income: <span>{total < 0 ? '-' : '+'}Rp.{Math.abs(total).toLocaleString()}</span>
        </div>
      </div>
    </div>

    
  );
};

export default Page;
