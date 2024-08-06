"use client";
import { useEffect, useState } from "react";
import AdminTable from "@/app/_components/_dashboard/AdminTable";
import Breadcrumb from "@/app/_components/_dashboard/Breadcrumb";
import DatePicker from "@/app/_components/_dashboard/DatePicker";
import SalesCard from "@/app/_components/_dashboard/SalesCard";
import { Button } from "@/app/_components/ui/button";
import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/_components/ui/table";
import useToggleUiStore from "@/app/_stores/store";
import { NumericFormat } from "react-number-format";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import EmptyTable from "@/app/_components/_dashboard/EmptyTable";
import * as XLSX from 'xlsx';

const routes = [
  {
    title: "Beranda",
    path: "/dashboard",
  },
  {
    title: "Transaksi",
    path: "/dashboard/transaksi",
  },
];
//fungsi tambahan
const formatTime = (dateTime) => {
  const date = new Date(dateTime);
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
};

function Page() {
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

  const handleGenerateExcel = () => {
    // Format data for Excel
    const formattedData = tableContent.map(item => ({
      id: item.id,
      receipt_id: item.receipt_id,
      product_id: item.product_id,
      quantity: item.quantity,
      subtotal: item.subtotal,
      receipt_date_time: new Date(item.receipt.date_time).toLocaleString(),
      receipt_total: item.receipt.total,
      receipt_diskon: item.receipt.diskon,
      receipt_pajak: item.receipt.pajak,
      product_name: item.product.name,
      product_price: item.product.price
    }));

    const salesSummaryFormattedData = salesSummary.map(item => ({
      title: item.title,
      type: item.type,
      desc: item.desc
    }));
    // Create a new workbook and worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(formattedData);
    XLSX.utils.book_append_sheet(wb, ws, 'Transactions');
    
    const wsSalesSummary = XLSX.utils.json_to_sheet(salesSummaryFormattedData);
    XLSX.utils.book_append_sheet(wb, wsSalesSummary, 'Sales Summary');

    // Write file and trigger download
    XLSX.writeFile(wb, 'transaction_data.xlsx');
  };

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

  // const totalItemPrice = 28000
  const totalItemPrice = tableContent.reduce((prevValue, currValue) => {
    return parseInt(prevValue) + parseInt(currValue.subtotal);
  }, 0);
  // console.log(totalItemPrice);

  const formatDated = (date) => {
    if (!date) return "";
    return format(date, "eeee, d MMMM yyyy", { locale: id });
  };

  return (
    <div className="flex-grow lg:ml-80 mt-28 space-y-14 lg:w-auto w-screen">
      <div className="flex flex-col space-y-7 px-20 ">
        <Breadcrumb routes={routes} />
        <SalesCard salesSummary={salesSummary} />
      </div>

      {tableContent.length > 0 ? (
        <div className="space-y-4 w-full px-6">
          <div className="flex justify-between items-center">
            <DatePicker />
            <Button onClick={handleGenerateExcel} className="bg-dpprimary">Export</Button>
          </div>

          {/* Table */}
          <AdminTable className="overflow-x-auto">
            <TableHeader className="bg-dpprimary border-b-4 border-bcprimary">
              <TableRow>
                <TableHead colSpan={3} className=" text-bcprimary">
                  {selectedDate === ""
                    ? "Hari Sekarang"
                    : formatDated(selectedDate)}
                </TableHead>
                <TableHead className="space-x-6 text-right font-semibold text-lg text-bcprimary">
                  <span className="font-normal text-base">Total:</span>
                  <NumericFormat
                    displayType="text"
                    value={totalItemPrice}
                    prefix={"Rp."}
                    thousandSeparator
                  />
                  {/* <span>Rp.2.000.000</span> */}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableHeader
              className={`bg-dpprimary/70 border-b-2 border-bcprimary`}
            >
              <TableRow>
                <TableHead className="first:w-[260px] text-bcprimary font-semibold">
                  Jam
                </TableHead>
                <TableHead className="text-bcprimary font-semibold">
                  Pelanggan
                </TableHead>
                <TableHead className="text-bcprimary font-semibold">
                  Produk
                </TableHead>
                <TableHead className="last:text-right text-bcprimary font-semibold">
                  Harga
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="border bg-bcaccent/30">
              {tableContent.map((content, i) => (
                <TableRow key={i} className="items-center">
                  <TableCell className="first:font-medium last:text-right text-dpaccent">
                    {formatTime(content.receipt.date_time)}
                  </TableCell>
                  <TableCell className="text-dpaccent">
                    {content.receipt.payment.payment_name}
                  </TableCell>
                  <TableCell className="text-dpaccent">
                    {content.product.name}
                  </TableCell>
                  <TableCell className="last:text-right text-dpaccent">
                    <NumericFormat
                      displayType="text"
                      value={content.receipt.total}
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

export default Page;
