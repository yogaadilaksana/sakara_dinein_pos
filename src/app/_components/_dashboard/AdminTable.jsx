"use client";
import { Table } from "@/app/_components/ui/table";
import { ScrollArea, ScrollBar } from "@/app/_components/ui/scroll-area";

export default function AdminTable({ children }) {
  return (
    <ScrollArea className="whitespace-nowrap">
      <Table>{children}</Table>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}
