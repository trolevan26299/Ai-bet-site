"use client";

import { Tabs, TabsContent, TabsList, TabsTriggerHistory } from "@/components/ui/tabs";
import { useSwipeable } from "react-swipeable";
import MainLayout from "@/layouts/main/layout";
import { Icon } from "@iconify/react";
import { useState } from "react";
import HistoryOutstanding from "../history-outstanding";
import HistoryWinLoss from "../history-winloss";
import "../index.css";
import { useSearchParams } from "next/navigation";

const HistoryView = () => {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab") || "";
  const [selectedTab, setSelectedTab] = useState(tabParam === "winlose" ? "2" : "1");

  const handleTabChange = (newTab: any) => {
    setSelectedTab(newTab);
  };

  const handlers = useSwipeable({
    onSwipedLeft: () => handleTabChange("2"),
    onSwipedRight: () => handleTabChange("1"),
    trackTouch: true,
    trackMouse: true,
  });

  return (
    <MainLayout>
      <Tabs value={selectedTab} onChange={handleTabChange} className="w-full h-[95%]">
        <TabsList className={`tabsList bg-backgroundColor-main ${selectedTab === "1" ? "borderLeft" : "borderRight"}`}>
          <TabsTriggerHistory value="1" onClick={() => handleTabChange("1")}>
            <Icon icon="mingcute:time-fill" className="mr-1 text-[#f7b502]" /> Cược đang chờ
          </TabsTriggerHistory>
          <TabsTriggerHistory value="2" onClick={() => handleTabChange("2")}>
            <Icon icon="lets-icons:flag-finish" className="mr-1 text-[#ff453a]" />
            Cược đã kết thúc
          </TabsTriggerHistory>
        </TabsList>
        <div {...handlers}>
          <TabsContent value="1">
            <HistoryOutstanding />
          </TabsContent>
          <TabsContent value="2">
            <HistoryWinLoss />
          </TabsContent>
        </div>
      </Tabs>
    </MainLayout>
  );
};
