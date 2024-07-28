"use client";
import AdminTable from "@/app/_components/_dashboard/AdminTable";
import Breadcrumb from "@/app/_components/_dashboard/Breadcrumb";
import DatePicker from "@/app/_components/_dashboard/DatePicker";
import SalesCard from "@/app/_components/_dashboard/SalesCard";
import { Button } from "@/app/_components/ui/button";
import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/_components/ui/table";
import { useToggleUiStore } from "@/app/_stores/store";
import { NumericFormat } from "react-number-format";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import EmptyTable from "@/app/_components/_dashboard/EmptyTable";

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

const tableContent = [
  {
    time: "21:30",
    customer: "Asep",
    itemName: "Nasi Buduh",
    price: 28000,
  },
  {
    time: "21:30",
    customer: "Asep",
    itemName: "Sakara Tea",
    price: 10000,
  },
];

function Page() {
  const { selectedDate } = useToggleUiStore();
  console.log(selectedDate);

  const totalItemPrice = tableContent.reduce((prevValue, currValue) => {
    return prevValue + currValue.price;
  }, 0);
  console.log(totalItemPrice);

  const formatDate = (date) => {
    if (!date) return "";
    return format(date, "eeee, d MMMM yyyy", { locale: id });
  };

  return (
    <div className="flex-grow lg:ml-80 mt-28 space-y-14 lg:w-auto w-screen">
      <div className="flex flex-col space-y-7 px-20 ">
        <Breadcrumb routes={routes} />
        <SalesCard salesSummary={salesSummary} />
      </div>

      {tableContent.length > 0 ? (
        <div className="space-y-4 w-full px-6">
          <div className="flex justify-between items-center">
            <DatePicker />
            <Button className="bg-dpprimary">Export</Button>
          </div>

          {/* Table */}
          <AdminTable className="overflow-x-auto">
            <TableHeader className="bg-dpprimary border-b-4 border-bcprimary">
              <TableRow>
                <TableHead colSpan={3} className=" text-bcprimary">
                  {selectedDate === ""
                    ? "Hari Sekarang"
                    : formatDate(selectedDate)}
                </TableHead>
                <TableHead className="space-x-6 text-right font-semibold text-lg text-bcprimary">
                  <span className="font-normal text-base">Total:</span>
                  <NumericFormat
                    displayType="text"
                    value={totalItemPrice}
                    prefix={"Rp."}
                    thousandSeparator
                  />
                  {/* <span>Rp.2.000.000</span> */}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableHeader
              className={`bg-dpprimary/70 border-b-2 border-bcprimary`}
            >
              <TableRow>
                <TableHead className="first:w-[260px] text-bcprimary font-semibold">
                  Jam
                </TableHead>
                <TableHead className="text-bcprimary font-semibold">
                  Pelanggan
                </TableHead>
                <TableHead className="text-bcprimary font-semibold">
                  Produk
                </TableHead>
                <TableHead className="last:text-right text-bcprimary font-semibold">
                  Harga
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="border bg-bcaccent/30">
              {tableContent.map((content, i) => (
                <TableRow key={i} className="items-center">
                  <TableCell className="first:font-medium last:text-right text-dpaccent">
                    {content.time}
                  </TableCell>
                  <TableCell className="text-dpaccent">
                    {content.customer}
                  </TableCell>
                  <TableCell className="text-dpaccent">
                    {content.itemName}
                  </TableCell>
                  <TableCell className="last:text-right text-dpaccent">
                    <NumericFormat
                      displayType="text"
                      value={content.price}
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

export default Page;
