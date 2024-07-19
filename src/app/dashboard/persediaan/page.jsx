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
import Image from "next/image";
import AddItemForm from "@/app/_components/_dashboard/AddItemForm";
import EditItemForm from "@/app/_components/_dashboard/EditItemForm";

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
    title: "Jumlah Produk",
    type: "quantity",
    desc: 30, // {databse.grossSales} Diambil dari API. Penjualan kotor bulan sekarang di reduce, store ke sini
  },
  {
    title: "Jumlah Kategori",
    type: "quantity",
    desc: 6, // {databse.grossProfit} Diambil dari API. Pendapatan kotor bulan sekarang di reduce, store ke sini
  },
];

const tableData = [
  {
    itemId: "23sawaw",
    itemName: "Nasi Buduh",
    category: "Main Course",
    quantity: 20,
    price: 26000,
    img: "/dashboard/rice-bowl.jpg",
  },
  {
    itemId: "asw21w",
    itemName: "Milk Shake Cokelat",
    category: "Milkshake",
    quantity: 12,
    price: 24000,
    img: "/dashboard/milkshake.jpg",
  },
  {
    itemId: "2jvlol",
    itemName: "Susu Tobrud",
    category: "Milk Based",
    quantity: 8,
    price: 666,
    img: "/dashboard/tante-erni.jpg",
  },
];

function Page() {
  const [tableContent, setTableContent] = useState(tableData);

  const {
    setIsModalOpen,
    setItemName,
    setItemQty,
    isAddItemFormOpen,
    setIsAddItemFormOpen,
    selectedItemData,
    setSelectedItemData,
  } = useToggleUiStore();

  console.log(selectedItemData);

  const handleOpenModal = (data) => {
    setIsModalOpen();
    setItemName(data.itemName);
    setItemQty(data.quantity);
  };

  const handleOpenEditForm = (data) => {
    setSelectedItemData(data);
  };

  const handleDeleteItem = (id) => {
    // console.log(id);
    setTableContent(tableContent.filter((item) => item.itemId !== id));
  };

  return (
    <>
      <div className="flex-grow lg:ml-80 mt-28 space-y-10 lg:w-auto w-screen">
        <div className="flex flex-col space-y-7 px-20 ">
          <Breadcrumb routes={routes} />
          <SalesCard salesSummary={salesSummary}>Rangkuman Produk</SalesCard>
        </div>

        {isAddItemFormOpen && <AddItemForm />}
        {!selectedItemData && <EditItemForm />}
        {tableContent.length > 0 ? (
          <div className="space-y-4 w-full px-6">
            <div className="flex justify-between items-center">
              <h1 className="font-semibold md:text-lg text-sm w-max">
                Pustaka Produk
              </h1>
              {!isAddItemFormOpen && (
                <button
                  type="button"
                  className="px-5 py-2 rounded-lg bg-dpaccent hover:bg-dpaccent/50 duration-300 transition-colors text-sm text-bcaccent"
                  onClick={setIsAddItemFormOpen}
                >
                  Tambah Produk
                </button>
              )}
            </div>

            {/* Table */}
            <AdminTable className="overflow-x-auto">
              <TableHeader
                className={`bg-dpprimary border-b-2 border-bcprimary`}
              >
                <TableRow>
                  <TableHead className="first:w-[260px] text-bcprimary font-semibold">
                    Foto
                  </TableHead>
                  <TableHead className="text-bcprimary font-semibold">
                    Menu
                  </TableHead>
                  <TableHead className="text-bcprimary font-semibold">
                    Kategori
                  </TableHead>
                  <TableHead className="text-bcprimary font-semibold w-[150px]">
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
                  <TableRow key={i}>
                    <TableCell className="first:font-medium last:text-right text-dpaccent">
                      <div
                        style={{
                          position: "relative",
                          width: `${70}px`,
                          height: `${70}px`,
                        }}
                      >
                        <Image
                          src={content.img}
                          alt="Foto Produk"
                          fill
                          style={{ objectFit: "cover" }}
                        />
                      </div>
                    </TableCell>
                    <TableCell className="text-dpaccent">
                      {content.itemName}
                    </TableCell>
                    <TableCell className="text-dpaccent">
                      {content.category}
                    </TableCell>
                    <TableCell
                      className="text-dpaccent flex justify-between gap-2"
                      onClick={() => handleOpenModal(content)}
                    >
                      {content.quantity}
                      <button className="text-dpprimary pr-9 hover:text-dpaccent duration-300 transition-colors">
                        <FiEdit size="1.4rem" />
                      </button>
                    </TableCell>
                    <TableCell className="text-dpaccent">
                      <NumericFormat
                        displayType="text"
                        value={content.price}
                        prefix={"Rp."}
                        thousandSeparator
                      />
                    </TableCell>
                    <TableCell className="text-dpprimary flex justify-end mt-5 space-x-4">
                      <button
                        className="text-dpprimary hover:text-dpaccent duration-300 transition-colors"
                        onClick={() => handleOpenEditForm(content)}
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

export default Page;
