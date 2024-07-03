"use client";
// import { CalendarIcon } from "@radix-ui/react-icons
import { FiCalendar } from "react-icons/fi";
import { format } from "date-fns";

import { cn } from "@/app/_lib/utils";
import { Button } from "@/app/_components/ui/button";
import { Calendar } from "@/app/_components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/app/_components/ui/popover";
import { useState } from "react";

export default function DatePicker() {
  const [date, setDate] = useState();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[160px] justify-evenly text-right gap-4 items-center bg-bcsecondary"
          )}
        >
          <span
            className={`${
              date
                ? "text-dpaccent font-normal"
                : "text-dpprimary/50 font-light"
            }`}
          >
            {date ? format(date, "dd/MM/yyyy") : "Pilih tanggal"}
          </span>
          <FiCalendar className="h-4 w-4 focus:text-dpaccent " />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          initialFocus
          disabled={(date) =>
            date > new Date() || date < new Date("1900-01-01")
          }
        />
      </PopoverContent>
    </Popover>
  );
}
