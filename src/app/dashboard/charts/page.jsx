// pages/dashboard.js
'use client'

import { useEffect, useState } from 'react';
import PieChart from '../../_components/_dashboard/pieCharts';
import BarChart from '../../_components/_dashboard/barChart';
import Breadcrumb from "@/app/_components/_dashboard/Breadcrumb";

const routes = [
    {
      title: "Dashboard",
      path: "/dashboard",
    },
    {
      title: "Charts",
      path: "/dashboard/charts",
    },
  ];
const Page = () => {
    const [data, setData] = useState({ pieChart: null, barChart: [] });

    useEffect(() => {
      fetch('/api/charts')
        .then(response => response.json())
        .then(data => setData(data))
        .catch(error => console.error('Error fetching data:', error));
    }, []);
  
    return (
        <div className="container mx-auto p-4 pl-72 pt-12">
        <nav className="text-xs text-gray-500 mb-2">
          <span>Home</span> / <span>Dashboard</span> / <span>Grafik Chart</span>
        </nav>
        <h1 className="text-xl font-bold mb-4">Grafik Chart</h1>
        <div className="bg-white p-4 rounded shadow mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-base font-semibold">Date</h2>
            {/* Implement your date picker here */}
          </div>
          <div className="flex justify-between">
            <div className="w-1/2">
              <h3 className="text-center text-sm font-medium mb-2">Category Volume</h3>
              {data.pieChart && <PieChart data={data.pieChart} />}
            </div>
            <div className="w-1/2 p-2">
              <h3 className="text-center text-sm font-medium mb-2">Category Sales</h3>
              {/* Add another PieChart component for Category Sales if applicable */}
              {data.pieChart && <PieChart data={data.pieChart} />}
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded shadow">
          {data.barChart.map((monthData, index) => (
            <div key={index} className="mb-4">
              <h3 className="text-base font-semibold mb-2">{monthData.month}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {monthData.categories.map((categoryData, idx) => (
                  <BarChart key={idx} data={categoryData} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

export default Page;
