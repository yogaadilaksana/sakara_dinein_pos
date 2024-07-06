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
    title: "Beranda",
    path: "/dashboard",
  },
];

export default function Page() {
  const [tableContent, setTableContent] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const response = await fetch("/api/products");
      const data = await response.json();
      setTableContent(data);
    }

    fetchData();
  }, []);

  const salesSummary = [
    {
      title: "Penjualan Kotor",
      type: "price",
      desc: `${tableContent.reduce((acc, item) => acc + item.orderItems.reduce((acc, order) => acc + order.price * order.quantity, 0), 0).toLocaleString()}`,
    },
    {
      title: "Penjualan Bersih",
      type: "price",
      desc: `${tableContent.reduce((acc, item) => acc + item.orderItems.reduce((acc, order) => acc + order.price * order.quantity, 0), 0).toLocaleString()}`,
    },
    {
      title: "Item Terjual",
      type: "quantity",
      desc: tableContent.reduce((acc, item) => acc + item.orderItems.reduce((acc, order) => acc + order.quantity, 0), 0),
    },
  ];

  return (
    <div className="flex-grow lg:ml-80 mt-28 space-y-14 lg:w-auto w-screen">
      <div className="flex flex-col space-y-7 px-20 ">
        <Breadcrumb routes={routes} />
        <SalesCard salesSummary={salesSummary} />
      </div>
      {tableContent.length > 0 ? (
        <div className="space-y-4 w-full px-6">
          <div className="flex justify-between items-center">
            <h1 className="font-semibold md:text-lg text-sm w-max">
              Rangkuman Produk
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
              {tableContent.map((product, i) => (
                <TableRow key={i} className="items-center">
                  <TableCell className="first:font-medium last:text-right text-dpaccent">
                    {product.name}
                  </TableCell>
                  <TableCell className="text-dpaccent">
                    {product.orderItems.reduce((acc, order) => acc + order.quantity, 0)}
                  </TableCell>
                  <TableCell className="text-dpaccent">
                    <NumericFormat
                      displayType="text"
                      value={product.orderItems.reduce((acc, order) => acc + order.price * order.quantity, 0)}
                      prefix={"Rp."}
                      thousandSeparator
                    />
                  </TableCell>
                  <TableCell className="text-dpaccent">
                    {product.orderItems.reduce((acc, order) => acc + order.quantity, 0)}
                  </TableCell>
                  <TableCell className="last:text-right text-dpaccent">
                    <NumericFormat
                      displayType="text"
                      value={product.orderItems.reduce((acc, order) => acc + order.price * order.quantity, 0)}
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
