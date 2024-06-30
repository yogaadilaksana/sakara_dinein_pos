import Breadcrumb from "../_components/_dashboard/Breadcrumb";
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

export default function dashboard() {
  return (
    <div className="flex-grow lg:ml-80 pt-20 px-20">
      <div className="flex flex-col space-y-4">
        <Breadcrumb routes={routes} />
        <SalesCard salesSummary={salesSummary} />
      </div>
    </div>
  );
}
