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

export default function MatchView() {
  const searchParams = useSearchParams();

  const [odds, setOdds] = useState<IOddsDetail[]>([]);
  const [latestOdds, setLatestOdds] = useState<IOddsDetail[]>([]);
  const [live, setLive] = useState(false);
  const [oddsStatus, setOddsStatus] = useState<OddsStatusType>({});
  const [dataScreenInfo, setDataScreenInfo] = useState<IMatchData[]>([]);
  const [loading, setLoading] = useState(true);
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
      const newData: IMatchData[] = await fetchOddsData(payload);
      const transformedData = transformData(newData);
      setDataScreenInfo(newData);
      setOdds(transformedData as unknown as IOddsDetail[]);
      setLatestOdds(transformedData as unknown as IOddsDetail[]);
      setLive(newData[0].liveStatus);
      telegram.webApp?.expand();
      setLoading(false);
    }

    fetchAndSetInitialOdds();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    async function fetchAndUpdateOdds() {
      const newData = await fetchOddsData(payload);
      const transformedData = transformData(newData);

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

      setOdds(latestOdds);
      setDataScreenInfo(newData);
      setLatestOdds(transformedData as unknown as IOddsDetail[]);
      setLive(newData[0].liveStatus);
      setOddsStatus(newOddsStatus);
    }

    const intervalId = setInterval(fetchAndUpdateOdds, 5000);
    return () => clearInterval(intervalId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [latestOdds]);
  return (
    <MainLayout>
      {loading ? (
        <SplashScreen />
      ) : (
        <div className="p-3">
          <ScreenInfoMatch dataScreenInfo={dataScreenInfo} />
          <OddsDetail odds={odds} live={live} oddsStatus={oddsStatus} dataScreenInfo={dataScreenInfo} />
        </div>
      )}
    </MainLayout>
  );
}
