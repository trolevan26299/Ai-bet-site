import React from "react";
import HistoryItem from "./history-item";
import { Icon } from "@iconify/react";
import { Tabs, TabsList, TabsTriggerDate } from "@/components/ui/tabs";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import "./index.css";
import { CalendarIcon } from "@radix-ui/react-icons";
import { addDays, format } from "date-fns";
import { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const HistoryWinLoss = ({ historyData }: { historyData: any[] }) => {
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: new Date(2022, 0, 20),
    to: addDays(new Date(2022, 0, 20), 20),
  });
  return (
    <div className="mt-12 px-3">
      <Tabs defaultValue="1" className="w-full">
        <TabsList className="scrollable-tabs w-full rounded-none h-[46px] flex flex-grow justify-between  bg-backgroundColor-main overflow-x-scroll scroll-smooth">
          <TabsTriggerDate value="1">Hôm nay</TabsTriggerDate>
          <TabsTriggerDate value="2">Hôm qua</TabsTriggerDate>
          <TabsTriggerDate value="3">7 ngày trước </TabsTriggerDate>
          <TabsTriggerDate value="4">14 ngày trước</TabsTriggerDate>
          <TabsTriggerDate value="5">30 ngày trước</TabsTriggerDate>
        </TabsList>
      </Tabs>
      <div className="grid gap-2 w-full">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id="date"
              variant={"outline"}
              className={cn(
                "w-full flex  justify-between text-left rounded-full border-none bg-[#28374a] text-text-main text-sm font-medium",
                !date && "text-muted-foreground"
              )}
            >
              {date?.from ? (
                date.to ? (
                  <>
                    {format(date.from, "dd LLL, y")} - {format(date.to, "dd LLL, y")}
                  </>
                ) : (
                  format(date.from, "LLL dd, y")
                )
              ) : (
                <span>Pick a date</span>
              )}
              <CalendarIcon className="mr-2 h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-0 w-full bg-[#28374a] text-text-main" align="center">
            <Calendar
              className="w-full"
              initialFocus
              mode="range"
              defaultMonth={date?.from}
              selected={date}
              onSelect={setDate}
              numberOfMonths={1}
            />
          </PopoverContent>
        </Popover>
      </div>
      {/* <div className="flex flex-grow items-center text-text-main w-full">
          <div className="flex flex-grow items-center justify-start">
            <p className="text-sm font-normal pr-1">Tổng cược :</p>
            <p className="text-base font-medium">5.00</p>
          </div>
          <div className="flex flex-grow items-center justify-end">
            <p className="text-sm font-normal pr-1">Tổng vé :</p>
            <p className="text-base font-medium">5</p>
          </div>
        </div> */}

      {/* <div className="px-3 h-full">
        <div className="mt-[100px] pb-3">
          {historyData.map((item: any) => {
            return <HistoryItem key={item.betId} dataDetail={item} type="outstanding" />;
          })}
        </div>
      </div> */}
    </div>
  );
};

export default HistoryWinLoss;
