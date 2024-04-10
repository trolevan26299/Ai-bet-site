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
import { locale } from "@/utils/configCenlendarToVN";

const HistoryWinLoss = ({ historyData }: { historyData: any[] }) => {
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: new Date(),
    // to: addDays(new Date(2022, 0, 20), 20),
  });
  const setRange = (days: number) => {
    const from = new Date();
    const to = addDays(from, -days);
    setDate({ from, to });
  };
  return (
    <div className="mt-12 px-3">
      <Tabs defaultValue="1" className="w-full">
        <TabsList className="scrollable-tabs w-full rounded-none h-[46px] flex flex-grow justify-between  bg-backgroundColor-main overflow-x-scroll scroll-smooth">
          <TabsTriggerDate value="1" onClick={() => setDate({ from: new Date() })}>
            Hôm nay
          </TabsTriggerDate>
          <TabsTriggerDate value="2" onClick={() => setRange(1)}>
            Hôm qua
          </TabsTriggerDate>
          <TabsTriggerDate value="3" onClick={() => setRange(7)}>
            7 ngày trước
          </TabsTriggerDate>
          <TabsTriggerDate value="4" onClick={() => setRange(14)}>
            14 ngày trước
          </TabsTriggerDate>
          <TabsTriggerDate value="5" onClick={() => setRange(30)}>
            30 ngày trước
          </TabsTriggerDate>
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
                    {format(date.from, "dd/MM/y")} - {format(date.to, "dd/MM/y")}
                  </>
                ) : (
                  format(date.from, "dd/MM/y")
                )
              ) : (
                <span>Vui lòng chọn ngày</span>
              )}
              <CalendarIcon className="mr-2 h-5 w-5" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-0 w-full" align="center">
            <Calendar
              className="w-full rounded-2xl"
              initialFocus
              mode="range"
              defaultMonth={date?.from}
              selected={date}
              onSelect={setDate}
              numberOfMonths={1}
              locale={locale}
            />
          </PopoverContent>
        </Popover>
      </div>
      <div className="flex flex-row gap-2  w-full  text-[#ffe665] pt-1 h-5 item-start">
        <Icon icon="icon-park-solid:attention" className="w-5 mt-1" />
        <p className="text-[12px] w-full ">Bạn chỉ có thể xem dữ liệu từ 30 ngày trước, dựa trên múi giờ GMT-04:00.</p>
      </div>
      <div className="flex flex-col justify-start items-start text-[#fafafa] pt-7">
        <div className="flex flex-grow justify-between items-center w-full">
          <div className="flex flex-grow items-center justify-start w-1/2">
            <p className="text-sm font-normal pr-1">Tổng cược :</p>
            <p className="text-base font-medium">5.00</p>
          </div>
          <div className="flex flex-grow items-center justify-end">
            <p className="text-sm font-normal pr-1">Thắng/Thua :</p>
            <p className="text-base font-medium text-[#ff453a]">-1.5</p>
          </div>
        </div>
        <div className="flex flex-grow justify-between items-center w-full">
          <div className="flex flex-grow items-center justify-start  w-1/2">
            <p className="text-sm font-normal pr-1">Tổng vé :</p>
            <p className="text-base font-medium">5</p>
          </div>
          <div className="flex flex-grow items-center justify-end">
            <p className="text-sm font-normal pr-1">Tổng hoa hồng :</p>
            <p className="text-base font-medium">1.2</p>
          </div>
        </div>
      </div>

      <div className="h-full">
        <div className="pb-3">
          {historyData.map((item: any) => {
            return <HistoryItem key={item.betId} dataDetail={item} />;
          })}
        </div>
      </div>
    </div>
  );
};

export default HistoryWinLoss;
