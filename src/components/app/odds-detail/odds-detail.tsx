"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React, { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
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
import { Label } from "@/components/ui/label";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../../ui/accordion";

interface ITeamDetail {
  name: string;
  rate_odds: number;
  value: number;
}

const transformData = (data: any) => {
  return data
    .map((item: any) => {
      const keoChinhToanTran = item.bets.spreads.find((bet: any) => bet.number === 0 && bet.altLineId === 0);
      const keoChinhHiep1 = item.bets.spreads.find((bet: any) => bet.number === 1 && bet.altLineId === 0);
      const keoChinhTaiXiu = item.bets.totals.find((bet: any) => bet.altLineId === 0);

      console.log(keoChinhToanTran, keoChinhHiep1);
      const spreadsToanTran = item.bets.spreads
        .filter(
          (bet: any) =>
            bet.number === 0 &&
            (bet.hdp === keoChinhToanTran.hdp - 0.25 || bet.altLineId === 0 || bet.hdp === keoChinhToanTran.hdp + 0.25) // bỏ dòng này lấy ra tất cả
        )
        .slice(0, 3);

      const spreadsHiep1 = item.bets.spreads
        .filter(
          (bet: any) =>
            bet.number === 1 &&
            (bet.hdp === keoChinhHiep1.hdp - 0.25 || bet.altLineId === 0 || bet.hdp === keoChinhHiep1.hdp + 0.25) // bỏ dòng này lấy ra tất cả
        )
        .slice(0, 3);

      const spreadsTaiXiu = item.bets.totals
        .filter(
          (bet: any) =>
            bet.points === keoChinhTaiXiu.points - 0.25 ||
            bet.altLineId === 0 ||
            bet.points === keoChinhTaiXiu.points + 0.25 // bỏ dòng này lấy ra tất cả
        )
        .slice(0, 3);

      return [
        {
          name_Odds: "Kèo cược chấp - Toàn trận",
          detail: spreadsToanTran.map((spread: any) => [
            {
              name: item.home,
              rate_odds: spread.hdp,
              value: spread.home,
            },
            {
              name: item.away,
              rate_odds: spread.hdp === 0 ? 0 : spread.hdp >= 0 ? -spread.hdp : Math.abs(spread.hdp),
              value: spread.away,
            },
          ]),
        },
        {
          name_Odds: "Kèo cược chấp - Hiệp 1",
          detail: spreadsHiep1.map((spread: any) => [
            {
              name: item.home,
              rate_odds: spread.hdp,
              value: spread.home,
            },
            {
              name: item.away,
              rate_odds: spread.hdp === 0 ? 0 : spread.hdp >= 0 ? -spread.hdp : Math.abs(spread.hdp),
              value: spread.away,
            },
          ]),
        },
        {
          name_Odds: "Kèo tài xỉu - Toàn trận",
          detail: spreadsTaiXiu.map((total: any) => [
            { name: "Tài", rate_odds: total.points, value: total.over },
            { name: "Xỉu", rate_odds: total.points, value: total.under },
          ]),
        },
      ];
    })
    .flat();
};

export default function OddsDetail({}) {
  const [odds, setOdds] = useState([]);
  const [latestOdds, setLatestOdds] = useState<any>();
  const [openItems, setOpenItems] = useState(["item-1", "item-2", "item-3"]);

  const backgroundImageStyle = {
    backgroundImage: "url(assets/button_tab.jpg)",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  };

  const handleValueChange = (value: string[]) => {
    setOpenItems(value);
  };

  useEffect(() => {
    const fetchAndSetOdds = async () => {
      const newData = await fetchOddsData();
      const transformedData = transformData(newData);
      setOdds(transformedData);
      setLatestOdds((currentOdds: any) => [...transformedData]);
    };

    fetchAndSetOdds();
    const intervalId = setInterval(fetchAndSetOdds, 3000);

    return () => clearInterval(intervalId);
  }, []);
  return (
    <>
      <Tabs defaultValue="1" className="w-full">
        <TabsList className="w-full gap-3">
          <TabsTrigger value="1" style={openItems.includes("1") ? backgroundImageStyle : {}}>
            Tất cả kèo
          </TabsTrigger>
          <TabsTrigger value="2">Kèo cược chấp</TabsTrigger>
          <TabsTrigger value="3">Kèo tài xỉu</TabsTrigger>
        </TabsList>

        <TabsContent value="1">
          <RenderAccordion
            odds={odds}
            openItems={openItems}
            latestOdds={latestOdds}
            onValueChange={handleValueChange}
          />
        </TabsContent>

        <TabsContent value="2">
          <RenderAccordion
            odds={[odds[0], odds[1]]}
            latestOdds={latestOdds}
            openItems={openItems}
            onValueChange={handleValueChange}
          />
        </TabsContent>

        <TabsContent value="3">
          <RenderAccordion
            odds={[odds[2]]}
            latestOdds={latestOdds}
            openItems={openItems}
            onValueChange={handleValueChange}
          />
        </TabsContent>
      </Tabs>
    </>
  );
}

