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
  const [isCreating, setIsCreating] = useState(false);
  const [isCategory, setIsOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [currentItemCategory, setCurrentItemCategory] = useState(null);
  const { setIsModalOpen, setItemName, setItemQty } = useToggleUiStore();
  const [categories, setCategories] = useState([]);



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




  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetch("/api/category");
        if (response.ok) {
          const data = await response.json();
          setCategories(data);
        } else {
          console.error('Failed to fetch categories:', await response.text());
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    }
  
    fetchCategories();
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

  const handleCreate = () => {
    setIsCreating(true);
    setCurrentItem({ name: '', qty: '', price: '' });
  };

  const handleCategory = () => {
    setIsOpen(true);
    setCurrentItemCategory({ name: '' });
  };

  const handleCategoryItem = async () => {
    try {
      const nameToSend = currentItemCategory.name ? currentItemCategory.name.toString() : '';
      const dataToSend = {
        name: nameToSend,
      };
  
      const response = await fetch("/api/category", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });
  
      if (response.ok) {
        const newItem = await response.json();
        setTableContent([...tableContent, newItem]);
        setIsOpen(false);
        setCurrentItemCategory(null);
      } else {
        console.error('Failed to create category:', await response.text());
      }
    } catch (error) {
      console.error('Error creating category:', error);
    }
  };
  
  
  
  

  const handleSaveItem = async () => {
    if (currentItem.id) {
      // Update item
      try {
        const response = await fetch(`/api/product/${currentItem.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(currentItem),
        });

        if (response.ok) {
          setTableContent(tableContent.map(item => item.id === currentItem.id ? currentItem : item));
          setIsCreating(false);
          setCurrentItem(null);
        } else {
          console.error('Failed to update item:', await response.text());
        }
      } catch (error) {
        console.error('Error updating item:', error);
      }
    } else {
      // Create item
      try {
        const response = await fetch("/api/product", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(currentItem),
        });

        if (response.ok) {
          const newItem = await response.json();
          setTableContent([...tableContent, newItem]);
          setIsCreating(false);
          setCurrentItem(null);
        } else {
          console.error('Failed to create item:', await response.text());
        }
      } catch (error) {
        console.error('Error creating item:', error);
      }
    }
  };

  return (
    <>
      <div className="flex-grow lg:ml-80 mt-28 space-y-14 lg:w-auto w-screen">
        <div className="flex flex-col space-y-7 px-20 ">
          <Breadcrumb routes={routes} />
          <SalesCard salesSummary={salesSummary} />
        </div>

        <div className="space-y-4 w-full px-6">
          <div className="flex justify-between items-center">
            <h1 className="font-semibold md:text-lg text-sm w-max">
              Rangkuman Produk
            </h1>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded"
              onClick={handleCreate}
            >
              Create Item
            </button>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded"
              onClick={handleCategory}
            >
              Create Category
            </button>
          </div>

          {tableContent.length > 0 ? (
            <AdminTable className="overflow-x-auto">
              <TableHeader className={`bg-dpprimary border-b-2 border-bcprimary`}>
                <TableRow>
                  <TableHead className="first:w-[260px] text-bcprimary font-semibold">Menu</TableHead>
                  <TableHead className="text-bcprimary font-semibold">Jumlah</TableHead>
                  <TableHead className="text-bcprimary font-semibold">Harga</TableHead>
                  <TableHead className="last:text-right text-bcprimary font-semibold">Opsi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="border bg-bcaccent/30">
                {tableContent.map((content, i) => (
                  <TableRow key={i} className="items-center">
                    <TableCell className="first:font-large last:text-right text-dpaccent">
                      {content.name}
                    </TableCell>
                    <TableCell className="text-dpaccent text-lg">
                      {content.stock}
                      <button 
                        className="hover:text-dpaccent duration-300 transition-colors ml-4"
                        onClick={() => handleOpenModal(content)}
                      >
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
          ) : (
            <EmptyTable />
          )}
                <EditQuantityModal />
        </div>
      </div>

      {/* Modal for Creating/Editing Item */}
      {isCreating && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded">
            <h2 className="text-2xl mb-4">Create Item</h2>
            <div className="mb-4">
              <label className="block text-gray-700">Name</label>
              <input
                type="text"
                value={currentItem.name}
                onChange={(e) => setCurrentItem({ ...currentItem, name: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded mt-2"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Quantity</label>
              <input
                type="number"
                value={currentItem.qty}
                onChange={(e) => setCurrentItem({ ...currentItem, qty: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded mt-2"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Price</label>
              <input
                type="number"
                value={currentItem.price}
                onChange={(e) => setCurrentItem({ ...currentItem, price: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded mt-2"
              />
            </div>
            <div className="mb-4">
        <label className="block text-gray-700">Category</label>
        <select
          value={currentItem.category || ''}
          onChange={(e) => setCurrentItem({ ...currentItem, category: e.target.value })}
          className="w-full p-2 border border-gray-300 rounded mt-2"
        >
          <option value="" disabled>Select a category</option>
          {categories.map((category) => (
            <option key={category.id} value={category.name}>
              {category.name}
            </option>
          ))}
        </select>
      </div>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
              onClick={handleSaveItem}
            >
              Save
            </button>
            <button
              className="bg-red-500 text-white px-4 py-2 rounded"
              onClick={() => { setIsCreating(false); setCurrentItem(null); }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Modal for Creating Category */}
      {isCategory && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded">
            <h2 className="text-2xl mb-4">Create Category</h2>
            <div className="mb-4">
              <label className="block text-gray-700">Category</label>
              <input
                type="text"
                value={currentItemCategory?.name || ''}
                onChange={(e) => setCurrentItemCategory({ ...currentItemCategory, name: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded mt-2"
              />
            </div>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
              onClick={handleCategoryItem}
            >
              Save
            </button>
            <button
              className="bg-red-500 text-white px-4 py-2 rounded"
              onClick={() => { setIsOpen(false); setCurrentItemCategory(null); }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
}
