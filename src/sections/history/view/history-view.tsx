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
  const [selectedTab, setSelectedTab] = useState("1");

  useEffect(() => {
    telegram.webApp?.expand();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