function RenderAccordion({
  odds,
  openItems,
  onValueChange,
  latestOdds,
}: {
  odds: any;
  openItems: any;
  onValueChange: any;
  latestOdds: any;
}) {
  const [selectedTeam, setSelectedTeam] = useState<ITeamDetail | null>(null);
  const [oddsName, setOddsName] = useState<String>("");
  const handleSelectTeam = (team: any, oddsName: string) => {
    setSelectedTeam(team);
    setOddsName(oddsName);
  };
  return (
    <Drawer>
      <Accordion type="multiple" value={openItems} onValueChange={onValueChange} className="w-full">
        {odds.map((oddsGroup: any, index: number) => (
          <AccordionItem value={`item-${index + 1}`} key={index}>
            <AccordionTrigger className="text-base">{oddsGroup.name_Odds}</AccordionTrigger>
            <AccordionContent>
              <DrawerTrigger asChild>
                <div className="grid grid-cols-2 gap-[6px]">
                  {oddsGroup.detail.map((match: any, matchIndex: any) => (
                    <React.Fragment key={matchIndex}>
                      {match.map((team: any, teamIndex: any) => (
                        <div
                          className="  text-primary-foreground p-2 h-10  text-xs relative bg-cyan-950 "
                          style={{
                            // backgroundColor: "rgba(255, 255, 255, 0.1)",
                            border: "solid 1px rgba(255, 255, 255, 0.1)",
                            borderRadius: "10px",
                          }}
                          key={teamIndex}
                          onClick={() => handleSelectTeam(team, oddsGroup.name_Odds)}
                        >
                          <div className="absolute rotate-45 right-0 top-0 transform translate-y-1/2 w-0 h-0 border-l-6 border-l-transparent border-r-6 border-r-transparent border-b-6 border-b-green-500"></div>
                          {/* <div className="absolute rotate-[-45deg] right-0 bottom-1 transform translate-y-1/2 w-0 h-0 border-l-6 border-l-transparent border-r-6 border-r-transparent border-t-6 border-t-red-500"></div> */}

                          <div className="grid grid-cols-3 w-full h-full items-center">
                            <div className="col-span-2 text-gray-300  text-sm font-medium text-text-noActive">
                              {team.rate_odds >= 0 ? `(${team.rate_odds})` : team.rate_odds} {team.name}
                            </div>
                            <div className="text-end flex items-center justify-end text-sm font-medium text-text-red ">
                              {/* {team.value > latestOdds[index].detail[matchIndex][teamIndex].value && (
                                <span style={{ color: "green" }}>
                                  <ArrowUpIcon />
                                </span>
                              )}
                              {team.value < latestOdds[index].detail[matchIndex][teamIndex].value && (
                                <span style={{ color: "red" }}>
                                  <ArrowDownIcon />
                                </span>
                              )} */}
                              {team.value && (
                                <span className={`${team.value >= 0 ? "text-text-green w-12" : "text-text-red w-12"} `}>
                                  {team.value}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </React.Fragment>
                  ))}
                </div>
              </DrawerTrigger>
            </AccordionContent>
          </AccordionItem>
        ))}
        <DrawerContent className="bg-backgroundColor-main rounded-t-3xl">
          <DrawerHeader>
            <DrawerTitle className="text-[20px] text-left text-text-light">Thông tin kèo đã chọn</DrawerTitle>
          </DrawerHeader>
          <div className=" py-4 px-4 mt-[-10px]">
            <div className="col-span-10 text-gray-300  flex flex-row items-center">
              <Icon icon="ph:soccer-ball-fill" width="20px" height="20px" />
              <p className="pl-2 text-base">{oddsName}</p>
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
                  {selectedTeam && (
                    <p
                      className={`${
                        selectedTeam && selectedTeam?.value >= 0 ? "text-text-green" : "text-text-red"
                      } text-text-light text-lg font-bold`}
                    >
                      {selectedTeam?.value}
                    </p>
                  )}
                  <Icon icon="bxs:up-arrow" className="text-text-green" />
                  {/* <Icon icon="bxs:down-arrow" className="text-text-red" /> */}
                </div>
              </div>
              <div className="flex flex-row gap-2 w-full  text-yellow-400 pt-4">
                <Icon icon="icon-park-solid:attention" className=" w-5" />
                <p className="text-[12px] w-full ">Tỷ lệ cược đã thay đổi từ 0.99 thành 0.95</p>
              </div>
            </div>
          </div>
          <DrawerFooter>
            <Button
              className="h-11 flex flex-col justify-center rounded-full border bg-cover bg-center"
              style={{
                backgroundImage: "url(assets/button_confirm.jpg)",
              }}
            >
              Xác nhận
            </Button>

            <DrawerClose>
              <Button
                variant="link"
                className="w-full rounded-full text-text-light"
                style={{
                  border: "solid 1px rgba(255, 255, 255, 0.5)",
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
