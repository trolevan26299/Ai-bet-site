"use client";

import { fetchOddsData } from "@/api/odds";
import OddsDetail from "@/components/app/odds-detail/odds-detail";
import ScreenInfoMatch from "@/components/app/screen-info-match/screen-info-match";
import MainLayout from "@/layouts/main/layout";
import { IMatchData, IOddsDetail, OddsStatusType } from "@/types/odds.types";
import { transformData } from "@/utils/transformDataOdds";
import { useEffect, useState } from "react";

export default function HomeView() {
  const [odds, setOdds] = useState<IOddsDetail[]>([]);
  const [latestOdds, setLatestOdds] = useState<IOddsDetail[]>([]);
  const [live, setLive] = useState(false);
  const [oddsStatus, setOddsStatus] = useState<OddsStatusType>({});
  const [dataScreenInfo, setDataScreenInfo] = useState<IMatchData[]>([]);

  // useEffect chỉ để fetch và set dữ liệu lần đầu tiên
  useEffect(() => {
    async function fetchAndSetInitialOdds() {
      const newData: IMatchData[] = await fetchOddsData();
      const transformedData = transformData(newData);
      setDataScreenInfo(newData);
      setOdds(transformedData as unknown as IOddsDetail[]);
      setLatestOdds(transformedData as unknown as IOddsDetail[]);
      setLive(newData[0].liveStatus);
    }

    fetchAndSetInitialOdds();
  }, []);
  // useEffect để fetch và cập nhật dữ liệu sau mỗi 5 giây, bắt đầu sau lần render đầu tiên
  useEffect(() => {
    async function fetchAndUpdateOdds() {
      const newData = await fetchOddsData();
      const transformedData = transformData(newData);

      const newOddsStatus: OddsStatusType = {};
      latestOdds.forEach((latestOdd, index) => {
        latestOdd.detail.forEach((latestDetail, detailIndex) => {
          latestDetail.forEach((latestOddDetail, oddDetailIndex) => {
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
      <ScreenInfoMatch dataScreenInfo={dataScreenInfo} />
      <OddsDetail odds={odds} live={live} oddsStatus={oddsStatus} />
    </MainLayout>
  );
}
