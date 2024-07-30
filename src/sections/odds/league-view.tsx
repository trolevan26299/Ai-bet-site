"use client";

import React from "react";
import { useRouter } from "next/navigation";
import MainLayout from "@/layouts/main/layout";
import Menu from "@/components/app/menu/menu";
import { Icon } from "@iconify/react";

const LeagueView = () => {
  const router = useRouter();
  const handleNavigate = () => {
    const matchId = "1594429137";
    const queryParams = {
      request_id: "5c785988-a377-450d-8c79-4196857d28f2",
      match: "Kuching FA,Penang FC", // Sử dụng chuỗi thay vì mảng
      time: "today",
      league: "Malaysia - President Cup U20",
      line: "0",
      from_date: "",
      to_date: "",
      match_id: "1594429137",
      tracker_id: "",
    };
    const queryString = new URLSearchParams(queryParams).toString();
    router.push(`/match/${matchId}?${queryString}`);
  };

  return (
    <MainLayout>
      <div>
        <div className="search h-12 flex flex-row w-full justify-center items-center">
          <div className="w-[15%]"></div>
          <div className="w-[60%]"></div>
          <div className="w-[25%] flex flex-row justify-center items-center">
            <Icon
              icon="bx:calendar"
              width={30}
              height={30}
              className="hover:cursor-pointertext-[rgba(255,255,255,1)]"
            />
            <Icon
              icon="ic:baseline-search"
              width={30}
              height={30}
              className="hover:cursor-pointertext-[rgba(255,255,255,1)]"
            />
          </div>
        </div>
        <div className="league">đây là các thẻ giải</div>
        <div className="detail">nội dung </div>
        <Menu />
      </div>
    </MainLayout>
  );
};

export default LeagueView;
