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

const tableHead = [
  "Karyawan",
  "Shift Mulai",
  "Shift Selesai",
  "Ekspetasi Total",
  "Total Sebenarnya",
  "Selisih",
];

const tableContent = [
  {
    shiftId: "wd21sss",
    details: [
      "Asep",
      "21/04/2024 06:57",
      "21/04/2024 23:00",
      "Rp.2.475.500",
      "Rp.2.475.500",
      "Rp.0",
    ],
  },
  {
    shiftId: "skolayo",
    details: [
      "Hehehe",
      "21/04/2024 06:57",
      "21/04/2024 23:00",
      "Rp.2.475.500",
      "Rp.2.475.500",
      "Rp.0",
    ],
  },
  {
    shiftId: "nsklng13",
    details: [
      "Seblak Tasik Mang Jajang",
      "21/04/2024 06:57",
      "21/04/2024 23:00",
      "Rp.2.475.500",
      "Rp.2.475.500",
      "Rp.0",
    ],
  },
];

function page() {
  return (
    <div className="flex-grow lg:ml-80 mt-28 space-y-10 lg:w-auto w-screen">
      <div className="flex flex-col px-20 ">
        <Breadcrumb routes={routes} />
      </div>
      <div className="space-y-4 w-full px-6">
        <div className="flex justify-between items-center">
          <DatePicker />
          <Button className="bg-dpprimary">Export</Button>
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

export default page;
