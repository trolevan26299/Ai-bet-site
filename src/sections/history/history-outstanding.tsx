import React, { useEffect, useState } from "react";
import HistoryItem from "./history-item";
import axios from "axios";
import { axiosInstance } from "@/utils/axios";
import { useTelegram } from "@/context/telegram.provider";
import { HOST_API_P88 } from "@/config-global";
import { IHistoryBet } from "@/types/history.type";
import { SplashScreen } from "@/components/loading-screen";

const HistoryOutstanding = ({ historyData }: { historyData: any[] }) => {
  const telegram = useTelegram();
  const [loading, setLoading] = useState(false);
  const [historyOutStanding, setHistoryOutStanding] = useState<IHistoryBet[]>([]);
  console.log("historyOutStanding", historyOutStanding);
  const fetchBetHistory = async (user_id: number) => {
    setLoading(true);
    const params = {
      betList: "RUNNING",
      fromDate: "2024-04-10T04:00:00Z",
      toDate: "2024-04-25T03:59:59Z",
    };
    const url = `${HOST_API_P88}?betList=RUNNING&fromDate=${params.fromDate}&toDate=${params.toDate}`;
    try {
      const response = await axiosInstance.post("proxy/call_api", {
        url,
        method: "GET",
        user_id,
      });
      console.log("response", response);
      setHistoryOutStanding(response.data.straightBets);
      setLoading(false);
      if (!response.status) {
        throw new Error("Request failed with status ");
      }
    } catch (error) {
      console.error("Error fetching bet history:", error);
    }
  };

  useEffect(() => {
    if (telegram?.user?.id) {
      fetchBetHistory(telegram?.user?.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      {loading ? (
        <SplashScreen />
      ) : (
        <div>
          <div className="fixed top-[46px] h-12 w-full flex flex-grow items-center bg-backgroundColor-main px-3">
            <div className="flex flex-grow items-center text-text-main w-full">
              <div className="flex flex-grow items-center justify-start">
                <p className="text-sm font-normal pr-1">Tổng cược :</p>
                <p className="text-base font-medium">5.00</p>
              </div>
              <div className="flex flex-grow items-center justify-end">
                <p className="text-sm font-normal pr-1">Tổng vé :</p>
                <p className="text-base font-medium">{historyOutStanding.length}</p>
              </div>
            </div>
          </div>
          <div className="px-3 h-full">
            <div className="mt-[100px] pb-3">
              {historyData.map((item: any) => {
                return <HistoryItem key={item.betId} dataDetail={item} type="outstanding" />;
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default HistoryOutstanding;
