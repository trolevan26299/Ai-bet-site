import { SplashScreen } from "@/components/loading-screen";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tabs, TabsList, TabsTriggerDate } from "@/components/ui/tabs";
import { useTelegram } from "@/context/telegram.provider";
import { IHistoryBet } from "@/types/history.type";
import { locale } from "@/utils/configCenlendarToVN";
import { formatRangeTime } from "@/utils/time";
import { Icon } from "@iconify/react";
import { CalendarIcon } from "@radix-ui/react-icons";
import * as PopoverRD from "@radix-ui/react-popover";
import axios from "axios";
import { addDays, addWeeks, endOfWeek, format, set, startOfDay, startOfWeek } from "date-fns";
import Image from "next/image";
import { useSearchParams, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { DateRange } from "react-day-picker";
import { getCurrentUtcTimeUTCMinus4 } from "../../utils/currentTimeUTC-4";
import { formatNumber, formatNumberAndFloor } from "../../utils/formatNumber";
import HistoryItem from "./history-item";
import "./index.css";

const HistoryWinLoss = () => {
  const telegram = useTelegram();
  const searchParams = useSearchParams();
  const fromDateParam = searchParams.get("from_date");
  const toDateParam = searchParams.get("to_date");
  const timeParam = searchParams.get("time");
  const [historyWinLose, setHistoryWinLose] = useState<IHistoryBet[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectTime, setSelectTime] = useState<Boolean>(true);
  const [date, setDate] = useState<DateRange | undefined>(
    fromDateParam && toDateParam
      ? { from: new Date(fromDateParam), to: new Date(toDateParam) }
      : {
          from: getCurrentUtcTimeUTCMinus4(),
        }
  );

  const [selectedDate, setSelectedDate] = useState<DateRange | undefined>(date);
  console.log("fromDateParam", fromDateParam);
  console.log("toDateParam", toDateParam);
  console.log("date", date);
  // tab onclick time
  const handleSetTabTime = (time: string) => {
    if (time === "today") {
      return "0";
    } else if (time === "yesterday") {
      return "1";
    } else if (time === "this_week") {
      return "7";
    } else if (time === "last_week") {
      return "-7";
    } else if (time === "l_14_days") {
      return "14";
    }
  };

  const [tab, setTabs] = useState(
    timeParam ? handleSetTabTime(timeParam) : fromDateParam && !timeParam ? undefined : "0"
  );
  const fetchBetHistory = async (user_id: number) => {
    const fromDate = date?.from || getCurrentUtcTimeUTCMinus4();
    const toDay = date?.to || fromDate;
    const formattedFromDate = selectTime ? formatRangeTime(fromDate, "from") : fromDateParam;
    const formattedToDate = selectTime ? formatRangeTime(toDay, "today") : toDateParam;

    const url = `?betList=SETTLED&fromDate=${formattedFromDate}&toDate=${formattedToDate}`;
    try {
      setLoading(true);
      const response = await axios.post("/api/history", {
        url,
        method: "GET",
        user_id,
      });
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

  // tổng cược
  const totalBetMoney = historyWinLose.reduce((total, item) => {
    const stake = item.price > 0 ? item.risk : item.risk / -item.price;
    return total + stake;
  }, 0);
  // tổng hoa hồng
  const totalCommission = historyWinLose.reduce((total, item) => total + item.customerCommission, 0);
  // tổng thắng thua
  const totalWinLoss = historyWinLose.reduce((total, item) => total + (item?.winLoss || 0), 0);

  const setRange = (days: number) => {
    const from = addDays(getCurrentUtcTimeUTCMinus4(), -days);
    const to = getCurrentUtcTimeUTCMinus4();
    setDate({ from, to });
  };
  const handleTabClick = (days: number) => {
    setSelectTime(true);
    const currentDate = getCurrentUtcTimeUTCMinus4();
    if (days !== 0 && days !== 7 && days !== -7 && days !== 1) {
      setTabs(days.toString());
      setRange(days);
    } else {
      setTabs(days.toString());
      if (days === 0) {
        setDate({ from: currentDate });
      } else if (days === 1) {
        const from = startOfDay(addDays(currentDate, -1));
        setDate({ from });
      } else if (days === 7) {
        const from = addDays(startOfWeek(currentDate), 1);
        const to = addDays(endOfWeek(currentDate), 1);
        setDate({ from, to });
      } else if (days === -7) {
        const from = addDays(startOfWeek(addWeeks(currentDate, -1)), 1);
        const to = addDays(endOfWeek(addWeeks(currentDate, -1)), 1);
        setDate({ from, to });
      }
    }
  };
  const handleSaveDateCalendar = () => {
    setDate(selectedDate);
  };

  // useEffect(() => {
  //   if (telegram?.user?.id) {
  //     fetchBetHistory(telegram?.user?.id);
  //     telegram.webApp?.expand();
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [telegram?.user?.id, date]);
  useEffect(() => {
    fetchBetHistory(6359530967);
    telegram.webApp?.expand();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date]);
  useEffect(() => {
    if (fromDateParam || toDateParam) {
      setSelectTime(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      {loading ? (
        <div className="h-[95vh]">
          <SplashScreen />
        </div>
      ) : (
        <div className="px-3 mt-[45px] h-full">
          <Tabs defaultValue={tab} value={tab} className="w-full">
            <TabsList className="scrollable-tabs px-0 w-full rounded-none h-[46px] flex flex-grow justify-between  bg-backgroundColor-main overflow-x-scroll scroll-smooth">
              {[
                { label: "Hôm nay", days: 0 },
                { label: "Hôm qua", days: 1 },
                { label: "Tuần này", days: 7 },
                { label: "Tuần trước", days: -7 },
                { label: "14 ngày trước", days: 14 },
                { label: "30 ngày trước", days: 30 },
              ].map((item, index) => (
                <TabsTriggerDate key={index} value={item.days.toString()} onClick={() => handleTabClick(item.days)}>
                  {item.label}
                </TabsTriggerDate>
              ))}
            </TabsList>
          </Tabs>
          <div className="grid gap-2 w-full">
            <Popover>
              <PopoverTrigger asChild>
                <button
                  id="date"
                  className={`w-full flex  justify-between items-center h-8 px-[10px] text-left rounded-full border-none bg-[#28374a] text-text-main text-sm font-medium",
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
              <PopoverContent className="p-0 w-full bg-[rgba(40,55,74,1)] " align="center">
                <Calendar
                  className="w-full rounded-2xl"
                  initialFocus
                  mode="range"
                  defaultMonth={selectedDate?.from}
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  numberOfMonths={1}
                  locale={locale}
                />
                <div className="flex flex-row justify-end items-center mr-7 gap-7 pb-2 text-sm">
                  <PopoverRD.Close>
                    <button className=" text-[#006ef8] font-semibold" onClick={handleSaveDateCalendar}>
                      Xác nhận
                    </button>
                  </PopoverRD.Close>
                </div>
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
                <p className="text-base font-medium">{formatNumberAndFloor(totalBetMoney)}</p>
              </div>
              <div className="flex flex-grow items-center justify-end">
                <p className="text-sm font-normal pr-1">Thắng/Thua :</p>
                <p
                  className={`text-base font-medium ${
                    totalWinLoss > 0 ? "text-[#34c759]" : totalWinLoss < 0 ? "text-[#ff453a]" : "text-[#fff]"
                  }`}
                >
                  {formatNumber(totalWinLoss)}
                </p>
              </div>
            </div>
            <div className="flex flex-grow justify-between items-center w-full">
              <div className="flex flex-grow items-center justify-start  w-1/2">
                <p className="text-sm font-normal pr-1">Tổng vé :</p>
                <p className="text-base font-medium">{historyWinLose.length}</p>
              </div>
              <div className="flex flex-grow items-center justify-end">
                <p className="text-sm font-normal pr-1">Tổng hoa hồng :</p>
                <p className="text-base font-medium">{formatNumber(totalCommission)}</p>
              </div>
            </div>
          </div>

          <div className="h-full">
            {historyWinLose.length === 0 ? (
              <div className="h-full  flex flex-col justify-center items-center mt-[30%]">
                <Image
                  src="/assets/no-content.png"
                  alt="no-content"
                  width={165}
                  height={170}
                  className=" h-[170px] mr-5"
                />
                <p className="pt-4 text-base text-slate-500 font-semibold">Không có vé cược nào</p>
              </div>
            ) : (
              <div className="pb-3">
                {historyWinLose.map((item: any) => {
                  return <HistoryItem key={item.betId} dataDetail={item} />;
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default HistoryWinLoss;
