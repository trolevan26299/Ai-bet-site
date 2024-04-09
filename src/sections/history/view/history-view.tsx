"use client";

import { Tabs, TabsContent, TabsList, TabsTriggerHistory } from "@/components/ui/tabs";
import MainLayout from "@/layouts/main/layout";
import { Icon } from "@iconify/react";
import React from "react";
import HistoryOutstanding from "../history-outstanding";
import HistoryWinLoss from "../history-winloss";

const HistoryView = () => {
  const historyData = [
    {
      betId: 2758686862,
      betList: "SETTLED", // là winLose
      time: "2024/01/22 - 21:54:32",
      nameGame: "Bóng đá",
      isLive: false,
      liveScope: "first half",
      game_tpe: "handicap",
      game_scope: "first half",
      game_detail: 1.5,
      odds: 0.826,
      bet: 5,
      risk: 5,
      win: 4.13,
      oddsFormat: "DECIMAL",
      league_name: "Premier League",
      team1: "Crvena Zvezda",
      team2: "Partizan",
    },
    {
      betId: 2758686861,
      betList: "SETTLED", // là winLose
      time: "2024/01/22 - 21:54:32",
      nameGame: "Bóng đá",
      isLive: true,
      liveScope: "first half",
      game_scope: "first half",
      game_tpe: "handicap",
      game_detail: 1.5,
      odds: 0.826,
      bet: 5,
      risk: 5,
      win: 4.13,
      oddsFormat: "DECIMAL",
      league_name: "Premier League",
      team1: "Crvena Zvezda",
      team2: "Partizan",
    },
    {
      betId: 2758686868,
      betList: "RUNNING", // là winLose
      time: "2024/01/22 - 21:54:32",
      nameGame: "Bóng đá",
      isLive: true,
      liveScope: "first half",
      game_tpe: "handicap",
      game_scope: "first half",
      game_detail: 1.5,
      odds: 0.826,
      bet: 5,
      risk: 5,
      win: 4.13,
      oddsFormat: "DECIMAL",
      league_name: "Premier League",
      team1: "Crvena Zvezda",
      team2: "Partizan",
    },
    {
      betId: 2758686868,
      betList: "RUNNING", // là winLose
      time: "2024/01/22 - 21:54:32",
      nameGame: "Bóng đá",
      isLive: false,
      liveScope: "first half",
      game_tpe: "handicap",
      game_scope: "full time",
      game_detail: 1.5,
      odds: 0.826,
      bet: 5,
      risk: 5,
      win: 4.13,
      oddsFormat: "DECIMAL",
      league_name: "Premier League",
      team1: "Crvena Zvezda",
      team2: "Partizan",
    },
  ];
  return (
    <MainLayout>
      <div>
        <Tabs defaultValue="1" className="w-full">
          <TabsList
            className="w-full gap-3  rounded-none h-[46px] justify-between"
            style={{ borderBottom: "1px solid #223a76" }}
          >
            <TabsTriggerHistory value="1">
              <Icon icon="mingcute:time-fill" className="mr-1 text-[#f7b502]" /> Cược đang chờ
            </TabsTriggerHistory>
            <TabsTriggerHistory value="2">
              <Icon icon="lets-icons:flag-finish" className="mr-1 text-[#ff453a]" />
              Cược đã kết thúc
            </TabsTriggerHistory>
          </TabsList>

          <TabsContent value="1">
            <HistoryOutstanding historyData={historyData.filter((item: any) => item.betList === "RUNNING")} />
          </TabsContent>

          <TabsContent value="2">
            <HistoryWinLoss historyData={historyData.filter((item: any) => item.betList === "SETTLED")} />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default HistoryView;
