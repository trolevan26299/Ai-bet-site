"use client";

import { fetchOddsData } from "@/api/odds";
import { Button } from "@/components/ui/button";
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
import { IBetDetail, IMatchData, IOdds, IOddsDetail } from "@/types/odds.types";
import { Icon } from "@iconify/react";
import { use, useEffect, useState } from "react";
import { m } from "framer-motion";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../../ui/accordion";

interface ITeamDetail {
  name: string;
  rate_odds: number;
  value: number;
}
type OddsStatusType = Record<string, "green" | "red" | "none">;

const transformData = (data: IMatchData[]) => {
  return data
    .map((item: IMatchData) => {
      const keoChinhToanTran = item.bets.spreads.find((bet: IBetDetail) => bet.number === 0 && bet.altLineId === 0);
      const keoChinhHiep1 = item.bets.spreads.find((bet: IBetDetail) => bet.number === 1 && bet.altLineId === 0);
      const keoChinhTaiXiu = item.bets.totals.find((bet: IBetDetail) => bet.altLineId === 0);

      const spreadsToanTran =
        keoChinhToanTran &&
        item.bets.spreads
          .filter(
            (bet: IBetDetail) =>
              bet.number === 0 &&
              (bet.hdp === (keoChinhToanTran?.hdp || 0) - 0.25 ||
                bet.altLineId === 0 ||
                bet.hdp === (keoChinhToanTran.hdp || 0) + 0.25) // bỏ dòng này lấy ra tất cả
          )
          .slice(0, 3);

      const spreadsHiep1 =
        keoChinhHiep1 &&
        item.bets.spreads
          .filter(
            (bet: IBetDetail) =>
              bet.number === 1 &&
              (bet.hdp === (keoChinhHiep1.hdp || 0) - 0.25 ||
                bet.altLineId === 0 ||
                bet.hdp === (keoChinhHiep1.hdp || 0) + 0.25) // bỏ dòng này lấy ra tất cả
          )
          .slice(0, 3);

      const spreadsTaiXiu =
        keoChinhTaiXiu &&
        item.bets.totals
          .filter(
            (bet: IBetDetail) =>
              bet.points === (keoChinhTaiXiu.points || 0) - 0.25 ||
              bet.altLineId === 0 ||
              bet.points === (keoChinhTaiXiu.points || 0) + 0.25 // bỏ dòng này lấy ra tất cả
          )
          .slice(0, 3);

      return [
        {
          name_Odds: "Kèo cược chấp - Toàn trận",
          detail:
            spreadsToanTran &&
            spreadsToanTran.map((spread: IBetDetail) => [
              {
                name: item.home,
                rate_odds: spread.hdp,
                value: spread.home,
              },
              {
                name: item.away,
                rate_odds: spread.hdp === 0 ? 0 : spread.hdp ?? 0 >= 0 ? -(spread.hdp ?? 0) : Math.abs(spread.hdp ?? 0),
                value: spread.away,
              },
            ]),
        },
        {
          name_Odds: "Kèo cược chấp - Hiệp 1",
          detail:
            spreadsHiep1 &&
            spreadsHiep1.map((spread: IBetDetail) => [
              {
                name: item.home,
                rate_odds: spread.hdp,
                value: spread.home,
              },
              {
                name: item.away,
                rate_odds: spread.hdp === 0 ? 0 : spread.hdp ?? 0 >= 0 ? -(spread.hdp ?? 0) : Math.abs(spread.hdp ?? 0),
                value: spread.away,
              },
            ]),
        },
        {
          name_Odds: "Kèo tài xỉu - Toàn trận",
          detail:
            spreadsTaiXiu &&
            spreadsTaiXiu.map((total: IBetDetail) => [
              { name: "Tài", rate_odds: total.points, value: total.over },
              { name: "Xỉu", rate_odds: total.points, value: total.under },
            ]),
        },
      ];
    })
    .flat();
};

