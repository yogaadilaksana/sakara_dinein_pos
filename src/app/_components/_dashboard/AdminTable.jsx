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

export default function AdminTable({ tableHead, tableContent }) {
  return (
    <ScrollArea className="whitespace-nowrap">
      <Table>
        <TableHeader className="bg-dpprimary">
          <TableRow>
            {tableHead.map((headers, i) => (
              <TableHead
                key={i}
                className="first:w-[260px] last:text-right text-bcprimary"
              >
                {headers}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody className="border">
          {tableContent.map((content, i) => (
            <TableRow key={i} className="">
              {content.details.map((details, i) => (
                <TableCell
                  key={i}
                  className="first:font-medium last:text-right"
                >
                  {details}
                </TableCell>
              ))}
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
