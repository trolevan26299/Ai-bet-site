"use client";

import OddsDetail from "@/components/app/odds-detail/odds-detail";
import ScreenInfoMatch from "@/components/app/screen-info-match/screen-info-match";
import { SplashScreen } from "@/components/loading-screen";
import { useTelegram } from "@/context/telegram.provider";
import MainLayout from "@/layouts/main/layout";
import { IMatchData, IOddsDetail, OddsStatusType } from "@/types/odds.types";
import { transformData } from "@/utils/transformDataOdds";
import axios from "axios";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import "./odds.css";
import { isIOS } from "react-device-detect";

export default function MatchView() {
  const searchParams = useSearchParams();
  const isIphone = isIOS;
  const [odds, setOdds] = useState<IOddsDetail[]>([]);
  const [latestOdds, setLatestOdds] = useState<IOddsDetail[]>([]);
  const [oddsStatus, setOddsStatus] = useState<OddsStatusType>({});
  const [dataScreenInfo, setDataScreenInfo] = useState<IMatchData[]>([]);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [endBet, setEndBet] = useState(false);
  const telegram = useTelegram();

  const matchParam = searchParams.get("match");
  const lineParam = searchParams.get("line");

  const payload = {
    request_id: searchParams.get("request_id"),
    match: matchParam ? matchParam.split(",") : [],
    time: searchParams.get("time") || "next_week",
    from_date: searchParams.get("from_date"),
    to_date: searchParams.get("to_date"),
    league: searchParams.get("league"),
    game_type: "",
    game_detail: "",
    game_scope: "",
    filter_by: "and",
  };
  const handleIframeLoad = () => {
    console.log("đã load xong");
    setIframeLoaded(true);
  };

  useEffect(() => {
    async function fetchAndSetInitialOdds() {
      setLoading(true);
      try {
        const res = await axios.post("/api/odds", payload);
        console.log("response:", res);
        if (
          res.data.message === "Invalid match!" ||
          res.data.message === "Invalid league!" ||
          res.data.message === "Request or user not found!" ||
          res.data.message === "Event not found!" ||
          res.data.length === 0
        ) {
          setEndBet(true);
        } else {
          const transformedData = transformData(res.data, lineParam ?? "3");
          setDataScreenInfo(res.data);
          setOdds(transformedData as unknown as IOddsDetail[]);
          setLatestOdds(transformedData as unknown as IOddsDetail[]);
        }
        telegram.webApp?.expand();
      } catch (error: any) {
        console.log("error:", error);
        setEndBet(true);
      } finally {
        setLoading(false);
      }
    }

    fetchAndSetInitialOdds();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    async function fetchAndUpdateOdds() {
      try {
        const newData = await axios.post("/api/odds", payload);
        if (newData && newData.data.length > 0) {
          const transformedData = transformData(newData.data, lineParam ?? "3");
          console.log("latestOdds:", latestOdds);
          setOdds(latestOdds.length > 0 ? latestOdds : (transformedData as unknown as IOddsDetail[]));
          setDataScreenInfo(newData.data);
          setLatestOdds(transformedData as unknown as IOddsDetail[]);

          const newOddsStatus: OddsStatusType = {};
          latestOdds?.forEach((latestOdd, index) => {
            latestOdd.detail?.forEach((latestDetail, detailIndex) => {
              latestDetail?.forEach((latestOddDetail, oddDetailIndex) => {
                const key = `${index}-${detailIndex}-${oddDetailIndex}`;
                const oldValue = odds[index]?.detail[detailIndex][oddDetailIndex]?.value;
                const newValue = latestOddDetail.value;
                if (newValue > oldValue) {
                  newOddsStatus[key] = "green";
                } else if (newValue < oldValue) {
                  newOddsStatus[key] = "red";
                } else {
                  newOddsStatus[key] = "none";
                }
              });
            });
          });

          setOddsStatus(newOddsStatus);
          if (endBet) {
            setEndBet(false);
          }
        } else {
          setLatestOdds([]);
          setEndBet(true);
          console.log("No new data received or data fetch failed!");
        }
      } catch (error) {
        setEndBet(true);
        console.error("Error fetching data:", error);
      }
    }

    const intervalId = setInterval(fetchAndUpdateOdds, 10000);
    return () => clearInterval(intervalId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [latestOdds, endBet]);
  return (
    <MainLayout>
      {loading ? (
        <SplashScreen />
      ) : endBet ? (
        <div className="h-[97vh] w-full flex flex-col justify-center items-center">
          <Image src="/assets/ball.png" alt="no-content" className="w-[165px] h-[170px] mr-5" />
          <p className="pt-4 text-xl text-slate-500 font-semibold">Không tìm thấy thông tin trận đấu</p>
          <p className="pt-2 text-base text-slate-500 font-semibold">Trận đấu có thể không tồn tại hoặc đã kết thúc</p>
          <span className="pt-2 text-sm text-slate-500 font-semibold">
            Vui lòng quay lại Telegram và xem các sự kiện khác
          </span>
        </div>
      ) : (
        <>
          <div className="p-3 pb-6 h-full">
            <ScreenInfoMatch dataScreenInfo={dataScreenInfo} />
            {iframeLoaded && (
              <div className="w-full">
                <iframe
                  scrolling="no"
                  src="https://start26.sptpub.com/tracker.html?eventId=45843693&sportId=1&lang=vi&liveEvent=true&providers=Betradar"
                  allowFullScreen
                  onLoad={handleIframeLoad}
                  title="rindle"
                  style={{ border: 0, width: "100%", height: "354px", borderRadius: "5px" }}
                ></iframe>
              </div>
            )}
            <OddsDetail odds={odds} oddsStatus={oddsStatus} dataScreenInfo={dataScreenInfo} />
          </div>
          {odds.every((odd) => odd.status === 2) && (
            <div
              className={`z-10 text-yellow-400 bottom-0 text-center fixed m-auto rounded-sm flex items-center flex-row justify-center flex-wrap w-full pt-1 ${
                isIphone ? "pb-4" : "pb-1"
              } px-2`}
              style={{ backgroundColor: "rgba(0, 0, 0, 0.5)", boxShadow: "0 0 10px rgba(0, 0, 0, 0.5)" }}
            >
              <p className="text-[13px] w-full">
                ⚠️ Kèo Quý khách chọn hiện không khả dụng. <br /> Vui lòng đợi trong giây lát hoặc chọn trận đấu khác.
              </p>
            </div>
          )}
        </>
      )}
    </MainLayout>
  );
}
