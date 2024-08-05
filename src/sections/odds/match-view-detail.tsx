/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import Menu from "@/components/app/menu/menu";
import OddsDetail from "@/components/app/odds-detail/odds-detail";
import ScreenInfoMatch from "@/components/app/screen-info-match/screen-info-match";
import { SplashScreen } from "@/components/loading-screen";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTelegram } from "@/context/telegram.provider";
import MainLayout from "@/layouts/main/layout";
import { IMatchData, IOddsDetail, OddsStatusType } from "@/types/odds.types";
import { transformDataCorner } from "@/utils/transformDataCorner";
import { transformData } from "@/utils/transformDataOdds";
import { Icon } from "@iconify/react";
import { Button, Dialog, Flex, Popover } from "@radix-ui/themes";
import axios from "axios";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import "./index.css";
import LoadingPopup from "../../components/loading-screen/loading-popup";
import TeamLogo from "@/components/cloudinary/teamlogo";
import { utcToUtc7Format } from "@/utils/time";

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
  const [favorite, setFavorite] = useState<boolean | null>();
  const [numberLine, setNumberLine] = useState<string>();
  const [oddsType, setOddsType] = useState<string>();
  const [loadingLeaguePopup, setLoadingLeaguePopup] = useState(false);
  const [listLeague, setListLeague] = useState<IMatchData[]>([]);

  const telegram = useTelegram();

  const matchParam = searchParams.get("match");
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

  // Hàm thêm và xóa kèo yêu thích
  const handleAddRemoveFavorite = async () => {
    try {
      const url = "/api/favorite";
      const method = favorite ? axios.put : axios.post;
      const response = await method(url, {
        request_id: searchParams.get("request_id"),
        league_id: dataScreenInfo[0]?.league_id,
      });
      console.log("response:", response);

      if (response.data.ok) {
        setFavorite(!favorite);
      } else {
        setFavorite(favorite);
      }
    } catch (error) {
      setFavorite(favorite);
      console.log("error:", error);
    }
  };

  // Hàm lấy setting bao gồm : số lượng kèo và loại kèo
  const handleGetSetting = async () => {
    try {
      const response = await axios.post("/api/setting/get", {
        request_id: searchParams.get("request_id"),
        key: ["line_number", "odds_format"],
      });
      if (response.data) {
        setNumberLine(response.data.line_number.toString() || "3");
        setOddsType(response.data.odds_format);
      }
    } catch (error) {
      console.log("error:", error);
    }
  };

  // Hàm set số lượng kèo
  const handleSetNumberLine = useCallback(async (value: string) => {
    try {
      const response = await axios.post("/api/setting/post", {
        request_id: searchParams.get("request_id"),
        data: { line_number: Number(value) },
      });
      if (response.data.ok) {
        window.location.reload();
      }
    } catch (error) {
      console.log("error:", error);
    }
  }, []);

  // Hàm mở popover league
  const handleOpenLeague = async (open: boolean) => {
    try {
      if (open) {
        setLoadingLeaguePopup(true);
        const response = await axios.post("/api/league/match-in-league", {
          league: dataScreenInfo[0].league_name,
          request_id: searchParams.get("request_id"),
          is_get_bets: false,
        });
        if (response.data.ok) {
          setListLeague(response?.data?.data);
          setLoadingLeaguePopup(false);
        }
      }
    } catch (error) {
      setLoadingLeaguePopup(false);
      console.error("error:", error);
    }
  };

  // Hàm set loại kèo
  const handleSetOddsType = useCallback(async (value: string) => {
    try {
      const response = await axios.post("/api/setting/post", {
        request_id: searchParams.get("request_id"),
        data: { odds_format: value },
      });
      if (response.data.ok) {
        window.location.reload();
      }
    } catch (error) {
      console.log("error:", error);
    }
  }, []);

  useEffect(() => {
    setFavorite(dataScreenInfo[0]?.is_favorite);
  }, [dataScreenInfo]);

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
            const transformedData = transformData(
              oddsRes?.data?.message?.answer,
              oddsRes?.data?.line_number.toString() || "3"
            );
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
            const transformedDataCorner = transformDataCorner(
              cornerRes?.data?.message?.answer,
              cornerRes?.data?.line_number.toString() || "3"
            );
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
            const transformedData = transformData(
              newOddsRes?.data?.message?.answer,
              newOddsRes?.data?.line_number.toString() || "3"
            );
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
            const transformedDataCorner = transformDataCorner(
              newCornerRes?.data?.message?.answer,
              newCornerRes?.data?.line_number.toString() || "3"
            );
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

  // load iframe sau 2s để show live tracking
  useEffect(() => {
    const timer = setTimeout(() => {
      setIframeLoaded(true);
    }, 2000); // 2 seconds delay

    return () => clearTimeout(timer);
  }, []);

  // hàm lấy setting ban đầu
  useEffect(() => {
    handleGetSetting();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <MainLayout>
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
            <Popover.Root onOpenChange={(open) => handleOpenLeague(open)}>
              <Popover.Trigger>
                <div className="flex flex-row justify-center items-center hover:cursor-pointer">
                  <p className="text-sm font-bold w-[85%] leading-[1.1rem]">{dataScreenInfo[0]?.league_name}</p>
                  <Icon
                    icon="icon-park-solid:down-one"
                    width={25}
                    height={15}
                    color="rgba(255,255,255,1)"
                    className="hover:cursor-pointer"
                  />
                </div>
              </Popover.Trigger>

              <Popover.Content
                className="w-[95%] m-auto mt-3 h-full   bg-[rgba(41,53,67,1)] rounded-[10px]  text-[rgba(255,255,255,1)] max-h-[80vh] overflow-y-auto"
                style={{ border: "none" }}
              >
                {loadingLeaguePopup ? (
                  <LoadingPopup />
                ) : (
                  listLeague.map((item) => (
                    <div
                      className="p-2 flex flex-row justify-between bg-[rgba(30,42,56,1)] rounded-[10px] mb-[10px]"
                      key={item.id}
                    >
                      <div className="flex flex-col justify-between items-start">
                        <div className="flex flex-row gap-1 items-center">
                          <Icon
                            icon="fluent:sport-soccer-24-filled"
                            width={16}
                            height={16}
                            color="rgba(170,170,170,1)"
                          />
                          <p className="pl-2 text-[10px] font-normal text-[rgba(170,170,170,1)]">
                            {item.container.container_vn || item.container.container || item.container.container_en}
                          </p>
                          <Icon icon="ic:outline-arrow-right" width={20} height={20} color="rgba(170,170,170,1)" />
                          <p className="text-[10px] font-normal text-[rgba(170,170,170,1)]">{item.league_name}</p>
                        </div>
                        <p
                          className={`${
                            item.liveStatus ? "text-[rgba(70,230,164,1)]" : "text-[rgba(165,165,165,1)]"
                          } text-[9px] font-normal`}
                        >
                          {item.liveStatus ? `${item.liveMinute} ${item.liveScope}` : utcToUtc7Format(item.starts)}
                        </p>
                        <div className="flex flex-row justify-start items-center gap-2">
                          <TeamLogo teamName={item.team[0]} typeError="home" typeLogo="mini" />
                          <p className="text-[rgba(251,255,255,1)] text-[14.41px] font-normal">{item.home}</p>
                        </div>
                        <div className="flex flex-row justify-start items-center gap-2">
                          <TeamLogo teamName={item.team[1]} typeError="away" typeLogo="mini" />
                          <p className="text-[rgba(251,255,255,1)] text-[14.41px] font-normal">{item.away}</p>
                        </div>
                      </div>
                      <div className="flex flex-col justify-between items-center">
                        <Dialog.Root>
                          <Dialog.Trigger>
                            <Icon
                              icon="mage:chart-fill"
                              className="hover:cursor-pointer"
                              width={16}
                              height={16}
                              color="rgba(170,170,170,1)"
                            />
                          </Dialog.Trigger>
                          <Dialog.Content className="bg-[rgba(41,53,67,1)] h-[85vh] p-0">
                            <div className="h-[20px] w-full flex flex-row justify-end pb-2">
                              <Dialog.Close>
                                <Icon
                                  icon="mingcute:close-line"
                                  width={20}
                                  height={20}
                                  style={{ color: " #fff" }}
                                  className="hover:cursor-pointer text-white"
                                />
                              </Dialog.Close>
                            </div>
                            <iframe
                              scrolling="no"
                              src={`https://start26.sptpub.com/statistics.html?statisticsUrl=https://s5.sir.sportradar.com/sp77/vi/1/season/116753/h2h/match/48613129`}
                              allowFullScreen
                              title="rindle"
                              style={{
                                border: 0,
                                width: "100%",
                                height: "90%",
                                borderRadius: "5px",
                              }}
                              className="p-0"
                            ></iframe>
                          </Dialog.Content>
                        </Dialog.Root>

                        {item.liveStatus && (
                          <Icon icon="fluent:live-20-filled" width={16} height={16} color="rgba(245,93,62,1)" />
                        )}
                        {item.liveStatus && (
                          <div
                            className="w-[22px] h-[17px] p-[2px] rounded-[5px] font-bold flex flex-row justify-center items-center text-[rgba(rgba(255,255,255,1))] bg-[rgba(41,53,66,1)] "
                            style={{ border: "0.68px solid rgba(64,74,86,1)" }}
                          >
                            {item.homeScore}
                          </div>
                        )}
                        {item.liveStatus && (
                          <div
                            className="w-[22px] h-[17px] p-[2px] rounded-[5px] font-bold flex flex-row justify-center items-center text-[rgba(rgba(255,255,255,1))] bg-[rgba(41,53,66,1)] "
                            style={{ border: "0.68px solid rgba(64,74,86,1)" }}
                          >
                            {item.awayScore}
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </Popover.Content>
            </Popover.Root>
            {favorite ? (
              <Icon
                onClick={handleAddRemoveFavorite}
                icon="emojione:star"
                width={20}
                height={20}
                className="hover:cursor-pointer"
              />
            ) : (
              <Icon
                onClick={handleAddRemoveFavorite}
                icon="material-symbols-light:star-outline"
                width={30}
                height={30}
                color="rgba(170,170,170,1)"
                className="hover:cursor-pointer"
              />
            )}
          </div>
          <Popover.Root>
            <Popover.Trigger>
              <Icon
                icon="hugeicons:list-setting"
                width={30}
                height={23}
                color="rgba(143,149,156,1)"
                className="hover:cursor-pointer"
              />
            </Popover.Trigger>

            <Popover.Content
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
                  <RadioGroup
                    value={numberLine}
                    onValueChange={(value) => {
                      setNumberLine(value);
                      handleSetNumberLine(value);
                    }}
                    className="flex flex-row justify-around"
                  >
                    <div className="flex items-center space-x-2 flex-row py-3 ">
                      <RadioGroupItem
                        value="1"
                        id="1"
                        className="text-[rgba(255,255,255,1)] border-[rgba(255,255,255,1)]"
                      />
                      <Label htmlFor="1">1 kèo</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        value="3"
                        id="3"
                        className="text-[rgba(255,255,255,1)] border-[rgba(255,255,255,1)]"
                      />
                      <Label htmlFor="3">3 kèo</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        value="5"
                        id="5"
                        className="text-[rgba(255,255,255,1)] border-[rgba(255,255,255,1)]"
                      />
                      <Label htmlFor="5">5 kèo</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        value="0"
                        id="0"
                        className="text-[rgba(255,255,255,1)] border-[rgba(255,255,255,1)]"
                      />
                      <Label htmlFor="0">Tất cả</Label>
                    </div>
                  </RadioGroup>
                </TabsContent>
                <TabsContent value="odds_type">
                  <RadioGroup
                    value={oddsType}
                    onValueChange={(value) => {
                      setOddsType(value);
                      handleSetOddsType(value);
                    }}
                    className="flex flex-row justify-around"
                  >
                    <div className="flex items-center space-x-2 flex-row py-3 ">
                      <RadioGroupItem
                        value="DECIMAL"
                        id="DECIMAL"
                        className="text-[rgba(255,255,255,1)] border-[rgba(255,255,255,1)]"
                      />
                      <Label htmlFor="DECIMAL">Decimal</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        value="HONGKONG"
                        id="HONGKONG"
                        className="text-[rgba(255,255,255,1)] border-[rgba(255,255,255,1)]"
                      />
                      <Label htmlFor="HONGKONG">HongKong</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        value="MALAY"
                        id="MALAY"
                        className="text-[rgba(255,255,255,1)] border-[rgba(255,255,255,1)]"
                      />
                      <Label htmlFor="MALAY">Malaysia</Label>
                    </div>
                  </RadioGroup>
                </TabsContent>
              </Tabs>
            </Popover.Content>
          </Popover.Root>
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
    </MainLayout>
  );
}
