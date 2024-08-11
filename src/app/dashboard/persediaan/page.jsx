"use client";
import Breadcrumb from "@/app/_components/_dashboard/Breadcrumb";
import EditItemForm from "@/app/_components/_dashboard/EditItemForm";
import SalesCard from "@/app/_components/_dashboard/SalesCard";
import { useState, useEffect } from "react";
import { FiEdit, FiTrash, FiPlus } from "react-icons/fi";
import { NumericFormat } from "react-number-format";
import useToggleUiStore from "@/app/_stores/store";
import EmptyTable from "@/app/_components/_dashboard/EmptyTable";

const routes = [
  { title: "Dashboard", path: "/dashboard" },
  { title: "Persediaan", path: "/dashboard/persediaan" },
];

const initialSalesSummary = [
  { title: "Harga Total", type: "price", desc: "" },
  { title: "Jumlah Produk", type: "quantity", desc: "" },
];

const ITEMS_PER_PAGE = 5;

export default function Page() {
  const [tableContent, setTableContent] = useState([]);
  const [isCreating, setIsCreating] = useState(false);
  const [isCategoryCreating, setIsCategoryCreating] = useState(false);
  const [isCategory, setIsCategory] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [categories, setCategories] = useState([]);
  const [productId, setProductId] = useState(null);
  const [isModalEdit, setModalEdit] = useState(false);
  const [quantity, setQuantity] = useState(0);
  const [productDetail, setProductDetail] = useState({});
  const [selectedFile, setSelectedFile] = useState(null);
  const [editAllItem, setEditAllItem] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const { setIsModalOpen, setItemName, setItemQty } = useToggleUiStore();

  useEffect(() => {
    async function fetchData() {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          fetch("/api/product"),
          fetch("/api/category"),
        ]);

        if (productsRes.ok) {
          const productsData = await productsRes.json();
          setTableContent(productsData.products);
          initialSalesSummary[0].desc = Number(productsData.totalPrice);
          initialSalesSummary[1].desc = productsData.totalProducts;
        }

        if (categoriesRes.ok) {
          const categoriesData = await categoriesRes.json();
          setCategories(categoriesData);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    fetchData();
  }, []);

  const handleOpenModal = (data) => {
    const { setSelectedItemData } = useToggleUiStore.getState();
    setSelectedItemData(data);

    setModalEdit(true);
    setQuantity(data.stock);
    setProductDetail(data);
    setProductId(data.id);
    setItemName(data.name);
    setItemQty(data.stock);
    setCurrentItem(data);
  };

  const handleCloseModal = () => {
    setModalEdit(false);
    setIsCreating(false);
    setIsCategoryCreating(false);
  };

  const handleDeleteItem = async (id) => {
    try {
      const response = await fetch("/api/product", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (response.ok) {
        setTableContent(tableContent.filter((item) => item.id !== id));
      }
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const handleCreate = () => {
    setIsCreating(true);
    setCurrentItem({ name: '', qty: '', price: '' });
  };

  const handleCreateCategory = () => {
    setIsCategoryCreating(true);
  };

  const handleSaveItem = async (e) => {
    e.preventDefault();
  
    const itemData = { ...currentItem, stock: quantity };
    const endpoint = `/api/product`;
    const method = currentItem.id ? "PUT" : "POST";
  
    try {
      let imageFilePath = '';
  
      if (selectedFile) {
        const formData = new FormData();
        formData.append('file', selectedFile);
  
        const fileUploadResponse = await fetch(`/api/file`, {
          method: "POST",
          body: formData,
        });
  
        if (!fileUploadResponse.ok) throw new Error('File upload failed');
  
        const fileUploadResult = await fileUploadResponse.json();
        imageFilePath = fileUploadResult.filePath;
      }
      imageFilePath = imageFilePath.replace(/^\.\/public\//, '');

      const newItem = { ...itemData, image: imageFilePath };
  
      const response = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newItem),
      });
  
      const result = await response.json();
      if (response.ok) {
        setTableContent(currentItem.id ? 
          tableContent.map(item => item.id === currentItem.id ? result : item) : 
          [...tableContent, result]
        );
        setIsCreating(false);
        setCurrentItem(null);
        setModalEdit(false);
      } else {
        const errorText = await response.text();
        console.error('Error saving item:', errorText);
      }
    } catch (error) {
      console.error('Error saving item:', error);
    }
  };

  const handleSaveCategory = async (e) => {
    e.preventDefault();
  
    const categoryData = { name: currentItem.name };
  
    try {
      const response = await fetch(`/api/category`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(categoryData),
      });
  
      const result = await response.json();
      if (response.ok) {
        setCategories([...categories, result]);
        setIsCategoryCreating(false);
        setCurrentItem(null);
      } else {
        const errorText = await response.text();
        console.error('Error saving category:', errorText);
      }
    } catch (error) {
      console.error('Error saving category:', error);
    }
  };

  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentItems = tableContent.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(tableContent.length / ITEMS_PER_PAGE);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="flex-grow lg:ml-80 mt-28 space-y-14 lg:w-auto w-screen">
      <div className="flex flex-col space-y-5 px-4">
        <Breadcrumb routes={routes} />
        <div className="flex flex-col space-y-5">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-semibold">Inventory</h1>
            <div className="flex space-x-4">
              <button onClick={handleCreate} className="px-4 py-2 bg-blue-500 text-white rounded-md">Add New Item</button>
              <button onClick={handleCreateCategory} className="px-4 py-2 bg-blue-500 text-white rounded-md flex items-center">
                <FiPlus className="mr-2" /> Add Category
              </button>
            </div>
          </div>
          <div className="flex flex-col space-y-5">
            <SalesCard summary={initialSalesSummary} />
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
              {tableContent.length > 0 ? (
                <AdminTable
                  items={currentItems}
                  onEdit={handleOpenModal}
                  onDelete={handleDeleteItem}
                />
              ) : (
                <EmptyTable colSpan={4} />
              )}
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Modal untuk Edit Item */}
      {isModalEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <EditItemForm
              open={isModalEdit}
              close={handleCloseModal}
              item={productDetail}
              quantity={quantity}
              setQuantity={setQuantity}
              onSave={handleSaveItem}
            />
            <button
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
              onClick={handleCloseModal}
            >
              Tutup
            </button>
          </div>
        </div>
      )}

      {/* Modal untuk Create Item */}
      {isCreating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <EditItemForm
              open={isCreating}
              close={handleCloseModal}
              item={currentItem}
              quantity={quantity}
              setQuantity={setQuantity}
              onSave={handleSaveItem}
            />
            <button
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
              onClick={handleCloseModal}
            >
              Tutup
            </button>
          </div>
        </div>
      )}

      {/* Modal untuk Create Category */}
      {isCategoryCreating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
            <form onSubmit={handleSaveCategory}>
              <h2 className="text-lg font-semibold mb-4">Create Category</h2>
              <div className="mb-4">
                <label htmlFor="categoryName" className="block text-gray-700">Category Name</label>
                <input
                  id="categoryName"
                  type="text"
                  value={currentItem?.name || ''}
                  onChange={(e) => setCurrentItem({ ...currentItem, name: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
                  required
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded"
              >
                Save
              </button>
              <button
                type="button"
                className="ml-4 px-4 py-2 bg-red-500 text-white rounded"
                onClick={handleCloseModal}
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const AdminTable = ({ items, onEdit, onDelete }) => (
  <table className="w-full text-sm text-left text-gray-500">
    <thead className="text-xs text-gray-700 uppercase bg-gray-100">
      <tr>
        <th className="px-6 py-3">Nama Produk</th>
        <th className="px-6 py-3">Harga</th>
        <th className="px-6 py-3">Jumlah</th>
        <th className="px-6 py-3">Aksi</th>
      </tr>
    </thead>
    <tbody>
      {items.map((item) => (
        <tr key={item.id} className="bg-white border-b">
          <td className="px-6 py-4">{item.name}</td>
          <td className="px-6 py-4">
            <NumericFormat
              value={item.price}
              displayType={"text"}
              thousandSeparator={true}
              prefix={"Rp "}
            />
          </td>
          <td className="px-6 py-4">{item.stock}</td>
          <td className="px-6 py-4">
            <button onClick={() => onEdit(item)} className="text-blue-600 hover:text-blue-900 mr-3">
              <FiEdit />
            </button>
            <button onClick={() => onDelete(item.id)} className="text-red-600 hover:text-red-900">
              <FiTrash />
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);

const Pagination = ({ currentPage, totalPages, onPageChange }) => (
  <div className="flex justify-center space-x-2 mt-4">
    {Array.from({ length: totalPages }).map((_, index) => (
      <button
        key={index}
        className={`px-3 py-1 border ${index + 1 === currentPage ? 'bg-blue-500 text-white' : 'bg-white text-blue-500'}`}
        onClick={() => onPageChange(index + 1)}
      >
        {index + 1}
      </button>
    ))}
  </div>
);
