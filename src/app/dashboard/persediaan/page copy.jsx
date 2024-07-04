"use client";
import AdminTable from "@/app/_components/_dashboard/AdminTable";
import Breadcrumb from "@/app/_components/_dashboard/Breadcrumb";
import EditQuantityModal from "@/app/_components/_dashboard/EditQuantityModal";
import SalesCard from "@/app/_components/_dashboard/SalesCard";
import useToggleUiStore from "@/app/_stores/store";
import { useState } from "react";

const routes = [
  {
    title: "Dashboard",
    path: "/dashboard",
  },
  {
    title: "Persediaan",
    path: "/dashboard/persediaan",
  },
];

const salesSummary = [
  {
    title: "Harga Total",
    type: "price",
    desc: "10.250.000", // {databse.grossSales} Diambil dari API. Penjualan kotor bulan sekarang di reduce, store ke sini
  },
  {
    title: "Jumlah Produk",
    type: "quantity",
    desc: "30", // {databse.grossProfit} Diambil dari API. Pendapatan kotor bulan sekarang di reduce, store ke sini
  },
];

const tableHead = ["Menu", "Jumlah", "Harga", "Opsi"];

const tableData = [
  {
    itemId: 123,
    item: "Cafe Latte",
    details: ["Cafe Latte", 16, "20.000"],
  },
  {
    itemId: 456,
    item: "Pedawa",
    details: ["Pedawa", 16, "22.000"],
  },
];

function page() {
  const [tableContent, setTableContent] = useState(tableData);

  return (
    <>
      <div className="flex-grow lg:ml-80 mt-28 space-y-14 lg:w-auto w-screen">
        <div className="flex flex-col space-y-7 px-20 ">
          <Breadcrumb routes={routes} />
          <SalesCard salesSummary={salesSummary} />
        </div>
        <div className="space-y-4 w-full px-6">
          <div>
            <h1 className="font-semibold md:text-lg text-sm w-max">
              Rangkuman Produk
            </h1>
          </div>
          <AdminTable
            setTableContent={setTableContent}
            type={"action"}
            tableHead={tableHead}
            tableContent={tableContent}
            className="overflow-x-auto"
          />
        </div>
      </div>

      {/* Modal Pop Up */}
      <EditQuantityModal />
    </>
  );
}

export default page;
