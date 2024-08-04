"use client";
import AdminTable from "../_components/_dashboard/AdminTable";
import Breadcrumb from "../_components/_dashboard/Breadcrumb";
import DatePicker from "../_components/_dashboard/DatePicker";
import SalesCard from "../_components/_dashboard/SalesCard";
import EmptyTable from "../_components/_dashboard/EmptyTable";
import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/_components/ui/table";
import { NumericFormat } from "react-number-format";
import { useEffect, useState } from "react";

const routes = [
  {
    title: "Grafik",
    path: "/grafik",
  },
];

export default function Page() {
  const [tableContent, setTableContent] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("/api/product");
        if (response.ok) {
          const data = await response.json();
          setTableContent(data);
        } else {
          console.error('Failed to fetch data:', await response.text());
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    fetchData();
  }, []);

  const data = {
    labels: [
      'Red',
      'Blue',
      'Yellow'
    ],
    datasets: [{
      label: 'My First Dataset',
      data: [300, 50, 100],
      backgroundColor: [
        'rgb(255, 99, 132)',
        'rgb(54, 162, 235)',
        'rgb(255, 205, 86)'
      ],
      hoverOffset: 4
    }]
  };

  return (
    <div>
    <canvas id="myChart"></canvas>
  </div>
  );
}
