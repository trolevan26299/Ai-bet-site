"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader } from "@/components/ui/dialog";
import {
  DialogCloseGame,
  DialogContentGame,
  DialogFooterGame,
  DialogGame,
  DialogHeaderGame,
  DialogTitleGame,
  DialogTriggerGame,
} from "@/components/ui/dialog-game";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTelegram } from "@/context/telegram.provider";
import { IMatchData, IOdds, IOddsDetail, OddsStatusType } from "@/types/odds.types";
import { Icon } from "@iconify/react";
import { ReloadIcon } from "@radix-ui/react-icons";
import axios from "axios";
import { m } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { isIOS } from "react-device-detect";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../../ui/accordion";

export default function OddsDetail({
  odds,
  oddsStatus,
  dataScreenInfo,
  disableBtn,
}: {
  odds: IOddsDetail[];
  oddsStatus: OddsStatusType;
  dataScreenInfo: IMatchData[];
  disableBtn: boolean;
}) {
  const tabsListRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();
  const leagueParam = searchParams.get("league");

  const [defaultTab, setDefaultTab] = useState("1");
  const handleMouseMove = (e: MouseEvent) => {
    if (tabsListRef.current) {
      const target = tabsListRef.current;
      if (e.buttons === 1) {
        target.scrollLeft -= e.movementX;
      }
    }
  };

  const [openItems, setOpenItems] = useState(["item-1", "item-2", "item-3", "item-4", "item-5", "item-6", "item-7"]);
  const handleValueChange = (value: string[]) => {
    setOpenItems(value);
  };

  const oddsCorner = odds.filter(
    (item) =>
      item.name_Odds === "Cược chấp phạt góc - Toàn trận" ||
      item.name_Odds === "Cược chấp phạt góc - Hiệp 1" ||
      item.name_Odds === "Tài xỉu phạt góc - Toàn trận" ||
      item.name_Odds === "Tài xỉu phạt góc - Hiệp 1"
  );

  useEffect(() => {
    const target = tabsListRef.current;
    if (target) {
      target.addEventListener("mousemove", handleMouseMove);
      return () => {
        target.removeEventListener("mousemove", handleMouseMove);
      };
    }
  }, []);

  useEffect(() => {
    if (leagueParam?.includes("Corners") && oddsCorner.length > 0) {
      setDefaultTab("4");
    } else {
      setDefaultTab("1");
    }
  }, [leagueParam, oddsCorner]);
  return (
    <>
      <Tabs defaultValue={defaultTab} key={defaultTab} className="w-full flex flex-row">
        <Icon icon="tabler:chevrons-down" width={18} height={22} color="rgba(91,99,109,1)" className="w-[10%]" />
        <TabsList
          ref={tabsListRef}
          className={`w-full gap-3 justify-between overflow-x-hidden whitespace-nowrap scrollbar-hide h-[40px] ${
            oddsCorner.length > 0 ? "p-0" : ""
          } scroll-smooth`}
        >
          <TabsTrigger value="1" className={`${oddsCorner.length > 0 ? "px-[0.7rem]" : ""}`}>
            Tất cả{" "}
          </TabsTrigger>
          <TabsTrigger value="2" className={`${oddsCorner.length > 0 ? "px-[0.7rem]" : ""}`}>
            Cược chấp
          </TabsTrigger>
          <TabsTrigger value="3" className={`${oddsCorner.length > 0 ? "px-[0.7rem]" : ""}`}>
            Tài xỉu{" "}
          </TabsTrigger>
          {oddsCorner.length > 0 && (
            <TabsTrigger value="4" className={`${oddsCorner.length > 0 ? "px-[0.7rem]" : ""}`}>
              Phạt góc{" "}
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="1">
          <RenderAccordion
            odds={odds}
            openItems={openItems}
            oddsStatus={oddsStatus}
            onValueChange={handleValueChange}
            dataScreenInfo={dataScreenInfo[0]}
            disableOdds={disableBtn}
          />
        </TabsContent>

        <TabsContent value="2">
          <RenderAccordion
            odds={odds.filter(
              (item) =>
                item.name_Odds === "Cược chấp - Toàn trận" ||
                item.name_Odds === "Cược chấp - Hiệp 1" ||
                item.name_Odds === "Cược chấp - Hiệp phụ" ||
                item.name_Odds === "1X2 - Luân lưu"
            )}
            openItems={openItems}
            oddsStatus={oddsStatus}
            onValueChange={handleValueChange}
            dataScreenInfo={dataScreenInfo[0]}
            disableOdds={disableBtn}
          />
        </TabsContent>

        <TabsContent value="3">
          <RenderAccordion
            odds={odds.filter(
              (item) =>
                item.name_Odds === "Tài xỉu - Toàn trận" ||
                item.name_Odds === "Tài xỉu - Hiệp 1" ||
                item.name_Odds === "Tài xỉu - Hiệp phụ" ||
                item.name_Odds === "Tài xỉu - Luân lưu 10 quả"
            )}
            openItems={openItems}
            oddsStatus={oddsStatus}
            onValueChange={handleValueChange}
            dataScreenInfo={dataScreenInfo[0]}
            disableOdds={disableBtn}
          />
        </TabsContent>
        {oddsCorner.length > 0 && (
          <TabsContent value="4">
            <RenderAccordion
              odds={odds.filter(
                (item) =>
                  item.name_Odds === "Cược chấp phạt góc - Toàn trận" ||
                  item.name_Odds === "Cược chấp phạt góc - Hiệp 1" ||
                  item.name_Odds === "Tài xỉu phạt góc - Toàn trận" ||
                  item.name_Odds === "Tài xỉu phạt góc - Hiệp 1"
              )}
              openItems={openItems}
              oddsStatus={oddsStatus}
              onValueChange={handleValueChange}
              dataScreenInfo={dataScreenInfo[0]}
              disableOdds={disableBtn}
            />
          </TabsContent>
        )}
      </Tabs>
    </>
  );
}

function RenderAccordion({
  odds,
  openItems,
  onValueChange,
  oddsStatus,
  dataScreenInfo,
  disableOdds,
}: {
  odds: IOddsDetail[];
  openItems: string[];
  onValueChange: (value: string[]) => void;
  oddsStatus: OddsStatusType;
  dataScreenInfo: IMatchData;
  disableOdds: boolean;
}) {
  const isIphone = isIOS;
  const searchParams = useSearchParams();
  const [selectedTeam, setSelectedTeam] = useState<IOdds | null>(null);
  const [valueSelectNew, setValueSelectNew] = useState<number | undefined>(undefined);
  const [oddsName, setOddsName] = useState<String>("");
  const [keyItemSelect, setKeyItemSelect] = useState<number[]>([]);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [showErrorConfirm, setErrorConfirm] = useState(false);

  const telegram = useTelegram();
  const [animationState, setAnimationState] = useState({
    showGreen: false,
    showRed: false,
    showBlink: false,
  });
  const [disableBtn, setDisableBtn] = useState(false);

  const modifyValueForCornersLeague = (oddsName: String, value: string) => {
    return oddsName.includes("góc") ? `${value} Corners` : value;
  };
  const modifyValueForCornersTeam = (oddsName: String, value: string) => {
    return oddsName.includes("góc") ? `${value} (corners)` : value;
  };
  const modifyValueForCornersTeamArray = (oddsName: String, value: string[]) => {
    return oddsName.includes("góc") ? [`${value[0]} (corners)`, `${value[1]} (corners)`] : dataScreenInfo?.team;
  };
  const handleResultingUnit = (oddsName: String) => {
    return oddsName.includes("góc") ? "Corners" : "Regular";
  };

  const handleConfirmBet = async () => {
    setDisableBtn(true);
    const data = {
      league_name: modifyValueForCornersLeague(oddsName, dataScreenInfo.league_name),
      team: modifyValueForCornersTeamArray(oddsName, dataScreenInfo?.team),
      last_updated_odd: dataScreenInfo.last_updated_odd,
      liveStatus: dataScreenInfo.liveStatus,
      liveMinute: dataScreenInfo.liveMinute,
      liveScope: dataScreenInfo.liveScope,
      starts: dataScreenInfo.starts,
      home: modifyValueForCornersTeam(oddsName, dataScreenInfo.home),
      away: modifyValueForCornersTeam(oddsName, dataScreenInfo.away),
      game_type:
        oddsName === "Tài xỉu - Toàn trận" ||
        oddsName === "Tài xỉu - Hiệp 1" ||
        oddsName === "Tài xỉu - Hiệp phụ" ||
        oddsName === "Tài xỉu - Luân lưu 10 quả" ||
        oddsName === "Tài xỉu phạt góc - Toàn trận" ||
        oddsName === "Tài xỉu phạt góc - Hiệp 1"
          ? "over under"
          : oddsName === "1X2 - Luân lưu"
          ? "moneyline"
          : "handicap",
      game_detail: oddsName === "1X2 - Luân lưu" ? undefined : (selectedTeam?.rate_odds as number),
      game_scope:
        oddsName === "Cược chấp - Toàn trận" ||
        oddsName === "Tài xỉu - Toàn trận" ||
        oddsName === "Cược chấp phạt góc - Toàn trận" ||
        oddsName === "Tài xỉu phạt góc - Toàn trận"
          ? "full time"
          : oddsName === "Cược chấp - Hiệp 1" ||
            oddsName === "Tài xỉu - Hiệp 1" ||
            oddsName === "Cược chấp phạt góc - Hiệp 1" ||
            oddsName === "Tài xỉu phạt góc - Hiệp 1"
          ? "first half"
          : oddsName === "1X2 - Luân lưu"
          ? "penalty6"
          : oddsName === "Tài xỉu - Luân lưu 10 quả"
          ? "penalty7"
          : "extra time",
      odds: selectedTeam?.value as number,
      game_orientation: selectedTeam?.game_orientation as string,
      eventId: selectedTeam?.eventId as number,
      lineId: selectedTeam?.lineId as number,
      altLineId: selectedTeam?.altLineId as number,
      resultingUnit: handleResultingUnit(oddsName),
    };
    const body = {
      request_id: searchParams.get("request_id") || "",
      data: JSON.stringify(data),
    };
    const response = await axios.post("api/game", body);
    console.log("response:", response);
    setDisableBtn(false);
    if ("ok" in response.data) {
      setDisableBtn(true);
      telegram?.webApp?.close();
    } else {
      setErrorConfirm(true);
    }
  };

  const handleSelectTeam = (statusKey: string, team: IOdds, oddsName: string) => {
    setSelectedTeam(team);
    setValueSelectNew(undefined);
    const keyArray = statusKey.split("-")?.map(Number);
    setKeyItemSelect(keyArray);
    setOddsName(oddsName);
  };
  useEffect(() => {
    setAnimationState((prevState) => ({ ...prevState, showBlink: true }));
    setTimeout(() => {
      setAnimationState((prevState) => ({ ...prevState, showBlink: false }));
    }, 1500);

    const selectedOddsKey = `${keyItemSelect[0]}-${keyItemSelect[1]}-${keyItemSelect[2]}`;
    const selectedOddsStatus = oddsStatus[selectedOddsKey];

    if (odds[keyItemSelect[0]]?.detail[keyItemSelect[1]][keyItemSelect[2]]?.value !== selectedTeam?.value) {
      setValueSelectNew(odds[keyItemSelect[0]]?.detail[keyItemSelect[1]][keyItemSelect[2]]?.value);
    }

    if (selectedOddsStatus === "green") {
      setAnimationState((prevState) => ({ ...prevState, showGreen: true }));
      setTimeout(() => {
        setAnimationState((prevState) => ({ ...prevState, showGreen: false }));
      }, 1500);
    } else if (selectedOddsStatus === "red") {
      setAnimationState((prevState) => ({ ...prevState, showRed: true }));
      setTimeout(() => {
        setAnimationState((prevState) => ({ ...prevState, showRed: false }));
      }, 1500);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [oddsStatus]);

  if (showErrorConfirm) {
    return (
      <Dialog open={showErrorConfirm}>
        <DialogContent className="sm:max-w-md text-center rounded-sm w-[80%] bg-backgroundColor-main text-text-main">
          <DialogHeader>
            <DialogDescription className="py-4 text-text-main text-[15px]">
              Hiện có giao dịch khác đang được xử lý. Vui lòng thử lại sau giây lát!
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-start">
            <Button onClick={() => setErrorConfirm(false)} type="button" variant="secondary">
              Đóng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }
  if (isIphone) {
    return (
      <DialogGame open={openDialog}>
        <Accordion type="multiple" value={openItems} onValueChange={onValueChange} className="w-full">
          {odds.map((oddsGroup: IOddsDetail, index: number) => (
            <AccordionItem value={`item-${index + 1}`} key={index}>
              <AccordionTrigger className="text-sm font-bold py-[0.6rem] text-[rgba(255,255,255,1)]">
                {oddsGroup?.name_Odds}
              </AccordionTrigger>
              <AccordionContent>
                <DialogTriggerGame
                  asChild
                  onClick={() => {
                    if (oddsGroup.status !== 2 && !disableOdds) {
                      setOpenDialog(true);
                    }
                  }}
                >
                  <div className="grid grid-cols-2 gap-[6px]">
                    {oddsGroup?.detail?.map((match: any, matchIndex: number) => {
                      return match?.map((team: IOdds, teamIndex: number) => {
                        const statusKey = `${index}-${matchIndex}-${teamIndex}`;
                        const isDisabled = oddsGroup.status === 2;
                        return (
                          <div
                            className="text-primary-foreground px-2 text-xs relative bg-[rgba(41,53,67,1)] rounded-[5px] h-[30px]"
                            key={teamIndex}
                            onClick={() => handleSelectTeam(statusKey, team, oddsGroup.name_Odds)}
                          >
                            {team.altLineId === 0 && (
                              <div className="absolute top-[1px] left-[1px]">
                                <svg
                                  width="7"
                                  height="7"
                                  fill={`${isDisabled || disableOdds ? "rgba(123,105,66,1)" : "#ffc13b"}`}
                                  viewBox="0 0 24 24"
                                >
                                  <polygon points="12 2 15 9 22 9 17 14 19 21 12 17 5 21 7 14 2 9 9 9" />
                                </svg>
                              </div>
                            )}
                            {animationState.showBlink && (
                              <>
                                <m.div
                                  className="absolute rotate-[45deg] right-0 top-[2px] transform translate-y-1/2 w-0 h-0 border-l-5 border-l-transparent border-r-5 border-r-transparent border-b-[5px] border-b-green-500"
                                  style={{ display: oddsStatus[statusKey] === "green" ? "block" : "none" }}
                                  animate={{ opacity: [0, 1, 0], rotate: [35] }}
                                  transition={{ duration: 0.5, repeat: Infinity }}
                                ></m.div>

                                <m.div
                                  className="absolute rotate-[-45deg] right-0 bottom-1 transform translate-y-1/2 w-0 h-0 border-l-5 border-l-transparent border-r-5 border-r-transparent border-t-[5px] border-t-red-500"
                                  style={{ display: oddsStatus[statusKey] === "red" ? "block" : "none" }}
                                  animate={{ opacity: [0, 1, 0], rotate: [-45] }}
                                  transition={{ duration: 0.5, repeat: Infinity }}
                                ></m.div>
                              </>
                            )}

                            <div className="grid grid-cols-12 w-full h-full items-center ">
                              <div
                                style={{
                                  maskImage: "linear-gradient(90deg, rgba(0, 0, 0, 1) 80%, rgba(0, 0, 0, 0) 100%)",
                                }}
                                className={`col-span-9 text-xs font-medium ${
                                  isDisabled || disableOdds ? "text-[rgba(74,86,100,1)]" : "text-[rgba(138,145,159,1)]"
                                } overflow-hidden whitespace-nowrap`}
                              >
                                {team.rate_odds !== undefined && `(${team.rate_odds})`} {team.name}
                              </div>
                              <div className=" col-span-3 text-end flex items-center justify-end text-xs font-medium text-text-red ">
                                {team.value && (
                                  <span
                                    className={`${
                                      team.value >= 0
                                        ? isDisabled || disableOdds
                                          ? "text-[rgba(46,89,57,1)]"
                                          : "text-text-green w-12"
                                        : isDisabled || disableOdds
                                        ? "text-[rgba(121,61,58,1)]"
                                        : "text-text-red w-12"
                                    } `}
                                  >
                                    {team.value}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      });
                    })}
                  </div>
                </DialogTriggerGame>
              </AccordionContent>
            </AccordionItem>
          ))}
          <DialogContentGame className="bg-backgroundColor-main  w-full">
            <DialogHeaderGame className="flex flex-row justify-between items-center mt-[-5px]">
              <DialogTitleGame className="text-[20px] text-left text-text-light mt-1">
                Thông tin kèo đã chọn
              </DialogTitleGame>
              <Icon
                onClick={() => setOpenDialog(false)}
                icon="iconoir:cancel"
                className="text-white h-7 w-7 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
              />
            </DialogHeaderGame>
            <div className=" py-4 px-4 mt-[-10px]">
              <div className="col-span-10 text-gray-300  flex flex-row items-center ">
                <Icon icon="ph:soccer-ball-fill" width="20px" height="20px" />
                {dataScreenInfo?.liveStatus && (
                  <Icon
                    icon="fluent:live-20-filled"
                    className="ml-1"
                    width={20}
                    height={20}
                    color="rgba(255,69,58,1)"
                  />
                )}
                <p className="pl-2 text-base text-[#fafafa]">{oddsName}</p>
              </div>
              <div className="w-full pt-4">
                <div className="flex flex-row justify-start gap-2 text-[16px]">
                  <p className="text-text-noActive w-32">Cược vào :</p>
                  <p className="text-text-light">{selectedTeam?.name}</p>
                </div>
                {selectedTeam?.rate_odds !== null && selectedTeam?.rate_odds !== undefined && (
                  <div className="flex flex-row justify-start gap-2 text-[16px]">
                    <p className="text-text-noActive w-32">Kèo :</p>
                    <p className="text-text-light">{selectedTeam?.rate_odds}</p>
                  </div>
                )}
                <div className="flex flex-row justify-start gap-2 text-[16px]">
                  <p className="text-text-noActive w-32">Tỷ lệ cược :</p>
                  <div className="flex flex-row items-center gap-2">
                    <p
                      className={`${
                        odds[keyItemSelect[0]]?.detail[keyItemSelect[1]][keyItemSelect[2]]?.value >= 0
                          ? "text-text-green"
                          : "text-text-red"
                      } text-lg font-bold`}
                    >
                      {!valueSelectNew ? selectedTeam?.value : valueSelectNew}
                    </p>
                    {animationState.showGreen ? (
                      <m.div
                        className="w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-b-[9px] border-b-green-500"
                        animate={{ opacity: [0, 1, 0], rotate: [0] }}
                        transition={{ duration: 0.5, repeat: Infinity }}
                      ></m.div>
                    ) : animationState.showRed ? (
                      <m.div
                        className="transform translate-y-1/2 w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-t-[8px] border-t-red-500"
                        animate={{ opacity: [0, 1, 0], rotate: [0] }}
                        transition={{ duration: 0.5, repeat: Infinity }}
                      ></m.div>
                    ) : null}
                  </div>
                </div>
                <div className="flex flex-row gap-2 w-full  text-yellow-400 pt-4 h-5">
                  {selectedTeam && valueSelectNew && (
                    <>
                      <Icon icon="icon-park-solid:attention" className=" w-5" />
                      <p className="text-[12px] w-full ">{`Tỷ lệ cược đã thay đổi từ ${selectedTeam.value} thành ${valueSelectNew}`}</p>
                    </>
                  )}
                </div>
              </div>
            </div>
            <DialogFooterGame>
              <DialogCloseGame onClick={() => setOpenDialog(false)}>
                <Button
                  className="w-full rounded-full text-text-light font-medium no-underline bg-backgroundColor-main"
                  style={{
                    border: "solid 1px #41576f",
                  }}
                >
                  Hủy
                </Button>
              </DialogCloseGame>
              <Button
                disabled={disableBtn}
                className="h-11 rounded-full font-medium text-text-light  mb-2"
                onClick={handleConfirmBet}
                style={{
                  backgroundColor: "#006EF8",
                }}
              >
                {disableBtn && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}
                Xác nhận
              </Button>
            </DialogFooterGame>
          </DialogContentGame>
        </Accordion>
      </DialogGame>
    );
  } else {
    return (
      <Drawer
        onClose={() => {
          setSelectedTeam(null);
          setValueSelectNew(undefined);
          setOpenDrawer(false);
        }}
        open={openDrawer}
      >
        <Accordion type="multiple" value={openItems} onValueChange={onValueChange} className="w-full">
          {odds.map((oddsGroup: IOddsDetail, index: number) => (
            <AccordionItem value={`item-${index + 1}`} key={index}>
              <AccordionTrigger className="text-sm font-bold py-[0.6rem] text-[rgba(255,255,255,1)]">
                {oddsGroup?.name_Odds}
              </AccordionTrigger>
              <AccordionContent>
                <DrawerTrigger
                  asChild
                  onClick={() => {
                    if (oddsGroup.status !== 2 && !disableOdds) {
                      setOpenDrawer(true);
                    }
                  }}
                >
                  <div
                    className="grid grid-cols-2 gap-[6px]"
                    onClick={() => oddsGroup.status !== 2 && !disableOdds && setOpenDrawer(true)}
                  >
                    {oddsGroup?.detail?.map((match: any, matchIndex: number) => {
                      return match?.map((team: IOdds, teamIndex: number) => {
                        const statusKey = `${index}-${matchIndex}-${teamIndex}`;
                        const isDisabled = oddsGroup.status === 2;
                        return (
                          <div
                            className="text-primary-foreground px-2 h-[30px] text-xs relative bg-[rgba(41,53,67,1)] rounded-[5px]"
                            key={teamIndex}
                            onClick={() => handleSelectTeam(statusKey, team, oddsGroup.name_Odds)}
                          >
                            {team.altLineId === 0 && (
                              <div className="absolute top-[2px] left-[2px]">
                                <svg
                                  width="7"
                                  height="7"
                                  fill={`${isDisabled || disableOdds ? "rgba(123,105,66,1)" : "#ffc13b"}`}
                                  viewBox="0 0 24 24"
                                >
                                  <polygon points="12 2 15 9 22 9 17 14 19 21 12 17 5 21 7 14 2 9 9 9" />
                                </svg>
                              </div>
                            )}
                            {animationState.showBlink && (
                              <>
                                <m.div
                                  className="absolute rotate-[45deg] right-0 top-[2px] transform translate-y-1/2 w-0 h-0 border-l-5 border-l-transparent border-r-5 border-r-transparent border-b-[5px] border-b-green-500"
                                  style={{ display: oddsStatus[statusKey] === "green" ? "block" : "none" }}
                                  animate={{ opacity: [0, 1, 0], rotate: [35] }}
                                  transition={{ duration: 0.5, repeat: Infinity }}
                                ></m.div>

                                <m.div
                                  className="absolute rotate-[-45deg] right-0 bottom-1 transform translate-y-1/2 w-0 h-0 border-l-5 border-l-transparent border-r-5 border-r-transparent border-t-[5px] border-t-red-500"
                                  style={{ display: oddsStatus[statusKey] === "red" ? "block" : "none" }}
                                  animate={{ opacity: [0, 1, 0], rotate: [-45] }}
                                  transition={{ duration: 0.5, repeat: Infinity }}
                                ></m.div>
                              </>
                            )}

                            <div className="grid grid-cols-12 w-full h-full items-center ">
                              <div
                                style={{
                                  maskImage: "linear-gradient(90deg, rgba(0, 0, 0, 1) 80%, rgba(0, 0, 0, 0) 100%)",
                                }}
                                className={`col-span-9 text-xs font-medium ${
                                  isDisabled || disableOdds ? "text-[rgba(74,86,100,1)]" : "text-[rgba(138,145,159,1)]"
                                } overflow-hidden whitespace-nowrap`}
                              >
                                {team.rate_odds !== undefined && `(${team.rate_odds})`} {team.name}
                              </div>
                              <div className=" col-span-3 text-end flex items-center justify-end text-xs font-medium text-text-red ">
                                {team.value && (
                                  <span
                                    className={`${
                                      team.value >= 0
                                        ? isDisabled || disableOdds
                                          ? "text-[rgba(46,89,57,1)]"
                                          : "text-text-green w-12"
                                        : isDisabled || disableOdds
                                        ? "text-[rgba(121,61,58,1)]"
                                        : "text-text-red w-12"
                                    } `}
                                  >
                                    {team.value}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      });
                    })}
                  </div>
                </DrawerTrigger>
              </AccordionContent>
            </AccordionItem>
          ))}
          <DrawerContent className="bg-backgroundColor-main  w-full">
            <DrawerHeader>
              <DrawerTitle className="text-[20px] text-left text-text-light">Thông tin kèo đã chọn</DrawerTitle>
            </DrawerHeader>
            <div className=" py-4 px-4 mt-[-10px]">
              <div className="col-span-10 text-gray-300  flex flex-row items-center ">
                <Icon icon="ph:soccer-ball-fill" width="20px" height="20px" />
                {dataScreenInfo?.liveStatus && (
                  <Icon
                    icon="fluent:live-20-filled"
                    className="ml-1"
                    width={20}
                    height={20}
                    color="rgba(255,69,58,1)"
                  />
                )}
                <p className="pl-2 text-base text-[#fafafa]">{oddsName}</p>
              </div>
              <div className="w-full pt-4">
                <div className="flex flex-row justify-start gap-2 text-[16px]">
                  <p className="text-text-noActive w-32">Cược vào :</p>
                  <p className="text-text-light">{selectedTeam?.name}</p>
                </div>
                {selectedTeam?.rate_odds !== null && selectedTeam?.rate_odds !== undefined && (
                  <div className="flex flex-row justify-start gap-2 text-[16px]">
                    <p className="text-text-noActive w-32">Kèo :</p>
                    <p className="text-text-light">{selectedTeam?.rate_odds}</p>
                  </div>
                )}
                <div className="flex flex-row justify-start gap-2 text-[16px]">
                  <p className="text-text-noActive w-32">Tỷ lệ cược :</p>
                  <div className="flex flex-row items-center gap-2">
                    <p
                      className={`${
                        odds[keyItemSelect[0]]?.detail[keyItemSelect[1]][keyItemSelect[2]]?.value >= 0
                          ? "text-text-green"
                          : "text-text-red"
                      } text-lg font-bold`}
                    >
                      {!valueSelectNew ? selectedTeam?.value : valueSelectNew}
                    </p>
                    {animationState.showGreen ? (
                      <m.div
                        className="w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-b-[9px] border-b-green-500"
                        animate={{ opacity: [0, 1, 0], rotate: [0] }}
                        transition={{ duration: 0.5, repeat: Infinity }}
                      ></m.div>
                    ) : animationState.showRed ? (
                      <m.div
                        className="transform translate-y-1/2 w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-t-[8px] border-t-red-500"
                        animate={{ opacity: [0, 1, 0], rotate: [0] }}
                        transition={{ duration: 0.5, repeat: Infinity }}
                      ></m.div>
                    ) : null}
                  </div>
                </div>
                <div className="flex flex-row gap-2 w-full  text-yellow-400 pt-4 h-5">
                  {selectedTeam && valueSelectNew && (
                    <>
                      <Icon icon="icon-park-solid:attention" className=" w-5" />
                      <p className="text-[12px] w-full ">{`Tỷ lệ cược đã thay đổi từ ${selectedTeam.value} thành ${valueSelectNew}`}</p>
                    </>
                  )}
                </div>
              </div>
            </div>
            <DrawerFooter>
              <Button
                disabled={disableBtn}
                className="h-11 rounded-full font-medium text-text-light"
                onClick={handleConfirmBet}
                style={{
                  backgroundColor: "#006EF8",
                }}
              >
                {disableBtn && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}
                Xác nhận
              </Button>

              <DrawerClose onClick={() => setOpenDrawer(false)}>
                <Button
                  className="w-full rounded-full text-text-light font-medium no-underline mb-2 bg-backgroundColor-main"
                  style={{
                    border: "solid 1px #41576f",
                  }}
                >
                  Hủy
                </Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Accordion>
      </Drawer>
    );
  }
}
