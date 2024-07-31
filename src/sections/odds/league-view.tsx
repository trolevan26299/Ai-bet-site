"use client";

import Menu from "@/components/app/menu/menu";
import MainLayout from "@/layouts/main/layout";
import { getDayOfWeek } from "@/utils/convertDateToDateOfWeek";
import { getDayAndMonth } from "@/utils/convertToDayAndMonth";
import { Icon } from "@iconify/react";
import { getDay } from "date-fns";
import { useRouter } from "next/navigation";

const demoDateSearch = [
  "01/08/2024",
  "02/08/2024",
  "03/08/2024",
  "04/08/2024",
  "05/08/2024",
  "06/08/2024",
  "07/08/2024",
  "08/08/2024",
  "09/08/2024",
  "10/08/2024",
  "11/08/2024",
  "12/08/2024",
];
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
        <div className="search h-12 flex flex-row w-full justify-center items-center bg-[rgba(17,17,17,1)]">
          <div className="w-[20%] ">
            <button className="w-[53px] h-[21px] bg-[rgba(255,255,255,1)] text-[rgba(230,58,58,1)] uppercase rounded-[16.83px] text-[12px] font-bold flex flex-row justify-center items-center">
              Live
              <Icon icon="pepicons-pop:circle" width={17} height={17} className="text-[rgba(230,58,58,1)]" />
            </button>
          </div>
          <div className="w-[60%] flex flex-row justify-center gap-2 items-center overflow-x-auto scrollbar-hide">
            {demoDateSearch.map((date, index) => (
              <div
                className="flex flex-col items-center justify-center text-[11px] font-bold gap-1 text-[rgba(109,109,109,1)]"
                key={index}
              >
                <p>{getDayOfWeek(date)}</p>
                <p>{getDayAndMonth(date)}</p>
              </div>
            ))}
          </div>
          <div className="w-[20%] flex flex-row justify-around items-center">
            <Icon
              icon="bx:calendar"
              width={25}
              height={25}
              className="hover:cursor-pointer text-[rgba(255,255,255,1)]"
            />
            <Icon
              icon="ic:baseline-search"
              width={25}
              height={25}
              className="hover:cursor-pointer text-[rgba(255,255,255,1)]"
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
