"use client";

import React, { useEffect, useState } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";
import { ArrowUpIcon, ArrowDownIcon } from "@radix-ui/react-icons";

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

const fetchNewOddsValue = (oldValue: any) => {
  const change = Math.random() < 0.5 ? -Math.random() : Math.random();
  return Number((oldValue + change).toFixed(2));
};

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
    }, 10000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <Accordion type="multiple" value={openItems} onValueChange={handleValueChange} className="w-full">
      {odds.map((oddsGroup, index) => (
        <AccordionItem key={index} value={`item-${index + 1}`}>
          <AccordionTrigger>{oddsGroup.name_Odds}</AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-2 gap-4">
              {oddsGroup.detail.map((match, matchIndex) => (
                <React.Fragment key={matchIndex}>
                  {match.map((team, teamIndex) => (
                    <div className="bg-slate-700 text-primary-foreground p-2 h-8 rounded-md text-xs" key={teamIndex}>
                      <div className="grid grid-cols-3">
                        <div className="col-span-2 text-gray-300 font-bold">
                          {team.rate_odds >= 0 ? `(${team.rate_odds})` : team.rate_odds} {team.name}
                        </div>
                        <div className="text-end flex items-center justify-end font-bold">
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
                          <span
                            className="w-6"
                            // style={{
                            //   color:
                            //     team.value === latestOdds[index].detail[matchIndex][teamIndex].value
                            //       ? "inherit"
                            //       : team.value > latestOdds[index].detail[matchIndex][teamIndex].value
                            //       ? "green"
                            //       : "red",
                            // }}
                          >
                            {team.value}
                          </span>
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
