import React, { useEffect } from "react";
import HistoryItem from "./history-item";
import axios from "axios";
import { axiosInstance } from "@/utils/axios";
import { useTelegram } from "@/context/telegram.provider";

const HistoryOutstanding = ({ historyData, user_id }: { historyData: any[]; user_id?: number }) => {
  const telegram = useTelegram();
  // hàm dùng để lấy ra dữ liệu lịch sử cược outstanding của tài khoản
  const fetchBetHistory = async (username: string, password: string) => {
    const url = "https://api.p88.bet/v3/bets?betList=RUNNING&fromDate=2024-04-10T04:00:00Z&toDate=2024-04-30T03:59:59Z";
    const authToken = btoa(`${username}:${password}`);
    const params = {
      betList: "RUNNING",
      fromDate: "2024-04-10T04:00:00Z",
      toDate: "2024-04-25T03:59:59Z",
    };
    try {
      if (telegram?.user?.id) {
        const response = await axiosInstance.post("proxy/call_api", {
          url,
          method: "GET",
          user_id: telegram?.user?.id,
        });

        if (!response) {
          throw new Error("Request failed with status ");
        }

        console.log("response", response);
        // Handle your data here
        // console.log(data);
      }
    } catch (error) {
      console.error("Error fetching bet history:", error);
    }
  };

  useEffect(() => {
    const username = localStorage.getItem("username");
    const password = localStorage.getItem("password");

    if (username && password) {
      fetchBetHistory(username, password);
    }
  }, []);
  return (
    <>
      <div className="fixed top-[46px] h-12 w-full flex flex-grow items-center bg-backgroundColor-main px-3">
        <div className="flex flex-grow items-center text-text-main w-full">
          <div className="flex flex-grow items-center justify-start">
            <p className="text-sm font-normal pr-1">Tổng cược :</p>
            <p className="text-base font-medium">5.00</p>
          </div>
          <div className="flex flex-grow items-center justify-end">
            <p className="text-sm font-normal pr-1">Tổng vé :</p>
            <p className="text-base font-medium">5</p>
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
    </>
  );
};

export default HistoryOutstanding;
