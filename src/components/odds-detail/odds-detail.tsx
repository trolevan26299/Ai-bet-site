"use client";

import { fetchNewOddsValue } from "@/utils/fetchNewOddsRandom";
import { ArrowDownIcon, ArrowUpIcon } from "@radix-ui/react-icons";
import React, { useEffect, useState } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const initialOdds = [
  {
    name_Odds: "Kèo cược chấp - Toàn trận",
    detail: [
      [
        { name: "SSC Napoli", rate_odds: -0.5, value: -0.98 },
        { name: "Atalanta", rate_odds: 0.5, value: 0.73 },
      ],
      [
        { name: "SSC Napoli", rate_odds: 0, value: -0.69 },
        { name: "Atalanta", rate_odds: 0, value: 0.98 },
      ],
      [
        { name: "SSC Napoli", rate_odds: -1.5, value: -0.7 },
        { name: "Atalanta", rate_odds: 1.5, value: 0.3 },
      ],
    ],
  },
  {
    name_Odds: "Kèo tài xỉu - Toàn trận",
    detail: [
      [
        { name: "Tài", rate_odds: 0.5, value: 0.17 },
        { name: "Xỉu", rate_odds: 0.5, value: 0.17 },
      ],
      [
        { name: "Tài", rate_odds: 1, value: 0.17 },
        { name: "Xỉu", rate_odds: 1, value: 0.17 },
      ],
      [
        { name: "Tài", rate_odds: 1.5, value: 0.17 },
        { name: "Xỉu", rate_odds: 1.5, value: 0.17 },
      ],
    ],
  },
  {
    name_Odds: "Kèo cược chấp - Hiệp 1",
    detail: [
      [
        { name: "SSC Napoli", rate_odds: -0.5, value: -0.98 },
        { name: "Atalanta", rate_odds: 0.5, value: 0.73 },
      ],
      [
        { name: "SSC Napoli", rate_odds: 0, value: -0.69 },
        { name: "Atalanta", rate_odds: 0, value: 0.98 },
      ],
      [
        { name: "SSC Napoli", rate_odds: -1.5, value: -0.7 },
        { name: "Atalanta", rate_odds: 1.5, value: 0.3 },
      ],
    ],
  },
];

export default function OddsDetail({}) {
  const [odds, setOdds] = useState(initialOdds);
  const [latestOdds, setLatestOdds] = useState(initialOdds);
  const [openItems, setOpenItems] = useState(["item-1", "item-2", "item-3"]);

  const handleValueChange = (value: string[]) => {
    setOpenItems(value);
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      setOdds((currentOdds) => {
        setLatestOdds(currentOdds);
        return currentOdds.map((group) => ({
          ...group,
          detail: group.detail.map((match) =>
            match.map((team) => ({
              ...team,
              value: fetchNewOddsValue(team.value),
            }))
          ),
        }));
      });
    }, 3000);

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
            odds={[odds[0], odds[2]]}
            latestOdds={latestOdds}
            openItems={openItems}
            onValueChange={handleValueChange}
          />
        </TabsContent>

        <TabsContent value="3">
          <RenderAccordion
            odds={[odds[1]]}
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
  return (
    <Accordion type="multiple" value={openItems} onValueChange={onValueChange} className="w-full">
      {odds.map((oddsGroup: any, index: number) => (
        <AccordionItem key={index} value={`item-${index + 1}`}>
          <AccordionTrigger>{oddsGroup.name_Odds}</AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-2 gap-4">
              {oddsGroup.detail.map((match: any, matchIndex: any) => (
                <React.Fragment key={matchIndex}>
                  {match.map((team: any, teamIndex: any) => (
                    <div className="bg-slate-700 text-primary-foreground p-2 h-8 rounded-md text-xs" key={teamIndex}>
                      <div className="grid grid-cols-3">
                        <div className="col-span-2 text-gray-300 font-bold">
                          {team.rate_odds >= 0 ? `(${team.rate_odds})` : team.rate_odds} {team.name}
                        </div>
                        <div className="text-end flex items-center justify-end font-bold  pr-0.5">
                          {team.value > latestOdds[index].detail[matchIndex][teamIndex].value && (
                            <span style={{ color: "green" }}>
                              <ArrowUpIcon />
                            </span>
                          )}
                          {team.value < latestOdds[index].detail[matchIndex][teamIndex].value && (
                            <span style={{ color: "red" }}>
                              <ArrowDownIcon />
                            </span>
                          )}
                          <span className="w-8">{team.value}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </React.Fragment>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
