"use client";
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
import { ScrollArea, ScrollBar } from "@/app/_components/ui/scroll-area";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import useToggleUiStore from "@/app/_stores/store";

export default function AdminTable({
  tableHead,
  tableContent,
  type = "",
  setTableContent,
}) {
  const date = new Date();
  const dateDemo = format(date, "eeee, d MMMM yyyy", { locale: id });

  const { setIsModalOpen, setItemName, setItemQty } = useToggleUiStore();

  const handleOpenModal = (data) => {
    setIsModalOpen();
    setItemName(data.details[0]);
    setItemQty(data.details[1]);
  };

  const handleDeleteItem = (id) => {
    setTableContent(tableContent.filter((item) => item.itemId !== id));
  };

  return (
    <ScrollArea className="whitespace-nowrap">
      <Table>
        {type === "transaction" && (
          <TableHeader className="bg-dpprimary border-b-4 border-bcprimary">
            <TableRow>
              <TableHead colSpan={3} className=" text-bcprimary">
                {dateDemo}
              </TableHead>
              <TableHead className="space-x-6 text-right font-semibold text-lg text-bcprimary">
                <span>Total:</span>
                <span>Rp.2.000.000</span>
              </TableHead>
            </TableRow>
          </TableHeader>
        )}
        <TableHeader
          className={`${
            type === "transaction" ? "bg-dpprimary/70" : "bg-dpprimary"
          } border-b-2 border-bcprimary`}
        >
          <TableRow>
            {tableHead.map((headers, i) => (
              <TableHead
                key={i}
                className="first:w-[260px] last:text-right text-bcprimary font-semibold"
              >
                {headers}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody className="border bg-bcaccent/30">
          {tableContent.map((content, i) => (
            <TableRow key={i} className="items-center">
              <>
                {content.details.map((details, i) => (
                  <TableCell
                    key={i}
                    className="first:font-medium last:text-right text-dpaccent"
                  >
                    {details}
                  </TableCell>
                ))}
                {type === "action" && (
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
                )}
              </>
              {/* <TableCell className="font-medium">{invoice.item}</TableCell>
            <TableCell>{invoice.itemSold}</TableCell>
            <TableCell>{invoice.grossSales}</TableCell>
            <TableCell>{invoice.netSales}</TableCell> 
            <TableCell className="text-right">{invoice.grossProfit}</TableCell> */}
            </TableRow>
          ))}
        </TableBody>
        {/* <TableFooter>
        <TableRow>
        <TableCell colSpan={4}>Total</TableCell>
        <TableCell className="text-right">$2,500.00</TableCell>
        </TableRow>
        </TableFooter> */}
      </Table>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}
