"use client";
// import { CalendarIcon } from "@radix-ui/react-icons
import { FiCalendar } from "react-icons/fi";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { cn } from "@/app/_lib/utils";
import { Button } from "@/app/_components/ui/button";
import { Calendar } from "@/app/_components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/app/_components/ui/popover";
import { useToggleUiStore } from "@/app/_stores/store";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function DatePicker() {
  const { selectedDate, setSelectedDate } = useToggleUiStore();
  const pathName = usePathname();

  useEffect(() => {
    setSelectedDate("");
  }, [pathName]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "min-w-[180px] justify-evenly gap-3 items-center bg-bcsecondary"
          )}
        >
          <span
            className={`${
              selectedDate
                ? "text-dpaccent font-normal"
                : "text-dpprimary/50 font-light"
            }`}
          >
            {selectedDate
              ? format(selectedDate, "eeee, d MMMM yyyy", { locale: id })
              : "Pilih tanggal"}
          </span>
          <FiCalendar className="h-4 w-4 focus:text-dpaccent text-dpaccent " />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={(date) => setSelectedDate(date)}
          initialFocus
          disabled={(date) =>
            date > new Date() || date < new Date("1900-01-01")
          }
        />
      </PopoverContent>
    </Popover>
  );
}
