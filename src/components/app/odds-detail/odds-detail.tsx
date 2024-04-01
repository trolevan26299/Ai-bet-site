"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { fetchNewOddsValue } from "@/utils/fetchNewOddsRandom";
import { ArrowDownIcon, ArrowUpIcon } from "@radix-ui/react-icons";
import React, { useEffect, useState } from "react";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../../ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { fetchOddsData } from "@/api/odds";

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
      <Tabs defaultValue="1">
        <TabsList className="w-full bg-none">
          <TabsTrigger value="1">Tất cả kèo</TabsTrigger>
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
  const handleSelectTeam = (team: any) => {
    setSelectedTeam(team);
  };
  return (
    <Dialog>
      <Accordion type="multiple" value={openItems} onValueChange={onValueChange} className="w-full">
        {odds.map((oddsGroup: any, index: number) => (
          <AccordionItem value={`item-${index + 1}`} key={index}>
            <AccordionTrigger>{oddsGroup.name_Odds}</AccordionTrigger>
            <AccordionContent>
              <DialogTrigger asChild>
                <div className="grid grid-cols-2 gap-4">
                  {oddsGroup.detail.map((match: any, matchIndex: any) => (
                    <React.Fragment key={matchIndex}>
                      {match.map((team: any, teamIndex: any) => (
                        <div
                          className="bg-slate-700 text-primary-foreground p-2 h-8 rounded-md text-xs"
                          key={teamIndex}
                          onClick={() => handleSelectTeam(team)}
                        >
                          <div className="grid grid-cols-3 w-full">
                            <div className="col-span-2 text-gray-300 font-bold">
                              {team.rate_odds >= 0 ? `(${team.rate_odds})` : team.rate_odds} {team.name}
                            </div>
                            <div className="text-end flex items-center justify-end font-bold ">
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
                              <span className="w-10">{team.value}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </React.Fragment>
                  ))}
                </div>
              </DialogTrigger>
            </AccordionContent>
          </AccordionItem>
        ))}
        <DialogContent className="w-4/6 rounded-lg">
          <DialogHeader>
            <DialogTitle className="text-left">Thông tin kèo đã chọn</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-5 items-center gap-4 ">
              <Label className="text-left col-span-2 ">Cược vào</Label>
              <p>:</p>
              <p>{selectedTeam?.name}</p>
            </div>
            <div className="grid grid-cols-5 items-center gap-4">
              <Label className="text-left col-span-2">Kèo</Label>
              <p>:</p>
              <p>{selectedTeam?.rate_odds}</p>
            </div>
            <div className="grid grid-cols-5 items-center gap-4">
              <Label className="text-left col-span-2">Tỷ lệ cược</Label>
              <p>:</p>
              <p>{selectedTeam?.value}</p>
            </div>
          </div>
          <DialogFooter className="grid grid-cols-2 space-x-2">
            <Button type="reset" variant="destructive" className="col-span-1">
              Hủy
            </Button>
            <Button type="submit" variant="default" className="col-span-1">
              Xác nhận
            </Button>
          </DialogFooter>
        </DialogContent>
      </Accordion>
    </Dialog>
  );
}
