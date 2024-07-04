import AdminTable from "@/app/_components/_dashboard/AdminTable";
import Breadcrumb from "@/app/_components/_dashboard/Breadcrumb";
import DatePicker from "@/app/_components/_dashboard/DatePicker";
import SalesCard from "@/app/_components/_dashboard/SalesCard";
import { Button } from "@/app/_components/ui/button";

const routes = [
  {
    title: "Beranda",
    path: "/dashboard",
  },
  {
    title: "Transaksi",
    path: "/dashboard/transaksi",
  },
];

const salesSummary = [
  {
    title: "Transaksi",
    type: "quantity",
    desc: "123",
  },
  {
    title: "Keuntungan Dihasilkan",
    type: "price",
    desc: "2.492.000",
  },
  {
    title: "Penjualan bersih",
    type: "price",
    desc: "2.492.000",
  },
];

const tableHead = ["Jam", "Pelanggan", "Produk", "Harga"];

const tableContent = [
  {
    details: ["21:30", "Asep", "Nasi Buduh", "28.000"],
  },
];

function page() {
  return (
    <div className="flex-grow lg:ml-80 mt-28 space-y-14 lg:w-auto w-screen">
      <div className="flex flex-col space-y-7 px-20 ">
        <Breadcrumb routes={routes} />
        <SalesCard salesSummary={salesSummary} />
      </div>
      <div className="space-y-4 w-full px-6">
        <div className="flex justify-between items-center">
          <DatePicker />
          <Button className="bg-dpprimary">Export</Button>
        </div>
        <AdminTable
          type={"transaction"}
          tableHead={tableHead}
          tableContent={tableContent}
          className="overflow-x-auto"
        />
      </div>
    </div>
  );
}

export default page;
