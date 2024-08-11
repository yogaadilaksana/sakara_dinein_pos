"use client";
import Breadcrumb from "@/app/_components/_dashboard/Breadcrumb";
import EditQuantityModal from "@/app/_components/_dashboard/EditQuantityModal";
import SalesCard from "@/app/_components/_dashboard/SalesCard";
import { useState, useEffect } from "react";
import { FiEdit, FiTrash } from "react-icons/fi";
import { NumericFormat } from "react-number-format";
import useToggleUiStore from "@/app/_stores/store";
import EmptyTable from "@/app/_components/_dashboard/EmptyTable";
import EditItemForm from "@/app/_components/_dashboard/EditItemForm";

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
    console.log("Edit button clicked", data); // Tambahkan log ini

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

  const handleCloseModal = () => setModalEdit(false);

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

  const handleSaveItem = async (e) => {
    e.preventDefault();
  
    const itemData = { ...currentItem, stock: quantity };
    const endpoint = `/api/product`; // Ensure the correct endpoint
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
  
      console.log("apa responnya ?", response);
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
        console.error('Error saving item:', errorText); // Log server error response
      }
    } catch (error) {
      console.error('Error saving item:', error);
    }
  };
  

  console.log("this is setopen modes", isModalEdit)
  // Pagination logic
  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentItems = tableContent.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(tableContent.length / ITEMS_PER_PAGE);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <>
      <div className="flex-grow lg:ml-80 mt-28 space-y-14 lg:w-auto w-screen">
        <div className="flex flex-col space-y-5 px-4">
          <Breadcrumb routes={routes} />
          <div className="flex flex-col space-y-5">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-semibold">Inventory</h1>
              <button onClick={handleCreate} className="px-4 py-2 bg-blue-500 text-white rounded-md">Add New Item</button>
            </div>
            <div className="flex flex-col space-y-5">
              <SalesCard summary={initialSalesSummary} />
              <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                <AdminTable
                  items={currentItems}
                  onEdit={handleOpenModal}
                  onDelete={handleDeleteItem}
                />
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

    {isModalEdit &&(
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
    </>
  );
}

const AdminTable = ({ items, onEdit, onDelete }) => (
  <table className="min-w-full divide-y divide-gray-200">
    <thead className="bg-gray-50">
      <tr>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No</th>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Produk</th>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Harga</th>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
      </tr>
    </thead>
    <tbody className="bg-white divide-y divide-gray-200">
      {items.length ? (
        items.map((item, index) => (
          <tr key={item.id}>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{index + 1}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.name}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              <NumericFormat value={item.price} displayType="text" thousandSeparator prefix="Rp. " />
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.stock}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              <button onClick={() => onEdit(item)} className="text-blue-500 hover:underline">
                <FiEdit />
              </button>
              <button onClick={() => onDelete(item.id)} className="text-red-500 hover:underline ml-4">
                <FiTrash />
              </button>
            </td>
          </tr>
        ))
      ) : (
        <tr>
          <td colSpan="5">
            <EmptyTable message="No items found" />
          </td>
        </tr>
      )}
    </tbody>
  </table>
);


const Pagination = ({ currentPage, totalPages, onPageChange }) => (
  <nav className="flex justify-between items-center p-4">
    <button
      disabled={currentPage === 1}
      onClick={() => onPageChange(currentPage - 1)}
      className={`px-4 py-2 border rounded ${currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-50'}`}
    >
      Previous
    </button>
    <span>
      Page {currentPage} of {totalPages}
    </span>
    <button
      disabled={currentPage === totalPages}
      onClick={() => onPageChange(currentPage + 1)}
      className={`px-4 py-2 border rounded ${currentPage === totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-50'}`}
    >
      Next
    </button>
  </nav>
);
