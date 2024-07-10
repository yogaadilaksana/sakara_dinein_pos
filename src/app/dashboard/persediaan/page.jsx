"use client";
import AdminTable from "@/app/_components/_dashboard/AdminTable";
import Breadcrumb from "@/app/_components/_dashboard/Breadcrumb";
import EditQuantityModal from "@/app/_components/_dashboard/EditQuantityModal";
import SalesCard from "@/app/_components/_dashboard/SalesCard";
import { useState, useEffect } from "react";

import { FiEdit, FiTrash } from "react-icons/fi";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/_components/ui/table";
import useToggleUiStore from "@/app/_stores/store";
import EmptyTable from "@/app/_components/_dashboard/EmptyTable";
import { NumericFormat } from "react-number-format";

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

export default function Page() {
  const [tableContent, setTableContent] = useState([]);
  const { setIsModalOpen, setItemName, setItemQty } = useToggleUiStore();

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

  const handleOpenModal = (data) => {
    setIsModalOpen();
    setItemName(data.name);
    setItemQty(data.stock);
  };

  const handleDeleteItem = async (id) => {
    try {
      const response = await fetch("/api/product", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      if (response.ok) {
        setTableContent(tableContent.filter((item) => item.id !== id));
      } else {
        console.error('Failed to delete item:', await response.text());
      }
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  return (
    <>
      <div className="flex-grow lg:ml-80 mt-28 space-y-14 lg:w-auto w-screen">
        <div className="flex flex-col space-y-7 px-20 ">
          <Breadcrumb routes={routes} />
          <SalesCard salesSummary={salesSummary} />
        </div>

        {tableContent.length > 0 ? (
          <div className="space-y-4 w-full px-6">
            <div>
              <h1 className="font-semibold md:text-lg text-sm w-max">
                Rangkuman Produk
              </h1>
            </div>

            {/* Table */}
            <AdminTable className="overflow-x-auto">
              <TableHeader
                className={`bg-dpprimary border-b-2 border-bcprimary`}
              >
                <TableRow>
                  <TableHead className="first:w-[260px] text-bcprimary font-semibold">
                    Menu
                  </TableHead>
                  <TableHead className="text-bcprimary font-semibold">
                    Jumlah
                  </TableHead>
                  <TableHead className="text-bcprimary font-semibold">
                    Harga
                  </TableHead>
                  <TableHead className="last:text-right text-bcprimary font-semibold">
                    Opsi
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="border bg-bcaccent/30">
                {tableContent.map((content, i) => (
                  <TableRow key={i} className="items-center">
                    <TableCell className="first:font-medium last:text-right text-dpaccent">
                      {content.name}
                    </TableCell>
                    <TableCell className="text-dpaccent">
                      {content.stock}
                    </TableCell>
                    <TableCell className="text-dpaccent">
                      <NumericFormat
                        displayType="text"
                        value={content.price}
                        prefix={"Rp."}
                        thousandSeparator
                      />
                    </TableCell>
                    <TableCell className="text-dpprimary flex justify-end items-center gap-3">
                      <button
                        className="hover:text-dpaccent duration-300 transition-colors"
                        onClick={() => handleOpenModal(content)}
                      >
                        <FiEdit size="1.4rem" />
                      </button>
                      <button
                        className="hover:text-error text-error/60 duration-300 transition-colors"
                        onClick={() => handleDeleteItem(content.id)}
                      >
                        <FiTrash size="1.4rem" />
                      </button>
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

      {/* Modal Pop Up */}
      <EditQuantityModal />
    </>
  );
}
