"use client";
import AdminTable from "../_components/_dashboard/AdminTable";
import Breadcrumb from "../_components/_dashboard/Breadcrumb";
import DatePicker from "../_components/_dashboard/DatePicker";
import SalesCard from "../_components/_dashboard/SalesCard";

const routes = [
  {
    title: "Beranda",
    path: "/dashboard",
  },
];

const salesSummary = [
  {
    title: "Penjualan Kotor",
    type: "price",
    desc: "200.492.000", // {databse.grossSales} Diambil dari API. Penjualan kotor bulan sekarang di reduce, store ke sini
  },
  {
    title: "Pendapatan Kotor",
    type: "price",
    desc: "2.492.000", // {databse.grossProfit} Diambil dari API. Pendapatan kotor bulan sekarang di reduce, store ke sini
  },
  {
    title: "Penjualan bersih",
    type: "quantity",
    desc: "69", // {databse.netSales} Diambil dari API. Penjualan bersih bulan sekarang di reduce, store ke sini
  },
];

const tableHead = [
  "Produk",
  "Produk Terjual",
  "Penjulan Kotor",
  "Penjulan Bersih",
  "Keuntungan Kotor",
];

const tableContent = [
  {
    item: "Cafe Latte",
    details: ["Pedawa", 16, "1.350.000", "1.000.000", "20.000.000"],
  },
  {
    item: "Pedawa",
    details: ["Pedawa", 16, "1.350.000", "1.000.000", "20.000.000"],
  },
];

export default function dashboard() {
  return (
    <div className="flex-grow lg:ml-80 mt-28 space-y-14 lg:w-auto w-screen">
      <div className="flex flex-col space-y-7 px-20 ">
        <Breadcrumb routes={routes} />
        <SalesCard salesSummary={salesSummary} />
      </div>
      <div className="space-y-4 w-full px-6">
        <div className="flex justify-between items-center">
          <h1 className="font-semibold md:text-lg text-sm w-max">
            Rangkuman Produk
          </h1>
          <DatePicker />
        </div>
        <AdminTable
          tableHead={tableHead}
          tableContent={tableContent}
          className="overflow-x-auto"
        />
      </div>
    </div>
  );
}
