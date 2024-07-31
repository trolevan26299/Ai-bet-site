"use client";

import Menu from "@/components/app/menu/menu";
import OddsDetail from "@/components/app/odds-detail/odds-detail";
import ScreenInfoMatch from "@/components/app/screen-info-match/screen-info-match";
import { SplashScreen } from "@/components/loading-screen";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTelegram } from "@/context/telegram.provider";
import MainLayout from "@/layouts/main/layout";
import { IMatchData, IOddsDetail, OddsStatusType } from "@/types/odds.types";
import { transformDataCorner } from "@/utils/transformDataCorner";
import { transformData } from "@/utils/transformDataOdds";
import { Icon } from "@iconify/react";
import { Dialog } from "@radix-ui/themes";
import axios from "axios";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import "./index.css";

const leagueExample = [
  {
    id: 1,
    name: "Euro 2024",
    container: "Châu Âu",
    away: "Spain",
    home: "England",
    awayScore: 1,
    homeScore: 2,
    isLive: true,
    time: "30'",
    scope: "1st Half",
  },
  {
    id: 2,
    name: "Euro 2024",
    container: "Châu Âu",
    away: "Spain",
    home: "England",
    time: "02:00, 15/07",
    isLive: false,
  },
  {
    id: 3,
    name: "Euro 2024",
    container: "Châu Âu",
    away: "Spain",
    home: "England",
    time: "02:00, 15/07",
    isLive: false,
  },
  {
    id: 4,
    name: "Euro 2024",
    container: "Châu Âu",
    away: "Spain",
    home: "England",
    time: "02:00, 15/07",
    isLive: false,
  },
  {
    id: 5,
    name: "Euro 2024",
    container: "Châu Âu",
    away: "Spain",
    home: "England",
    time: "02:00, 15/07",
    isLive: false,
  },
  {
    id: 6,
    name: "Euro 2024",
    container: "Châu Âu",
    away: "Spain",
    home: "England",
    time: "02:00, 15/07",
    isLive: false,
  },
  {
    id: 7,
    name: "Euro 2024",
    container: "Châu Âu",
    away: "Spain",
    home: "England",
    time: "02:00, 15/07",
    isLive: false,
  },
  {
    id: 8,
    name: "Euro 2024",
    container: "Châu Âu",
    away: "Spain",
    home: "England",
    time: "02:00, 15/07",
    isLive: false,
  },
  {
    id: 9,
    name: "Euro 2024",
    container: "Châu Âu",
    away: "Spain",
    home: "England",
    time: "02:00, 15/07",
    isLive: false,
  },
];
export default function MatchViewDetail() {
  const router = useRouter();
  const searchParams = useSearchParams();
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
  const [typePopover, setTypePopover] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  const telegram = useTelegram();

  const matchParam = searchParams.get("match");
  const lineParam = searchParams.get("line");
  const tracker_id = searchParams.get("tracker_id") || "48820767";

  const leagueNoCorner = (league?: string) => {
    return league?.includes(" Corners") ? league?.replace(" Corners", "") : league;
  };

  const handlePopoverOpen = (popoverId: string | null) => {
    setTypePopover(popoverId);
  };
  const handleDialogOpen = () => {
    setIsDialogOpen(true);
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
      <Dialog.Root>
        <Popover>
          <div style={{ paddingBottom: "50px" }}>
            <div className="h-[39px] w-full bg-[rgba(30,42,56,1)] flex flex-row justify-between items-center px-[6px]">
              <Icon
                icon="weui:back-filled"
                width={30}
                height={20}
                className="hover:cursor-pointer text-[rgba(143,149,156,1)] hover:text-[rgba(255,255,255,1)]"
                onClick={() => router.back()}
              />
              <div className="text-[rgba(255,255,255,1)] flex flex-row justify-center items-center pr-[10px]">
                <Image src="/assets/league_logo.png" alt="no-content" className="w-[34px] h-[27.2px]" />
                <PopoverTrigger asChild>
                  <div
                    className="flex flex-row justify-center items-center hover:cursor-pointer"
                    onClick={() => {
                      handlePopoverOpen("league");
                    }}
                  >
                    <p className="text-sm font-bold w-[85%] leading-[1.1rem]">{dataScreenInfo[0]?.league_name}</p>
                    <Icon
                      icon="icon-park-solid:down-one"
                      width={25}
                      height={15}
                      color="rgba(255,255,255,1)"
                      className="hover:cursor-pointer"
                    />
                  </div>
                </PopoverTrigger>
                <Icon
                  icon="material-symbols-light:star-outline"
                  width={30}
                  height={30}
                  color="rgba(170,170,170,1)"
                  className=" hover:cursor-pointer"
                />
              </div>
              <PopoverTrigger asChild>
                <Icon
                  icon="hugeicons:list-setting"
                  width={30}
                  height={23}
                  color="rgba(143,149,156,1)"
                  className="hover:cursor-pointer"
                  onClick={() => handlePopoverOpen("setting")}
                />
              </PopoverTrigger>
            </div>
            {loading ? (
              <SplashScreen />
            ) : (
              <>
                {endBet ? (
                  <div className="h-[80vh] w-[90%] flex flex-col justify-center items-center mx-auto">
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
                  <div className="h-[80vh] w-[90%] flex flex-col justify-center items-center mx-auto">
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
                      <div className="px-3">
                        {tracker_id && (
                          <div className="pt-2">
                            <button
                              className={`bg-[rgba(30,42,56,1)] w-full flex flex-row justify-center gap-1 rounded-[7px] h-[30px] items-center ${
                                !showTrackingLive ? "pb-1" : ""
                              }`}
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

                            <iframe
                              scrolling="no"
                              src={`https://start26.sptpub.com/tracker.html?eventId=${tracker_id}&sportId=1&lang=vi&liveEvent=true&providers=Betradar`}
                              allowFullScreen
                              title="rindle"
                              style={{
                                display: showTrackingLive ? "block" : "none",
                                marginTop: "5px",
                                border: 0,
                                width: "100%",
                                height: iframeLoaded ? iframeHeight : "0px",
                                borderRadius: "5px",
                              }}
                            ></iframe>
                          </div>
                        )}

                        <OddsDetail
                          odds={odds}
                          oddsStatus={oddsStatus}
                          dataScreenInfo={dataScreenInfo}
                          disableBtn={disableBtn}
                        />
                      </div>
                    </div>
                  </>
                )}
              </>
            )}
            <Menu />
          </div>
          {typePopover === "setting" && (
            <PopoverContent
              className="w-[90%] m-auto mt-3  bg-[rgba(41,53,67,1)] rounded-[10px]  text-[rgba(255,255,255,1)]"
              style={{ border: "none" }}
            >
              <Tabs defaultValue="number_line" key="number_line" className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-[rgba(30,42,56,1)] rounded-[10px]">
                  <TabsTrigger value="number_line" className="rounded-[10px]">
                    Số lượng kèo
                  </TabsTrigger>
                  <TabsTrigger value="odds_type" className="rounded-[10px]">
                    Tỷ lệ cược
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="number_line">
                  <RadioGroup defaultValue="option-one" className="flex flex-row justify-around">
                    <div className="flex items-center space-x-2 flex-row py-3 ">
                      <RadioGroupItem
                        value="option-one"
                        id="option-one"
                        className="text-[rgba(255,255,255,1)] border-[rgba(255,255,255,1)]"
                      />
                      <Label htmlFor="option-one">1 kèo</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        value="option-two"
                        id="option-two"
                        className="text-[rgba(255,255,255,1)] border-[rgba(255,255,255,1)]"
                      />
                      <Label htmlFor="option-two">3 kèo</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        value="option-three"
                        id="option-three"
                        className="text-[rgba(255,255,255,1)] border-[rgba(255,255,255,1)]"
                      />
                      <Label htmlFor="option-three">5 kèo</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        value="all"
                        id="all"
                        className="text-[rgba(255,255,255,1)] border-[rgba(255,255,255,1)]"
                      />
                      <Label htmlFor="all">Tất cả</Label>
                    </div>
                  </RadioGroup>
                </TabsContent>
                <TabsContent value="odds_type">
                  <RadioGroup defaultValue="option-one" className="flex flex-row justify-around">
                    <div className="flex items-center space-x-2 flex-row py-3 ">
                      <RadioGroupItem
                        value="decimal"
                        id="decimal"
                        className="text-[rgba(255,255,255,1)] border-[rgba(255,255,255,1)]"
                      />
                      <Label htmlFor="decimal">Decimal</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        value="hongkong"
                        id="hongkong"
                        className="text-[rgba(255,255,255,1)] border-[rgba(255,255,255,1)]"
                      />
                      <Label htmlFor="hongkong">HongKong</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        value="malaysia"
                        id="malaysia"
                        className="text-[rgba(255,255,255,1)] border-[rgba(255,255,255,1)]"
                      />
                      <Label htmlFor="malaysia">Malaysia</Label>
                    </div>
                  </RadioGroup>
                </TabsContent>
              </Tabs>
            </PopoverContent>
          )}
          {typePopover === "league" && (
            <PopoverContent
              className="w-[95%] m-auto mt-3  bg-[rgba(41,53,67,1)] rounded-[10px]  text-[rgba(255,255,255,1)] max-h-[80vh] overflow-y-auto"
              style={{ border: "none" }}
            >
              {leagueExample.map((item) => (
                <div
                  className="p-2 flex flex-row justify-between bg-[rgba(30,42,56,1)] rounded-[10px] mb-[10px]"
                  key={item.id}
                >
                  <div className="flex flex-col justify-between items-start">
                    <div className="flex flex-row gap-1 items-center">
                      <Icon icon="fluent:sport-soccer-24-filled" width={16} height={16} color="rgba(170,170,170,1)" />
                      <p className="pl-2 text-[10px] font-normal text-[rgba(170,170,170,1)]">{item.container}</p>
                      <Icon icon="ic:outline-arrow-right" width={20} height={20} color="rgba(170,170,170,1)" />
                      <p className="text-[10px] font-normal text-[rgba(170,170,170,1)]">{item.name}</p>
                    </div>
                    <p
                      className={`${
                        item.isLive ? "text-[rgba(70,230,164,1)]" : "text-[rgba(165,165,165,1)]"
                      } text-[9px] font-normal`}
                    >
                      {item.isLive ? `${item.time} ${item.scope}` : item.time}
                    </p>
                    <div className="flex flex-row justify-start items-center gap-2">
                      <Image
                        src="https://w7.pngwing.com/pngs/982/984/png-transparent-red-and-white-flag-flag-of-spain-iberian-peninsula-computer-icons-spanish-free-spain-flag-svg-miscellaneous-english-country-thumbnail.png"
                        alt="no-content"
                        className="w-[20px] h-[20px]"
                      />
                      <p className="text-[rgba(251,255,255,1)] text-[14.41px] font-normal">{item.home}</p>
                    </div>
                    <div className="flex flex-row justify-start items-center gap-2">
                      <Image
                        src="https://upload.wikimedia.org/wikipedia/en/thumb/8/8b/England_national_football_team_crest.svg/1200px-England_national_football_team_crest.svg.png"
                        alt="no-content"
                        className="w-[20px] h-[20px]"
                      />
                      <p className="text-[rgba(251,255,255,1)] text-[14.41px] font-normal">{item.away}</p>
                    </div>
                  </div>
                  <div className="flex flex-col justify-between items-center">
                    {/* <Dialog.Trigger> */}
                    <Icon
                      icon="mage:chart-fill"
                      className="hover:cursor-pointer"
                      width={16}
                      height={16}
                      color="rgba(170,170,170,1)"
                      onClick={handleDialogOpen}
                    />
                    {/* </Dialog.Trigger> */}
                    {item.isLive && (
                      <Icon icon="fluent:live-20-filled" width={16} height={16} color="rgba(245,93,62,1)" />
                    )}
                    {item.isLive && (
                      <div
                        className="w-[22px] h-[17px] p-[2px] rounded-[5px] font-bold flex flex-row justify-center items-center text-[rgba(rgba(255,255,255,1))] bg-[rgba(41,53,66,1)] "
                        style={{ border: "0.68px solid rgba(64,74,86,1)" }}
                      >
                        {item.homeScore}
                      </div>
                    )}
                    {item.isLive && (
                      <div
                        className="w-[22px] h-[17px] p-[2px] rounded-[5px] font-bold flex flex-row justify-center items-center text-[rgba(rgba(255,255,255,1))] bg-[rgba(41,53,66,1)] "
                        style={{ border: "0.68px solid rgba(64,74,86,1)" }}
                      >
                        {item.awayScore}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </PopoverContent>
          )}
        </Popover>
        <Dialog.Content className="sm:max-w-[425px]">
          <p>nội dung popup phân tích</p>
        </Dialog.Content>
      </Dialog.Root>
    </MainLayout>
  );
}