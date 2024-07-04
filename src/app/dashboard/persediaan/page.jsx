"use client";
import AdminTable from "@/app/_components/_dashboard/AdminTable";
import Breadcrumb from "@/app/_components/_dashboard/Breadcrumb";
import EditQuantityModal from "@/app/_components/_dashboard/EditQuantityModal";
import SalesCard from "@/app/_components/_dashboard/SalesCard";
import { useState } from "react";

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

const tableData = [
  {
    itemId: "23sawaw",
    itemName: "Nasi Buduh",
    quantity: 20,
    price: 25000,
  },
  {
    itemId: "asw21w",
    itemName: "Milk Shake Cokelat",
    quantity: 12,
    price: 24000,
  },
  {
    itemId: "2jvlol",
    itemName: "Susu Tobrud",
    quantity: 8,
    price: 666,
  },
];

function page() {
  const [tableContent, setTableContent] = useState(tableData);

  const { setIsModalOpen, setItemName, setItemQty } = useToggleUiStore();

  const handleOpenModal = (data) => {
    setIsModalOpen();
    setItemName(data.itemName);
    setItemQty(data.quantity);
  };

  const handleDeleteItem = (id) => {
    // console.log(id);
    setTableContent(tableContent.filter((item) => item.itemId !== id));
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
                      {content.itemName}
                    </TableCell>
                    <TableCell className="text-dpaccent">
                      {content.quantity}
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
                        onClick={() => handleDeleteItem(content.itemId)}
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

export default page;
