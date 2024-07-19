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
    title: "Keuntungan Kotor",
    type: "price",
    desc: "2.492.000", // {databse.grossProfit} Diambil dari API. Pendapatan kotor bulan sekarang di reduce, store ke sini
  },
  {
    title: "Penjualan bersih",
    type: "quantity",
    desc: "69", // {databse.netSales} Diambil dari API. Penjualan bersih bulan sekarang di reduce, store ke sini
  },
];

const tableContent = [
  {
    itemName: "Cafe Latte",
    itemSold: 16,
    grossSales: 2492000,
    grossProfit: 2982000,
    netSales: 69,
  },
  {
    itemName: "Pedawa",
    itemSold: 30,
    grossSales: 2492000,
    grossProfit: 2982000,
    netSales: 69,
  },
  {
    itemName: "Seblak Mang Jajang",
    itemSold: 1000,
    grossSales: 2492000,
    grossProfit: 2982000,
    netSales: 69,
  },
];

export default function Page() {
  return (
    <div className="flex-grow lg:ml-80 mt-28 space-y-14 lg:w-auto w-screen">
      <div className="flex flex-col space-y-7 px-20 ">
        <Breadcrumb routes={routes} />
        <SalesCard salesSummary={salesSummary}>Rangkuman Penjualan</SalesCard>
      </div>
      {tableContent.length > 0 ? (
        <div className="space-y-4 w-full px-6">
          <div className="flex justify-between items-center">
            <h1 className="font-semibold md:text-lg text-sm w-max">
              Penjualan Produk
            </h1>
            <DatePicker />
          </div>

          {/* Table */}
          <AdminTable className="overflow-x-auto">
            <TableHeader className={`bg-dpprimary border-b-2 border-bcprimary`}>
              <TableRow>
                <TableHead className="first:w-[260px] text-bcprimary font-semibold">
                  Produk
                </TableHead>
                <TableHead className="text-bcprimary font-semibold">
                  Produk Terjual
                </TableHead>
                <TableHead className="text-bcprimary font-semibold">
                  Penjualan Kotor
                </TableHead>
                <TableHead className="text-bcprimary font-semibold">
                  Penjualan Bersih
                </TableHead>
                <TableHead className="last:text-right text-bcprimary font-semibold">
                  Keuntungan Kotor
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="border bg-bcaccent/30">
              {tableContent.map((content, i) => (
                <TableRow key={i} className="items-center">
                  <TableCell className="first:font-medium last:text-right text-dpaccent">
                    {content.itemName}
                  </TableCell>
                  <TableCell className="text-dpaccent">
                    {content.itemSold}
                  </TableCell>
                  <TableCell className="text-dpaccent">
                    <NumericFormat
                      displayType="text"
                      value={content.grossSales}
                      prefix={"Rp."}
                      thousandSeparator
                    />
                  </TableCell>
                  <TableCell className="text-dpaccent">
                    {content.netSales}
                  </TableCell>
                  <TableCell className="last:text-right text-dpaccent">
                    <NumericFormat
                      displayType="text"
                      value={content.grossProfit}
                      prefix={"Rp."}
                      thousandSeparator
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </AdminTable>
        </div>
      ) : (
        <EmptyTable />
      )}
    </div>
  );
}
