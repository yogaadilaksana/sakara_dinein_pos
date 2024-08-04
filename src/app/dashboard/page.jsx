"use client";
import AdminTable from "../_components/_dashboard/AdminTable";
import Breadcrumb from "../_components/_dashboard/Breadcrumb";
import DatePicker from "../_components/_dashboard/DatePicker";
import SalesCard from "../_components/_dashboard/SalesCard";
import EmptyTable from "../_components/_dashboard/EmptyTable";
import useToggleUiStore from "@/app/_stores/store";

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
  const [salesSummary, setsalesSummary] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  const { selectedDate: selectedDateFromStore } = useToggleUiStore();
  useEffect(() => {
    setSelectedDate(selectedDateFromStore);
  }, [selectedDateFromStore]);

  const handleSelectDate = (date) => {
    if (date) {
      setSelectedDate(date);
    }
  };

  function formatDate(date) {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        let url = "/api/transaction";
        if (selectedDate) {
          const formattedDate = formatDate(selectedDate);
          url = `/api/transaction/bydate?startDate=${formattedDate}&endDate=${formattedDate}`;
        }

        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();
          setTableContent(data.transactionData);
          setsalesSummary(data.salesSummaryFormatted);
        } else {
          console.error('Failed to fetch data:', await response.text());
          setTableContent([]); // Set table content to empty array if response is not ok
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setTableContent([]); // Set table content to empty array in case of error
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedDate]);
  
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
            <DatePicker onClick={handleSelectDate}/>
          </div>

          {/* Table */}
          <AdminTable className="overflow-x-auto">
            <TableHeader className={`bg-dpprimary border-b-2 border-bcprimary`}>
              <TableRow>
                <TableHead className="first:w-[260px] text-bcprimary font-semibold">
                  Item
                </TableHead>
                <TableHead className="text-bcprimary font-semibold">
                  Item Sold
                </TableHead>
                <TableHead className="text-bcprimary font-semibold">
                  Gross Sales
                </TableHead>
                <TableHead className="text-bcprimary font-semibold">
                  Net Sales
                </TableHead>
                <TableHead className="text-bcprimary font-semibold">
                  Gross Profit
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="border bg-bcaccent/30">
              {tableContent.map((product, i) => (
                <TableRow key={i} className="items-center">
                  <TableCell className="first:font-medium last:text-right text-dpaccent">
                    {product.product.name}
                  </TableCell>
                  <TableCell className="text-dpaccent">
                    {product.quantity}
                  </TableCell>
                  <TableCell className="text-dpaccent">
                    {product.receipt.total}
                  </TableCell>
                  <TableCell className="text-dpaccent">
                  <NumericFormat
                      displayType="text"
                      value= {parseInt(product.receipt.total) - parseInt(product.receipt.pajak) - parseInt(product.receipt.diskon)}
                      prefix={"Rp."}
                      thousandSeparator
                    />
                  </TableCell>
                  <TableCell className="text-dpaccent">
                      {parseInt(product.receipt.total) - parseInt(product.receipt.pajak) - parseInt(product.receipt.diskon)}
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
