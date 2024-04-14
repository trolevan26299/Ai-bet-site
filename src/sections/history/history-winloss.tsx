import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tabs, TabsList, TabsTriggerDate } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { locale } from "@/utils/configCenlendarToVN";
import { Icon } from "@iconify/react";
import { CalendarIcon } from "@radix-ui/react-icons";
import { addDays, format } from "date-fns";
import React, { useEffect, useState } from "react";
import { DateRange } from "react-day-picker";
import HistoryItem from "./history-item";
import "./index.css";
import { IHistoryBet } from "@/types/history.type";
import { formatDateTime } from "@/utils/time";
import { HOST_API_P88 } from "@/config-global";
import { axiosInstance } from "@/utils/axios";
import { SplashScreen } from "@/components/loading-screen";
import { useTelegram } from "@/context/telegram.provider";

const HistoryWinLoss = () => {
  const telegram = useTelegram();
  const [historyWinLose, setHistoryWinLose] = useState<IHistoryBet[]>([]);
  const [loading, setLoading] = useState(true);
  const fetchBetHistory = async (user_id: number) => {
    const currentDate = new Date();
    const utcCurrentDate = new Date(currentDate.getTime() - currentDate.getTimezoneOffset() * 60000); // Chuyển về UTC0

    const fromDate = new Date(utcCurrentDate.getTime() - 7 * 60 * 60 * 1000); // Trừ đi 7 giờ
    const toDate = new Date(fromDate.getTime() - 29 * 24 * 60 * 60 * 1000); // Lùi lại 29 ngày

    const formattedFromDate = formatDateTime(toDate);
    const formattedToDate = formatDateTime(fromDate);

    const url = `${HOST_API_P88}?betList=SETTLED&fromDate=${formattedFromDate}&toDate=${formattedToDate}`;
    try {
      setLoading(true);
      const response = await axiosInstance.post("proxy/call_api", {
        url,
        method: "GET",
        user_id,
      });
      console.log("response", response);
      setLoading(false);
      if (!response.data || response.data.error) {
        throw new Error("Request failed");
      }
      setHistoryWinLose(response.data.straightBets || []);
    } catch (error) {
      console.error("Error fetching bet history:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (telegram?.user?.id) {
      fetchBetHistory(telegram?.user?.id);
      telegram.webApp?.expand();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [telegram?.user?.id]);

  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(),
    // to: addDays(new Date(2022, 0, 20), 20),
  });
  const setRange = (days: number) => {
    const from = new Date();
    const to = addDays(from, -days);
    setDate({ from, to });
  };
  return (
    <>
      {loading ? (
        <div className="h-[95vh]">
          <SplashScreen />
        </div>
      ) : (
        <div className="px-3 mt-[45px]">
          <Tabs defaultValue="1" className="w-full">
            <TabsList className="scrollable-tabs px-0 w-full rounded-none h-[46px] flex flex-grow justify-between  bg-backgroundColor-main overflow-x-scroll scroll-smooth">
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
                <button
                  id="date"
                  className={`w-full flex  justify-between text-left rounded-full border-none bg-[#28374a] text-text-main text-sm font-medium",
                    ${!date && "text-muted-foreground"}`}
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
                </button>
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
            <p className="text-[12px] w-full ">
              Bạn chỉ có thể xem dữ liệu từ 30 ngày trước, dựa trên múi giờ GMT-04:00.
            </p>
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
              {historyWinLose.map((item: any) => {
                return <HistoryItem key={item.betId} dataDetail={item} />;
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default HistoryWinLoss;
