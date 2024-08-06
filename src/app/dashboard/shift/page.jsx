"use client";
import { useEffect, useState } from "react";
import AdminTable from "@/app/_components/_dashboard/AdminTable";
import Breadcrumb from "@/app/_components/_dashboard/Breadcrumb";
import DatePicker from "@/app/_components/_dashboard/DatePicker";
import { Button } from "@/app/_components/ui/button";
import useToggleUiStore from "@/app/_stores/store";
import EmptyTable from "../../_components/_dashboard/EmptyTable";
import * as XLSX from 'xlsx'
import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/_components/ui/table";
import { NumericFormat } from "react-number-format";

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

function Page() {
  const [shifts, setShifts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  const handleGenerateExcel = () =>{
    const shiftDataFormatted = shifts.map(item => ({
      id: item.id,
      user_id: item.user_id,
      user_name: item.users ? item.users.name : 'No User',
      user_email: item.users ? item.users.email : 'No User',
      start_time: new Date(item.start_time).toLocaleString(),
      end_time: item.end_time ? new Date(item.end_time).toLocaleString() : 'Ongoing',
      start_cash: item.start_cash,
      total_expected: item.total_expected,
      total_actual: item.total_actual
    }));

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(shiftDataFormatted)
    XLSX.utils.book_append_sheet(wb, ws, 'Shift Employee')
    XLSX.writeFile(wb, 'shifts_employe_data.xlsx')
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        let url = "/api/shift/adminshift";
        if (selectedDate) {
          const formattedDate = formatDate(selectedDate);
          url = `/api/shift/bydate?startDate=${formattedDate}&endDate=${formattedDate}`;
        }

        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();
          setShifts(data);
          setLoading(false);
        } else {
          console.error('Failed to fetch data:', await response.text());
          setLoading(true); // Set table content to empty array in case of error
          // Set table content to empty array if response is not ok
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error);
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedDate]);
  return (
    <div className="flex-grow lg:ml-80 mt-28 space-y-10 lg:w-auto w-screen">
      <div className="flex flex-col px-20 ">
        <Breadcrumb routes={routes} />
      </div>
      <div className="space-y-4 w-full px-6">
        <div className="flex justify-between items-center">
          <DatePicker />
          <Button onClick={handleGenerateExcel} className="bg-dpprimary">Export</Button>
        </div>
        {shifts.length >0 ?(
          <AdminTable className="overflow-x-auto">
            <TableHeader className={`bg-dpprimary border-b-2 border-bcprimary`}>
              <TableRow>
                <TableHead className="first:w-[260px] text-bcprimary font-semibold">
                  Karyawan
                </TableHead>
                <TableHead className="text-bcprimary font-semibold">
                  Shift Mulai
                </TableHead>
                <TableHead className="text-bcprimary font-semibold">
                  Shift Selesai
                </TableHead>
                <TableHead className="text-bcprimary font-semibold">
                  Ekspetasi Total
                </TableHead>
                <TableHead className="text-bcprimary font-semibold">
                  Total Sebenarnya
                </TableHead>
                <TableHead className="last:text-right text-bcprimary font-semibold">
                  Selisih
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="border bg-bcaccent/30">
              {shifts.map((shift, i) => (
                <TableRow key={i} className="items-center">
                  <TableCell className="first:font-medium last:text-right text-dpaccent">
                    {shift.users ? shift.users.name : 'No User'}
                  </TableCell>
                  <TableCell className="text-dpaccent">
                    {new Date(shift.start_time).toLocaleString()}
                  </TableCell>
                  <TableCell className="text-dpaccent">
                    {new Date(shift.end_time).toLocaleString()}
                  </TableCell>
                  <TableCell className="text-dpaccent">
                    <NumericFormat
                      displayType="text"
                      value={shift.total_expected}
                      prefix={"Rp."}
                      thousandSeparator
                    />
                  </TableCell>
                  <TableCell className="text-dpaccent">
                    <NumericFormat
                      displayType="text"
                      value={shift.total_actual}
                      prefix={"Rp."}
                      thousandSeparator
                    />
                  </TableCell>
                  <TableCell className="last:text-right text-dpaccent">
                    <NumericFormat
                      displayType="text"
                      value={shift.total_actual - shift.total_expected}
                      prefix={"Rp."}
                      thousandSeparator
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </AdminTable>
        ):(<EmptyTable />)}
        {/* Table */}
      </div>
    </div>
  );
}

export default Page;
