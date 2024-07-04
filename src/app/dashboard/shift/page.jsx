"use client";
import AdminTable from "@/app/_components/_dashboard/AdminTable";
import Breadcrumb from "@/app/_components/_dashboard/Breadcrumb";
import DatePicker from "@/app/_components/_dashboard/DatePicker";
import { Button } from "@/app/_components/ui/button";
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

const tableContent = [
  {
    shiftId: "wd21sss",
    employee: "Yoga Ganteng Abiez",
    shiftStart: "21/04/2024 08:00",
    shiftEnd: "21/04/2024 23:00",
    totalExpected: 2475500,
    totalActual: 2475500,
    difference: 0,
  },
  {
    shiftId: "grl8ef",
    employee: "Pram Ganteng Abiez",
    shiftStart: "20/04/2024 08:00",
    shiftEnd: "20/04/2024 23:00",
    totalExpected: 2475500,
    totalActual: 2475500,
    difference: 0,
  },
];

function page() {
  return (
    <div className="flex-grow lg:ml-80 mt-28 space-y-10 lg:w-auto w-screen">
      <div className="flex flex-col px-20 ">
        <Breadcrumb routes={routes} />
      </div>
      <div className="space-y-4 w-full px-6">
        <div className="flex justify-between items-center">
          <DatePicker />
          <Button className="bg-dpprimary">Export</Button>
        </div>

        {/* Table */}
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
            {tableContent.map((content, i) => (
              <TableRow key={i} className="items-center">
                <TableCell className="first:font-medium last:text-right text-dpaccent">
                  {content.employee}
                </TableCell>
                <TableCell className="text-dpaccent">
                  {content.shiftStart}
                </TableCell>
                <TableCell className="text-dpaccent">
                  {content.shiftEnd}
                </TableCell>
                <TableCell className="text-dpaccent">
                  <NumericFormat
                    displayType="text"
                    value={content.totalExpected}
                    prefix={"Rp."}
                    thousandSeparator
                  />
                </TableCell>
                <TableCell className="text-dpaccent">
                  <NumericFormat
                    displayType="text"
                    value={content.totalActual}
                    prefix={"Rp."}
                    thousandSeparator
                  />
                </TableCell>
                <TableCell className="last:text-right text-dpaccent">
                  <NumericFormat
                    displayType="text"
                    value={content.difference}
                    prefix={"Rp."}
                    thousandSeparator
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </AdminTable>
      </div>
    </div>
  );
}

export default page;
