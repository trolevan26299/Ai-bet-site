"use client";

import { fetchOddsData } from "@/api/odds";
import OddsDetail from "@/components/app/odds-detail/odds-detail";
import ScreenInfoMatch from "@/components/app/screen-info-match/screen-info-match";
import MainLayout from "@/layouts/main/layout";
import { useSearchParams } from "next/navigation";
import { IMatchData, IOddsDetail, OddsStatusType } from "@/types/odds.types";
import { transformData } from "@/utils/transformDataOdds";
import { useEffect, useState } from "react";
import { SplashScreen } from "@/components/loading-screen";
import { useTelegram } from "@/context/telegram.provider";
import Image from "next/image";

export default function MatchView() {
  const searchParams = useSearchParams();

  const [odds, setOdds] = useState<IOddsDetail[]>([]);
  const [latestOdds, setLatestOdds] = useState<IOddsDetail[]>([]);
  const [oddsStatus, setOddsStatus] = useState<OddsStatusType>({});
  const [dataScreenInfo, setDataScreenInfo] = useState<IMatchData[]>([]);
  const [loading, setLoading] = useState(true);
  const [endBet, setEndBet] = useState(false);
  const telegram = useTelegram();

  const matchParam = searchParams.get("match");
  const payload = {
    request_id: searchParams.get("request_id"),
    match: matchParam ? matchParam.split(",") : [],
    time: searchParams.get("time") || "next_week",
    league: searchParams.get("league"),
    game_type: "",
    game_detail: "",
    game_scope: "",
    filter_by: "and",
  };

  // useEffect chỉ để fetch và set dữ liệu lần đầu tiên
  useEffect(() => {
    async function fetchAndSetInitialOdds() {
      setLoading(true);
      try {
        const newData = await fetchOddsData(payload);
        const transformedData = transformData(newData);
        setDataScreenInfo(newData);
        setOdds(transformedData as unknown as IOddsDetail[]);
        setLatestOdds(transformedData as unknown as IOddsDetail[]);
        telegram.webApp?.expand();
        setLoading(false);
      } catch (error: any) {
        if (error.message === "Invalid match!") {
          setLoading(false);
          setEndBet(true);
        } else {
          console.log(error);
        }
      }
    }

    fetchAndSetInitialOdds();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    async function fetchAndUpdateOdds() {
      const newData = await fetchOddsData(payload);

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

      if (newData && newData.length > 0) {
        const transformedData = transformData(newData);
        setOdds(latestOdds);
        setDataScreenInfo(newData);
        setLatestOdds(transformedData as unknown as IOddsDetail[]);
        setOddsStatus(newOddsStatus);
      } else {
        console.log("No new data received or data fetch failed");
      }
    }

    const intervalId = setInterval(fetchAndUpdateOdds, 5000);
    return () => clearInterval(intervalId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [latestOdds]);
  return (
    <MainLayout>
      {loading ? (
        <SplashScreen />
      ) : endBet ? (
        <div className="h-[97vh] w-full flex flex-col justify-center items-center">
          <Image src="/assets/ball.png" alt="no-content" className="w-[165px] h-[170px] mr-5" />
          <p className="pt-4 text-base text-slate-500 font-semibold">Trận đấu không tồn tại hoặc đã kết thúc</p>
        </div>
      ) : (
        <div className="p-3">
          <ScreenInfoMatch dataScreenInfo={dataScreenInfo} />
          <OddsDetail odds={odds} oddsStatus={oddsStatus} dataScreenInfo={dataScreenInfo} />
        </div>
      )}
    </MainLayout>
  );
}
