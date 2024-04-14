"use client";

import { Tabs, TabsContent, TabsList, TabsTriggerHistory } from "@/components/ui/tabs";
import { useTelegram } from "@/context/telegram.provider";
import MainLayout from "@/layouts/main/layout";
import { Icon } from "@iconify/react";
import "../index.css";
import { useEffect, useState } from "react";
import HistoryOutstanding from "../history-outstanding";
import HistoryWinLoss from "../history-winloss";

const HistoryView = () => {
  const telegram = useTelegram();
  const historyData = [
    {
      betId: 2758686862,
      betList: "SETTLED", // là winLose
      time: "2024/01/22 - 21:54:32",
      nameGame: "Bóng đá",
      isLive: false,
      liveScope: "first half",
      game_type: "over under",
      game_scope: "first half",
      game_orientation: "over",
      game_detail: 1.5,
      odds: 0.826,
      bet: 5,
      risk: 5,
      win: 4.13,
      oddsFormat: "DECIMAL",
      league_name: "Premier League",
      team1: "Crvena Zvezda",
      team2: "Partizan",
      starts: "12-4-2024",
    },
    {
      betId: 2758686861,
      betList: "SETTLED", // là winLose
      time: "2024/01/22 - 21:54:32",
      nameGame: "Bóng đá",
      isLive: true,
      liveScope: "first half",
      game_scope: "first half",
      game_type: "handicap",
      game_orientation: "Partizan",
      game_detail: 1.5,
      odds: 0.826,
      bet: 5,
      risk: 5,
      win: 4.13,
      oddsFormat: "DECIMAL",
      league_name: "Premier League",
      team1: "Crvena Zvezda",
      team2: "Partizan",
      starts: "12-4-2024",
    },
    {
      betId: 2758686868,
      betList: "RUNNING", // là winLose
      time: "2024/01/22 - 21:54:32",
      nameGame: "Bóng đá",
      isLive: true,
      liveScope: "first half",
      game_type: "handicap",
      game_scope: "first half",
      game_orientation: "Partizan",
      game_detail: 1.5,
      odds: 0.826,
      bet: 5,
      risk: 5,
      win: 4.13,
      oddsFormat: "DECIMAL",
      league_name: "Premier League",
      team1: "Crvena Zvezda",
      team2: "Partizan",
      starts: "12-4-2024",
    },
    {
      betId: 2758686868,
      betList: "RUNNING", // là winLose
      time: "2024/01/22 - 21:54:32",
      nameGame: "Bóng đá",
      isLive: false,
      liveScope: "first half",
      game_type: "over under",
      game_orientation: "under",
      game_scope: "full time",
      game_detail: -0.5,
      odds: 0.826,
      bet: 5,
      risk: 5,
      win: 4.13,
      oddsFormat: "DECIMAL",
      league_name: "Premier League",
      team1: "Crvena Zvezda",
      team2: "Partizan",
      starts: "12-4-2024",
    },
    {
      betId: 2758686862,
      betList: "RUNNING", // là winLose
      time: "2024/01/22 - 21:54:32",
      nameGame: "Bóng đá",
      isLive: false,
      liveScope: "first half",
      game_type: "over under",
      game_orientation: "under",
      game_scope: "full time",
      game_detail: -0.5,
      odds: 0.826,
      bet: 5,
      risk: 5,
      win: 4.13,
      oddsFormat: "DECIMAL",
      league_name: "Premier League",
      team1: "Crvena Zvezda",
      team2: "Partizan",
      starts: "12-4-2024",
    },
  ];

  // hàm check xem đã có username và password trong localStorage chưa, nếu chưa thì lấy từ server và lưu vào localsStorage
  // useEffect(() => {
  //   const checkUserInfo = async (user_id: number) => {
  //     const storedUsername = localStorage.getItem("username");
  //     const storedPassword = localStorage.getItem("password");

  //     if (!storedUsername || !storedPassword) {
  //       try {
  //         const response: IUserInfo = await getUserInfo({ user_id });
  //         console.log("response", response);
  //         if (!response) {
  //           throw new Error("Không thể lấy thông tin từ server");
  //         }

  //         localStorage.setItem("username", response.username);
  //         localStorage.setItem("password", response.password);
  //       } catch (error) {
  //         console.error("Có lỗi xảy ra khi lấy thông tin user:", error);
  //       }
  //     }
  //   };
  //   if (telegram?.user?.id) {
  //     checkUserInfo(telegram.user.id);
  //   }
  // }, [telegram?.user?.id]);

  const [selectedTab, setSelectedTab] = useState("1");

  useEffect(() => {
    telegram.webApp?.expand();
  }, []);
  return (
    <MainLayout>
      <Tabs defaultValue="1" className="w-full h-[95%]">
        <TabsList className={`tabsList bg-backgroundColor-main ${selectedTab === "1" ? "borderLeft" : "borderRight"}`}>
          <TabsTriggerHistory
            value="1"
            className="flex flex-grow justify-start pl-2"
            onClick={() => setSelectedTab("1")}
          >
            <Icon icon="mingcute:time-fill" className="mr-1 text-[#f7b502]" /> Cược đang chờ
          </TabsTriggerHistory>
          <TabsTriggerHistory value="2" className="pr-2" onClick={() => setSelectedTab("2")}>
            <Icon icon="lets-icons:flag-finish" className="mr-1 text-[#ff453a]" />
            Cược đã kết thúc
          </TabsTriggerHistory>
        </TabsList>

        <TabsContent value="1">
          <HistoryOutstanding />
        </TabsContent>

        <TabsContent value="2">
          <HistoryWinLoss />
        </TabsContent>
      </Tabs>
    </MainLayout>
  );
};

export default HistoryView;
