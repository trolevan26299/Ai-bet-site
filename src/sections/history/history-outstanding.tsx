import React, { useEffect, useState } from "react";
import HistoryItem from "./history-item";
import axios from "axios";
import { axiosInstance } from "@/utils/axios";
import { useTelegram } from "@/context/telegram.provider";
import { HOST_API_P88 } from "@/config-global";
import { IHistoryBet } from "@/types/history.type";
import { SplashScreen } from "@/components/loading-screen";
import Image from "next/image";

const HistoryOutstanding = () => {
  const telegram = useTelegram();
  const [loading, setLoading] = useState(true);
  const [historyOutStanding, setHistoryOutStanding] = useState<IHistoryBet[]>([]);
  const totalBetMoney = historyOutStanding.reduce((total, item) => total + item.risk, 0);
  console.log("historyOutStanding", historyOutStanding);
  const fetchBetHistory = async (user_id: number) => {
    const params = {
      betList: "RUNNING",
      fromDate: "2024-04-10T04:00:00Z",
      toDate: "2024-04-25T03:59:59Z",
    };
    const url = `${HOST_API_P88}?betList=RUNNING&fromDate=${params.fromDate}&toDate=${params.toDate}`;
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
      setHistoryOutStanding(response.data.straightBets || []);
    } catch (error) {
      console.error("Error fetching bet history:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (telegram?.user?.id) {
      fetchBetHistory(telegram?.user?.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [telegram?.user?.id]);
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
                <p className="text-base font-medium">{totalBetMoney}</p>
              </div>
              <div className="flex flex-grow items-center justify-end">
                <p className="text-sm font-normal pr-1">Tổng vé :</p>
                <p className="text-base font-medium">{historyOutStanding.length}</p>
              </div>
            </div>
          </div>
          <div className="px-3 h-full">
            {historyOutStanding.length === 0 ? (
              <div className="w-full h-full">
                <Image src="/assets/no-content.png" alt="no-content" className="w-auto h-auto" />
              </div>
            ) : (
              <div className="mt-[100px] pb-3">
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
