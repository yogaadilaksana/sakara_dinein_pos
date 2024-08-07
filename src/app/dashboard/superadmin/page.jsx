'use client'
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from "react";
import { FiEdit, FiTrash } from "react-icons/fi";
import AdminTable from "@/app/_components/_dashboard/AdminTable";
import Breadcrumb from "@/app/_components/_dashboard/Breadcrumb";
import EmptyTable from "@/app/_components/_dashboard/EmptyTable";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from "@/app/_components/ui/table";

const routes = [
  {
    title: "Dashboard",
    path: "/dashboard",
  },
  {
    title: "Users",
    path: "/dashboard/users",
  },
];

export default function UserPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [tableContent, setTableContent] = useState([]);
  const [isCreating, setIsCreating] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");

  useEffect(() => {
    // Redirect if not logged in or not a SUPER_ADMIN
    if (status === "loading") return; // Do nothing while loading
    if (session?.user.role !== 'SUPER_ADMIN') {
      router.push('/auth/login'); // Redirect to login page
    }
  }, [session, status, router]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("/api/user");
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

  const handleOpenModal = (user) => {
    setCurrentUser(user);
    setName(user ? user.name : "");
    setEmail(user ? user.email : "");
    setRole(user ? user.role : "");
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentUser(null);
  };

  const handleSaveUser = async (e) => {
    e.preventDefault();

    const updatedUser = { ...currentUser, name, email, role };

    try {
      const response = await fetch(`/api/user`, {
        method: currentUser?.id ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedUser),
      });

      if (response.ok) {
        if (currentUser?.id) {
          setTableContent(tableContent.map(user => user.id === updatedUser.id ? updatedUser : user));
        } else {
          const createdUser = await response.json();
          setTableContent([...tableContent, createdUser]);
        }
        handleCloseModal();
      } else {
        console.error('Failed to save user:', await response.text());
      }
    } catch (error) {
      console.error('Error saving user:', error);
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      const response = await fetch("/api/user", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      if (response.ok) {
        setTableContent(tableContent.filter((item) => item.id !== id));
      } else {
        console.error('Failed to delete user:', await response.text());
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  // Show loading state or content if not redirected
  if (status === "loading") return <p>Loading...</p>;

  return (
    <>
      <div className="flex-grow lg:ml-80 mt-28 space-y-14 lg:w-auto w-screen">
        <div className="flex flex-col space-y-7 px-20 ">
          <Breadcrumb routes={routes} />
        </div>

        <div className="space-y-4 w-full px-6">
          <div className="flex justify-between items-center">
            <h1 className="font-semibold md:text-lg text-sm w-max">
              User Management
            </h1>
          </div>

          {tableContent.length > 0 ? (
            <AdminTable className="overflow-x-auto">
              <TableHeader className={`bg-dpprimary border-b-2 border-bcprimary`}>
                <TableRow>
                  <TableHead className="first:w-[260px] text-bcprimary font-semibold">Name</TableHead>
                  <TableHead className="text-bcprimary font-semibold">Email</TableHead>
                  <TableHead className="text-bcprimary font-semibold">Role</TableHead>
                  <TableHead className="last:text-right text-bcprimary font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="border bg-bcaccent/30">
                {tableContent.map((content, i) => (
                  <TableRow key={i} className="items-center">
                    <TableCell className="first:font-large last:text-right text-dpaccent">
                      {content.name}
                    </TableCell>
                    <TableCell className="text-dpaccent text-lg">
                      {content.email}
                    </TableCell>
                    <TableCell className="text-dpaccent">
                      {content.role}
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
                        onClick={() => handleDeleteUser(content.id)}
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
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-2xl mb-4">{currentUser?.id ? "Edit User" : "Create User"}</h2>
            <form onSubmit={handleSaveUser}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Role
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                >
                  <option value="ADMIN">Admin</option>
                  <option value="CASHIER">Cashier</option>
                </select>
              </div>
              <div className="flex items-center justify-between">
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
