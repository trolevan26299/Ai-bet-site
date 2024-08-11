import { SplashScreen } from "@/components/loading-screen";
import { useTelegram } from "@/store/provider/telegram.provider";
import { IHistoryBet } from "@/types/history.type";
import { fCurrencyP88 } from "@/utils/formatNumber";
import { formatDateTime } from "@/utils/time";
import axios from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";
import HistoryItem from "./history-item";

const HistoryOutstanding = () => {
  const telegram = useTelegram();
  const [loading, setLoading] = useState(true);
  const [historyOutStanding, setHistoryOutStanding] = useState<IHistoryBet[]>([]);

  // tổng cược
  const totalBetMoney = historyOutStanding.reduce((total, item) => {
    return total + item.risk;
  }, 0);

  const fetchBetHistory = async (user_id: number) => {
    const currentDate = new Date();
    const utcCurrentDate = new Date(currentDate.getTime() - currentDate.getTimezoneOffset() * 60000); // Chuyển về UTC0

    // Khoảng thời gian hiện tại (30 ngày)
    const fromDate1 = new Date(utcCurrentDate.getTime() - 7 * 60 * 60 * 1000);
    const toDate1 = new Date(fromDate1.getTime() - 29 * 24 * 60 * 60 * 1000);

    // Khoảng thời gian 30 ngày trước (60-90 ngày trước)
    const fromDate2 = new Date(toDate1.getTime() - 1); // Bắt đầu từ ngày cuối của khoảng thời gian trước
    const toDate2 = new Date(fromDate2.getTime() - 29 * 24 * 60 * 60 * 1000);

    // Khoảng thời gian 30 ngày sau (0-30 ngày sau)
    const fromDate3 = new Date(fromDate1.getTime() + 30 * 24 * 60 * 60 * 1000);
    const toDate3 = new Date(fromDate3.getTime() + 29 * 24 * 60 * 60 * 1000);

    const formattedFromDate1 = formatDateTime(toDate1);
    const formattedToDate1 = formatDateTime(fromDate1);

    const formattedFromDate2 = formatDateTime(toDate2);
    const formattedToDate2 = formatDateTime(fromDate2);

    const formattedFromDate3 = formatDateTime(fromDate3);
    const formattedToDate3 = formatDateTime(toDate3);

    const urls = [
      `?betList=RUNNING&fromDate=${formattedFromDate1}&toDate=${formattedToDate1}`,
      `?betList=RUNNING&fromDate=${formattedFromDate2}&toDate=${formattedToDate2}`,
      `?betList=RUNNING&fromDate=${formattedFromDate3}&toDate=${formattedToDate3}`,
    ];

    try {
      setLoading(true);

      const requests = urls.map((url) => axios.post("api/history", { url, method: "GET", user_id }));

      const responses = await Promise.all(requests);

      const allBets = responses.flatMap((response) => {
        if (!response.data || response.data.error) {
          throw new Error("Request failed");
        }
        return response.data.straightBets || [];
      });

      // Lọc ra các vé cược không có betStatus là "PENDING_ACCEPTANCE"
      const filteredBets = allBets.filter((bet: any) => bet.betStatus !== "PENDING_ACCEPTANCE");

      setHistoryOutStanding(filteredBets);
    } catch (error) {
      console.error("Error fetching bet history: ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (telegram?.user?.id) {
      fetchBetHistory(telegram?.user?.id);
      telegram.webApp?.expand();
      telegram.webApp?.isClosingConfirmationEnabled === true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [telegram?.user?.id]);

  return (
    <>
      {loading ? (
        <div className="h-[95vh]">
          <SplashScreen />
        </div>
      ) : (
        <div className="h-full">
          <div className="fixed top-[46px] h-12 w-full flex flex-grow items-center bg-backgroundColor-main px-3">
            <div className="flex flex-grow items-center text-text-main w-full">
              <div className="flex flex-grow items-center justify-start">
                <p className="text-sm font-normal pr-1">Tổng cược :</p>
                <p className="text-base font-medium">{fCurrencyP88(totalBetMoney)}</p>
              </div>
              <div className="flex flex-grow items-center justify-end">
                <p className="text-sm font-normal pr-1">Tổng vé :</p>
                <p className="text-base font-medium">{historyOutStanding.length}</p>
              </div>
            </div>
          </div>
          <div className="px-3 h-full">
            {historyOutStanding.length === 0 ? (
              <div className="h-[100%] mt-[50%]  flex flex-col justify-center items-center">
                <Image src="/assets/no-content.png" alt="no-content" width={165} height={170} className=" mr-5" />
                <p className="pt-4 text-base text-slate-500 font-semibold">Không có vé cược nào</p>
              </div>
            ) : (
              <div className="mt-[100px] pb-3 mb-[55px]">
                {historyOutStanding.map((item: any) => {
                  return <HistoryItem key={item.betId} dataDetail={item} type="outstanding" />;
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default HistoryOutstanding;
