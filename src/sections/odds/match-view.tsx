"use client";

import OddsDetail from "@/components/app/odds-detail/odds-detail";
import ScreenInfoMatch from "@/components/app/screen-info-match/screen-info-match";
import { SplashScreen } from "@/components/loading-screen";
import { useTelegram } from "@/context/telegram.provider";
import MainLayout from "@/layouts/main/layout";
import { IMatchData, IOddsDetail, OddsStatusType } from "@/types/odds.types";
import { transformDataCorner } from "@/utils/transformDataCorner";
import { transformData } from "@/utils/transformDataOdds";
import { initClosingBehavior, initSwipeBehavior } from "@telegram-apps/sdk-react";
import axios from "axios";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
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
  const [disableBtn, setDisableBtn] = useState(false);
  const [haveError, setHaveError] = useState(false);
  const [iframeHeight, setIframeHeight] = useState("0px");
  const [errorCount, setErrorCount] = useState(0);
  const telegram = useTelegram();
  const [closingBehavior] = initClosingBehavior();
  const [swipeBehavior] = initSwipeBehavior();

  const matchParam = searchParams.get("match");
  const lineParam = searchParams.get("line");
  const tracker_id = searchParams.get("tracker_id");

  const leagueNoCorner = (league?: string) => {
    return league?.includes(" Corners") ? league?.replace(" Corners", "") : league;
  };
  const matchNoCorner = () => {
    return matchParam?.split(",").map((item) => {
      return item.includes(" (Corners)") ? item.replace(" (Corners)", "") : item;
    });
  };
  const payload = {
    request_id: searchParams.get("request_id"),
    match: matchParam ? matchNoCorner() : [],
    time: searchParams.get("time") || "next_week",
    from_date: searchParams.get("from_date"),
    to_date: searchParams.get("to_date"),
    league: leagueNoCorner(searchParams.get("league") || ""),
    game_type: "",
    game_detail: "",
    game_scope: "",
    filter_by: "and",
  };

  // payload lấy kèo góc
  const cornerPayload = {
    ...payload,
    resulting_unit: "Corners",
  };

  const isMobileDevice = () => {
    return /Mobi|Android|iPhone|iPad|iPod/.test(navigator.userAgent);
  };

  // lấy kèo cược chấp ,tài xỉu, hiệp phụ , penalty
  useEffect(() => {
    async function fetchAndSetInitialOdds() {
      setLoading(true);
      try {
        const [oddsRes, cornerRes] = await Promise.all([
          axios.post("/api/odds", payload),
          axios.post("/api/odds", cornerPayload),
        ]);
        let combinedOdds: IOddsDetail[] = [];
        let oddsDataValid = Array.isArray(oddsRes?.data?.message?.answer) && oddsRes?.data?.message?.answer.length > 0;
        let cornersDataValid =
          Array.isArray(cornerRes?.data?.message?.answer) && cornerRes?.data?.message?.answer.length > 0;
        if (oddsRes?.data?.message?.live_state === "ended" || cornerRes?.data?.message?.live_state === "ended") {
          setEndBet(true); // kết thúc trận đấu
        } else {
          if (oddsDataValid) {
            const transformedData = transformData(oddsRes?.data?.message?.answer, lineParam ?? "3");
            setDataScreenInfo((prevData) => [...prevData, ...oddsRes?.data?.message?.answer]);
            combinedOdds = [
              ...combinedOdds,
              ...(transformedData as IOddsDetail[]).map((item) => ({
                ...item,
                status: item.status ?? 0,
              })),
            ];
          }
          if (cornersDataValid) {
            const transformedDataCorner = transformDataCorner(cornerRes?.data?.message?.answer, lineParam ?? "3");
            setDataScreenInfo((prevData) => [...prevData, ...cornerRes?.data?.message?.answer]);
            combinedOdds = [
              ...combinedOdds,
              ...(transformedDataCorner as IOddsDetail[]).map((item) => ({
                ...item,
                status: item.status ?? 0,
              })),
            ];
          }

          if (!oddsDataValid && !cornersDataValid) {
            setHaveError(true); // lỗi mà chưa kết thúc trận đấu trả về màn hình lỗi
          }
        }

        setOdds(combinedOdds as unknown as IOddsDetail[]);
        setLatestOdds(combinedOdds as unknown as IOddsDetail[]);

        telegram?.webApp?.expand();
        closingBehavior.enableConfirmation();
        swipeBehavior.enableVerticalSwipe();
      } catch (error: any) {
        console.log("Lỗi không xác định:", error);
        setHaveError(true);
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
        const [newOddsRes, newCornerRes] = await Promise.all([
          axios.post("/api/odds", payload),
          axios.post("/api/odds", cornerPayload),
        ]);

        let combinedLatestOdds: IOddsDetail[] = [];
        let oddsDataValid =
          Array.isArray(newOddsRes?.data?.message?.answer) && newOddsRes?.data?.message?.answer.length > 0;
        let cornersDataValid =
          Array.isArray(newCornerRes?.data?.message?.answer) && newCornerRes?.data?.message?.answer.length > 0;

        if (newOddsRes?.data?.message?.live_state === "ended" || newCornerRes?.data?.message?.live_state === "ended") {
          setEndBet(true); // kết thúc trận đấu
        } else {
          const latestDataScreenInfo = [];
          if (oddsDataValid) {
            const transformedData = transformData(newOddsRes?.data?.message?.answer, lineParam ?? "3");
            latestDataScreenInfo.push(
              Array.isArray(newOddsRes?.data?.message?.answer) && newOddsRes?.data?.message?.answer.length > 0
                ? newOddsRes?.data?.message?.answer[0]
                : []
            );
            // setDataScreenInfo((prevData) => [...prevData, ...newOddsRes?.data?.message?.answer]);
            combinedLatestOdds = [
              ...combinedLatestOdds,
              ...(transformedData as IOddsDetail[]).map((item) => ({
                ...item,
                status: item.status ?? 0,
              })),
            ];
          }

          if (cornersDataValid) {
            const transformedDataCorner = transformDataCorner(newCornerRes?.data?.message?.answer, lineParam ?? "3");
            latestDataScreenInfo.push(
              Array.isArray(newCornerRes?.data?.message?.answer) && newCornerRes?.data?.message?.answer.length > 0
                ? newCornerRes?.data?.message?.answer[0]
                : []
            );
            // setDataScreenInfo((prevData) => [...prevData, ...newCornerRes?.data?.message?.answer]);
            combinedLatestOdds = [
              ...combinedLatestOdds,
              ...(transformedDataCorner as IOddsDetail[]).map((item) => ({
                ...item,
                status: item.status ?? 0,
              })),
            ];
          }
          setDataScreenInfo(latestDataScreenInfo);
          if (!oddsDataValid && !cornersDataValid) {
            setErrorCount((prev) => prev + 1);
            if (errorCount >= 8) {
              setHaveError(true);
            } else {
              setDisableBtn(true); // lỗi mà chưa kết thúc trận đấu
            }
          }

          if (combinedLatestOdds.length > 0) {
            const newOddsStatus: OddsStatusType = {};
            combinedLatestOdds.forEach((latestOdd, index) => {
              latestOdd?.detail?.forEach((latestDetail, detailIndex) => {
                latestDetail?.forEach((latestOddDetail, oddDetailIndex) => {
                  const key = `${index}-${detailIndex}-${oddDetailIndex}`;
                  const oldValue = odds[index]?.detail[detailIndex][oddDetailIndex]?.value;
                  const newValue = latestOddDetail?.value;
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
            setOdds(latestOdds?.length > 0 ? latestOdds : combinedLatestOdds);
            setLatestOdds(combinedLatestOdds);

            if (endBet) {
              setEndBet(false);
            }
            if (disableBtn) {
              setDisableBtn(false);
            }
            if (haveError) {
              setHaveError(false);
            }
          }
        }
      } catch (error) {
        setHaveError(true);
        console.error("Lỗi không xác định:", error);
      }
    }

    const intervalId = setInterval(fetchAndUpdateOdds, 7000);
    return () => clearInterval(intervalId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [latestOdds, endBet, disableBtn, haveError, errorCount]);
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (isMobileDevice()) {
        if (width > 600) {
          setIframeHeight("500px");
        } else if (width > 440) {
          setIframeHeight("425px");
        } else if (width > 400) {
          setIframeHeight("390px");
        } else {
          setIframeHeight("365px");
        }
      } else {
        if (width > 520) {
          setIframeHeight("465px");
        } else {
          setIframeHeight("354px");
        }
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIframeLoaded(true);
    }, 2000); // 2 seconds delay

    return () => clearTimeout(timer);
  }, []);

  return (
    <MainLayout>
      {loading ? (
        <SplashScreen />
      ) : endBet ? (
        <div className="h-[97vh] w-[90%] flex flex-col justify-center items-center mx-auto">
          {tracker_id ? (
            <iframe
              scrolling="no"
              src={`https://start26.sptpub.com/tracker.html?eventId=${tracker_id}&sportId=1&lang=vi&liveEvent=true&providers=Betradar`}
              allowFullScreen
              title="rindle"
              style={{
                border: 0,
                width: "100%",
                height: iframeLoaded ? iframeHeight : "0px",
                borderRadius: "5px",
              }}
            ></iframe>
          ) : (
            <Image src="/assets/ball.png" alt="no-content" className="w-[165px] h-[170px] mr-5" />
          )}
          <p className="pt-2 text-xl text-slate-500 font-semibold">Trận đấu đã kết thúc</p>
          <span className="pt-2 text-sm text-slate-500 font-semibold">
            Vui lòng quay lại Telegram và xem các sự kiện khác
          </span>
        </div>
      ) : haveError ? (
        <div className="h-[97vh] w-[90%] flex flex-col justify-center items-center mx-auto">
          {tracker_id ? (
            <iframe
              scrolling="no"
              src={`https://start26.sptpub.com/tracker.html?eventId=${tracker_id}&sportId=1&lang=vi&liveEvent=true&providers=Betradar`}
              allowFullScreen
              title="rindle"
              style={{
                border: 0,
                width: "100%",
                height: iframeLoaded ? iframeHeight : "0px",
                borderRadius: "5px",
              }}
            ></iframe>
          ) : (
            <Image src="/assets/ball.png" alt="no-content" className="w-[165px] h-[170px] mr-5" />
          )}
          <p className="pt-4 text-xl text-slate-500 font-semibold">Không tìm thấy thông tin trận đấu</p>
          <span className="pt-2 text-sm text-slate-500 font-semibold text-center">
            Trận đấu bị gián đoạn hoặc đã kết thúc. Vui lòng thử lại trong giây lát hoặc chọn trận đấu khác.
          </span>
        </div>
      ) : (
        <>
          <div className="p-3 pb-6 h-full">
            <ScreenInfoMatch dataScreenInfo={dataScreenInfo} />
            {tracker_id && (
              <iframe
                scrolling="no"
                src={`https://start26.sptpub.com/tracker.html?eventId=${tracker_id}&sportId=1&lang=vi&liveEvent=true&providers=Betradar`}
                allowFullScreen
                title="rindle"
                style={{
                  border: 0,
                  width: "100%",
                  height: iframeLoaded ? iframeHeight : "0px",
                  borderRadius: "5px",
                }}
              ></iframe>
            )}

            <OddsDetail odds={odds} oddsStatus={oddsStatus} dataScreenInfo={dataScreenInfo} disableBtn={disableBtn} />
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
