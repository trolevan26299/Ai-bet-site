"use client";

import OddsDetail from "@/components/app/odds-detail/odds-detail";
import ScreenInfoMatch from "@/components/app/screen-info-match/screen-info-match";
import { SplashScreen } from "@/components/loading-screen";
import { useTelegram } from "@/context/telegram.provider";
import MainLayout from "@/layouts/main/layout";
import { paths } from "@/routes/paths";
import { IMatchData, IOddsDetail, OddsStatusType } from "@/types/odds.types";
import { transformDataCorner } from "@/utils/transformDataCorner";
import { Icon } from "@iconify/react";
import { transformData } from "@/utils/transformDataOdds";
import axios from "axios";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { isIOS } from "react-device-detect";
import { Button } from "@/components/ui/button";

const menuNavigation = [
  { id: "1", name: "Trận đấu", url: paths.odds, icon: "mdi:soccer-field" },
  { id: "2", name: "Yêu thích", url: paths.favorites, icon: "gravity-ui:star" },
  { id: "3", name: "Cược của tôi", url: paths.history, icon: "f7:tickets-fill" },
  { id: "4", name: "Kết quả", url: paths.result, icon: "carbon:result" },
  { id: "5", name: "Cài đặt", url: paths.settings, icon: "uil:setting" },
];
export default function MatchView() {
  const router = useRouter();
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
  const [showTrackingLive, setShowTrackingLive] = useState(true);
  const telegram = useTelegram();

  const matchParam = searchParams.get("match");
  const lineParam = searchParams.get("line");
  const tracker_id = searchParams.get("tracker_id") || "48820767";

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

        const oddsDataValid =
          Array.isArray(newOddsRes?.data?.message?.answer) && newOddsRes?.data?.message?.answer.length > 0;
        const cornersDataValid =
          Array.isArray(newCornerRes?.data?.message?.answer) && newCornerRes?.data?.message?.answer.length > 0;
        if (newOddsRes?.data?.message?.live_state === "ended" || newCornerRes?.data?.message?.live_state === "ended") {
          setEndBet(true); // kết thúc trận đấu
        } else {
          const latestDataScreenInfo = [];
          if (oddsDataValid === true) {
            const transformedData = transformData(newOddsRes?.data?.message?.answer, lineParam ?? "3");
            latestDataScreenInfo.push(newOddsRes?.data?.message?.answer[0]);

            combinedLatestOdds = [
              ...combinedLatestOdds,
              ...(transformedData as IOddsDetail[]).map((item) => ({
                ...item,
                status: item.status ?? 0,
              })),
            ];
          }

          if (cornersDataValid === true) {
            const transformedDataCorner = transformDataCorner(newCornerRes?.data?.message?.answer, lineParam ?? "3");
            latestDataScreenInfo.push(newCornerRes?.data?.message?.answer[0]);

            combinedLatestOdds = [
              ...combinedLatestOdds,
              ...(transformedDataCorner as IOddsDetail[]).map((item) => ({
                ...item,
                status: item.status ?? 0,
              })),
            ];
          }
          // Kiểm tra nếu cả hai đều là mảng rỗng thì không cập nhật dataScreenInfo
          if (latestDataScreenInfo.length > 0) {
            setDataScreenInfo(latestDataScreenInfo);
          }
          if ((!oddsDataValid && !cornersDataValid) || !oddsDataValid) {
            setErrorCount((prev) => prev + 1);
            if (errorCount >= 8) {
              setHaveError(true);
            } else {
              setDisableBtn(true); // lỗi mà chưa kết thúc trận đấu
            }
          }
          if (combinedLatestOdds.length > 0) {
            setOdds(latestOdds?.length > 0 ? latestOdds : combinedLatestOdds);
            setLatestOdds(combinedLatestOdds);
          }

          if (combinedLatestOdds?.length > 0) {
            const newOddsStatus: OddsStatusType = {};
            latestOdds?.forEach((latestOdd, index) => {
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
      <div style={{ paddingBottom: "50px" }}>
        <div className="h-[39px] w-full bg-[rgba(30,42,56,1)] flex flex-row justify-between items-center px-3">
          <Icon
            icon="weui:back-filled"
            width={30}
            height={20}
            color="rgba(143,149,156,1)"
            className="hover:cursor-pointer"
          />
          <div className="text-[rgba(255,255,255,1)] flex flex-row justify-center items-center">
            <Image src="/assets/league_logo.png" alt="no-content" className="w-[34px] h-[27.2px]" />
            <div className="flex flex-row justify-center items-center">
              <p className="text-sm font-bold ">{dataScreenInfo[0]?.league_name}</p>
              <Icon
                icon="icon-park-solid:down-one"
                width={25}
                height={15}
                color="rgba(255,255,255,1)"
                className="hover:cursor-pointer"
              />
            </div>
            <Icon
              icon="material-symbols-light:star-outline"
              width={25}
              height={25}
              color="rgba(170,170,170,1)"
              className="ml-[6px] hover:cursor-pointer"
            />
          </div>
          <Icon
            icon="hugeicons:list-setting"
            width={30}
            height={23}
            color="rgba(143,149,156,1)"
            className="hover:cursor-pointer"
          />
        </div>
        {loading ? (
          <SplashScreen />
        ) : (
          <>
            {endBet ? (
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
                <div className=" pb-6 h-full">
                  <ScreenInfoMatch dataScreenInfo={dataScreenInfo} />
                  {tracker_id && (
                    <div className="p-3">
                      <button
                        className="bg-[rgba(30,42,56,1)] w-full flex flex-row justify-center gap-1 rounded-[7px] h-[30px] items-center"
                        onClick={() => setShowTrackingLive(!showTrackingLive)}
                      >
                        <Icon
                          icon="fe:line-chart"
                          width={30}
                          height={20}
                          color={showTrackingLive ? "rgba(237,202,84,1)" : "rgba(142,149,156,1)"}
                        />
                        <span
                          className={`text-[13px] font-bold ${
                            showTrackingLive ? "text-[rgba(255,255,255,1)]" : "text-[rgba(142,149,156,1)]"
                          } `}
                        >
                          Theo dõi{" "}
                        </span>
                      </button>
                      {showTrackingLive && (
                        <iframe
                          scrolling="no"
                          src={`https://start26.sptpub.com/tracker.html?eventId=${tracker_id}&sportId=1&lang=vi&liveEvent=true&providers=Betradar`}
                          allowFullScreen
                          title="rindle"
                          style={{
                            marginTop: "5px",
                            border: 0,
                            width: "100%",
                            height: iframeLoaded ? iframeHeight : "0px",
                            borderRadius: "5px",
                          }}
                        ></iframe>
                      )}
                    </div>
                  )}

                  <OddsDetail
                    odds={odds}
                    oddsStatus={oddsStatus}
                    dataScreenInfo={dataScreenInfo}
                    disableBtn={disableBtn}
                  />
                </div>
              </>
            )}
          </>
        )}
        <div
          className={`z-10 bottom-0  fixed m-auto rounded-sm flex items-center flex-row justify-around flex-wrap w-full  px-4 pt-2 pb-3 rounded-tr-[20px] rounded-tl-[20px]`}
          style={{ backgroundColor: "rgba(13, 22, 31, 1)" }}
        >
          {menuNavigation.map((item) => (
            <div
              className="group flex flex-col justify-center items-center gap-[4.5px] hover:cursor-pointer  text-[rgba(159,162,167,1)]"
              key={item.id}
            >
              <Icon icon={item.icon} className="w-[21.43px] h-[21.43px] group-hover:text-[rgba(121,228,169,1)]" />
              <p className="text-[12.86px] font-bold leading-[15.56px] group-hover:text-[rgba(255,255,255,1)]">
                {item.name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </MainLayout>
  );
}
