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

  const salesSummary = [
    {
      title: "Penjualan Kotor",
      type: "price",
      desc: '2.000.000'
    },
    {
      title: "Penjualan Bersih",
      type: "price",
      desc: "1.000.000"
    },
    {
      title: "Item Terjual",
      type: "quantity",
      desc: "30"
    },
  ];

  return (
    <div className="flex-grow lg:ml-80 mt-28 space-y-14 lg:w-auto w-screen">
      <div className="flex flex-col space-y-7 px-20">
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
                  Stok
                </TableHead>
                <TableHead className="text-bcprimary font-semibold">
                  Deskripsi
                </TableHead>
                <TableHead className="text-bcprimary font-semibold">
                  Harga
                </TableHead>
                <TableHead className="text-bcprimary font-semibold">
                  Kategori
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
                    {product.stock}
                  </TableCell>
                  <TableCell className="text-dpaccent">
                    {product.description}
                  </TableCell>
                  <TableCell className="text-dpaccent">
                  <NumericFormat
                      displayType="text"
                      value= {product.price}
                      prefix={"Rp."}
                      thousandSeparator
                    />
                  </TableCell>
                  <TableCell className="text-dpaccent">
                    {product.category?.name}
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
