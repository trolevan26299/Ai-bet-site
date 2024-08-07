"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({ className, classNames, showOutsideDays = true, ...props }: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0 ",
        month: "space-y-4  ",
        caption: "flex justify-center pt-1 relative items-center text-[#fff]",
        caption_label: "text-sm font-medium",
        nav: "space-x-1 flex items-center text-[#fff]  pb-3 pt-1",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-10 w-10 bg-transparent p-0 opacity-50 hover:opacity-100"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1 ",
        table: "w-full border-collapse space-y-1 ",
        head_row: "flex justify-around",
        head_cell: "text-[#fff] rounded-md w-10 font-normal text-[0.8rem] justify-around",
        row: "flex w-full mt-2 justify-around",
        cell: "text-[rgba(235,235,235,0.6)] h-10 w-10 text-center text-sm p-0 relative  [&:has([aria-selected].day-outside)]:bg-[#4181ff] [&:has([aria-selected])]:bg-[#4181ff] first:[&:has([aria-selected])]:rounded-l-md  last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
        day: cn(buttonVariants({ variant: "ghost" }), "h-10 w-10 p-0 font-normal aria-selected:opacity-100"),
        day_range_end: "day-range-end",
        day_selected:
          "bg-[#4181ff] text-[#fff] hover:bg-[#4181ff] hover:text-[#fff] focus:bg-[#4181ff] focus:text-[#fff]",
        // day_today: "bg-accent text-accent-foreground",
        day_outside: "day-outside text-[rgba(235,235,245,0.6)]  aria-selected:bg-[#4181ff] aria-selected:text-[#fff] ",
        day_disabled: "text-[rgba(235,235,245,0.6)]",
        day_range_middle: "aria-selected:bg-[#4181ff] aria-selected:text-[#fafafa]",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ ...props }) => <ChevronLeft className="h-4 w-4" />,
        IconRight: ({ ...props }) => <ChevronRight className="h-4 w-4" />,
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