export default function OddsDetail({}) {
  const [odds, setOdds] = useState<IOddsDetail[]>([]);
  const [latestOdds, setLatestOdds] = useState<IOddsDetail[]>([]);
  const [openItems, setOpenItems] = useState(["item-1", "item-2", "item-3"]);
  const [live, setLive] = useState(false);
  const [oddsStatus, setOddsStatus] = useState<OddsStatusType>({});

  const handleValueChange = (value: string[]) => {
    setOpenItems(value);
  };
  const updateOddsStatus = (newOddsStatus: OddsStatusType) => {
    setOddsStatus(newOddsStatus);
  };
  // useEffect chỉ để fetch và set dữ liệu lần đầu tiên
  useEffect(() => {
    async function fetchAndSetInitialOdds() {
      const newData = await fetchOddsData();
      const transformedData = transformData(newData);
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
      setLatestOdds(transformedData as unknown as IOddsDetail[]);
      setLive(newData[0].liveStatus);
      setOddsStatus(newOddsStatus);
    }

    const intervalId = setInterval(fetchAndUpdateOdds, 5000);
    return () => clearInterval(intervalId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [latestOdds]);

  return (
    <>
      <Tabs defaultValue="1" className="w-full">
        <TabsList className="w-full gap-3 justify-between">
          <TabsTrigger value="1">Tất cả kèo</TabsTrigger>
          <TabsTrigger value="2">Kèo cược chấp</TabsTrigger>
          <TabsTrigger value="3">Kèo tài xỉu</TabsTrigger>
        </TabsList>

        <TabsContent value="1">
          <RenderAccordion
            odds={odds}
            latestOdds={latestOdds}
            live={live}
            openItems={openItems}
            oddsStatus={oddsStatus}
            onValueChange={handleValueChange}
          />
        </TabsContent>

        <TabsContent value="2">
          <RenderAccordion
            odds={[odds[0], odds[1]]}
            latestOdds={[latestOdds[0], latestOdds[1]]}
            live={live}
            openItems={openItems}
            oddsStatus={oddsStatus}
            onValueChange={handleValueChange}
          />
        </TabsContent>

        <TabsContent value="3">
          <RenderAccordion
            odds={[odds[2]]}
            latestOdds={[latestOdds[2]]}
            live={live}
            openItems={openItems}
            oddsStatus={oddsStatus}
            onValueChange={handleValueChange}
          />
        </TabsContent>
      </Tabs>
    </>
  );
}

function RenderAccordion({
  odds,
  live,
  openItems,
  onValueChange,
  oddsStatus,
  latestOdds,
}: {
  odds: IOddsDetail[];
  live: boolean;
  openItems: string[];
  onValueChange: (value: string[]) => void;
  oddsStatus: OddsStatusType;
  latestOdds: IOddsDetail[];
}) {
  const [selectedTeam, setSelectedTeam] = useState<ITeamDetail | null>(null);
  const [valueSelectNew, setValueSelectNew] = useState<number | undefined>(undefined);
  const [oddsName, setOddsName] = useState<String>("");
  const [keyItemSelect, setKeyItemSelect] = useState<number[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  const handleSelectTeam = (statusKey: string, team: IOdds, oddsName: string) => {
    const keyArray = statusKey.split("-").map(Number);
    setKeyItemSelect(keyArray);
    setSelectedTeam(team);
    setOddsName(oddsName);
  };

  useEffect(() => {
    if (odds[keyItemSelect[0]]?.detail[keyItemSelect[1]][keyItemSelect[2]]?.value !== selectedTeam?.value) {
      setValueSelectNew(odds[keyItemSelect[0]]?.detail[keyItemSelect[1]][keyItemSelect[2]]?.value);
    }
    if (!isInitialized) {
      setIsInitialized(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [odds, isInitialized]);
  if (!isInitialized) {
    return null;
  }
  console.log("keyItemSelect", odds[keyItemSelect[0]]?.detail[keyItemSelect[1]][keyItemSelect[2]]?.value);
  return (
    <Drawer
      onClose={() => {
        setSelectedTeam(null);
        setValueSelectNew(undefined);
      }}
    >
      <Accordion type="multiple" value={openItems} onValueChange={onValueChange} className="w-full">
        {odds.map((oddsGroup: IOddsDetail, index: number) => (
          <AccordionItem value={`item-${index + 1}`} key={index}>
            <AccordionTrigger className="text-base">{oddsGroup?.name_Odds}</AccordionTrigger>
            <AccordionContent>
              <DrawerTrigger asChild>
                <div className="grid grid-cols-2 gap-[6px]">
                  {oddsGroup?.detail.map((match: any, matchIndex: number) => {
                    return match.map((team: IOdds, teamIndex: number) => {
                      const statusKey = `${index}-${matchIndex}-${teamIndex}`;
                      return (
                        <div
                          className="text-primary-foreground p-2 h-10 text-xs relative bg-[#28374a] rounded-[10px]"
                          key={teamIndex}
                          onClick={() => handleSelectTeam(statusKey, team, oddsGroup.name_Odds)}
                        >
                          <m.div
                            className="absolute rotate-[45deg] right-0 top-[2px] transform translate-y-1/2 w-0 h-0 border-l-6 border-l-transparent border-r-6 border-r-transparent border-b-[8px] border-b-green-500"
                            style={{ display: oddsStatus[statusKey] === "green" ? "block" : "none" }}
                            animate={{ opacity: [0, 1, 0], rotate: [35] }}
                            transition={{ duration: 0.5, repeat: Infinity }}
                          ></m.div>
                          <m.div
                            className="absolute rotate-[-45deg] right-0 bottom-1 transform translate-y-1/2 w-0 h-0 border-l-6 border-l-transparent border-r-6 border-r-transparent border-t-[8px] border-t-red-500"
                            style={{ display: oddsStatus[statusKey] === "red" ? "block" : "none" }}
                            animate={{ opacity: [0, 1, 0], rotate: [-45] }}
                            transition={{ duration: 0.5, repeat: Infinity }}
                          ></m.div>

                          <div className="grid grid-cols-3 w-full h-full items-center">
                            <div className="col-span-2 text-gray-300  text-sm font-medium text-text-noActive">
                              {team.rate_odds >= 0 ? `(${team.rate_odds})` : team.rate_odds} {team.name}
                            </div>
                            <div className="text-end flex items-center justify-end text-sm font-medium text-text-red ">
                              {team.value && (
                                <span className={`${team.value >= 0 ? "text-text-green w-12" : "text-text-red w-12"} `}>
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
        <DrawerContent className="bg-backgroundColor-main rounded-t-3xl ">
          <DrawerHeader>
            <DrawerTitle className="text-[20px] text-left text-text-light">Thông tin kèo đã chọn</DrawerTitle>
          </DrawerHeader>
          <div className=" py-4 px-4 mt-[-10px]">
            <div className="col-span-10 text-gray-300  flex flex-row items-center">
              <Icon icon="ph:soccer-ball-fill" width="20px" height="20px" />
              {live && (
                <Icon icon="fluent:live-20-filled" className="ml-1" width={20} height={20} color="rgba(255,69,58,1)" />
              )}
              <p className="pl-2 text-base text-[#fafafa]">{oddsName}</p>
            </div>
            <div className="w-full pt-4">
              <div className="flex flex-row justify-start gap-2 text-[16px]">
                <p className="text-text-noActive w-32">Cược vào :</p>
                <p className="text-text-light">{selectedTeam?.name}</p>
              </div>
              <div className="flex flex-row justify-start gap-2 text-[16px]">
                <p className="text-text-noActive w-32">Kèo :</p>
                <p className="text-text-light">{selectedTeam?.rate_odds}</p>
              </div>
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
                  {valueSelectNew &&
                    selectedTeam &&
                    (valueSelectNew > selectedTeam?.value ? (
                      <Icon icon="bxs:up-arrow" className="text-text-green" />
                    ) : (
                      <Icon icon="bxs:down-arrow" className="text-text-red" />
                    ))}
                </div>
              </div>
              <div className="flex flex-row gap-2 w-full  text-yellow-400 pt-4">
                <Icon icon="icon-park-solid:attention" className=" w-5" />
                {selectedTeam && valueSelectNew && (
                  <p className="text-[12px] w-full ">{`Tỷ lệ cược đã thay đổi từ ${selectedTeam.value} thành ${valueSelectNew}`}</p>
                )}
              </div>
            </div>
          </div>
          <DrawerFooter>
            <Button
              className="h-11 flex flex-col justify-center rounded-full font-medium"
              style={{
                backgroundColor: "#006EF8",
              }}
            >
              Đặt cược
            </Button>

            <DrawerClose>
              <Button
                variant="link"
                className="w-full rounded-full text-text-light font-medium"
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
