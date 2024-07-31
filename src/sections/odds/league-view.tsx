"use client";

import Menu from "@/components/app/menu/menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverTrigger } from "@/components/ui/popover";
import MainLayout from "@/layouts/main/layout";
import { getDayOfWeek } from "@/utils/convertDateToDateOfWeek";
import { getDayAndMonth } from "@/utils/convertToDayAndMonth";
import { Icon } from "@iconify/react";
import { PopoverContent } from "@radix-ui/react-popover";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import "./index.css";

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
  const tabsListRef = useRef<HTMLDivElement>(null);
  // search
  const [openSearch, setOpenSearch] = useState(false);
  const [valueSearch, setValueSearch] = useState("");
  const frameworks = [
    {
      value: "next.js",
      label: "Next.js",
    },
    {
      value: "sveltekit",
      label: "SvelteKit",
    },
    {
      value: "nuxt.js",
      label: "Nuxt.js",
    },
    {
      value: "remix",
      label: "Remix",
    },
    {
      value: "astro",
      label: "Astro",
    },
  ];
  // end search

  // calendar
  const [openCalendar, setOpenCalendar] = useState(false);
  // end calendar

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

  const handleMouseMove = (e: MouseEvent) => {
    if (tabsListRef.current) {
      const target = tabsListRef.current;
      if (e.buttons === 1) {
        target.scrollLeft -= e.movementX;
      }
    }
  };

  useEffect(() => {
    const target = tabsListRef.current;
    if (target) {
      target.addEventListener("mousemove", handleMouseMove);
      return () => {
        target.removeEventListener("mousemove", handleMouseMove);
      };
    }
  }, []);
  return (
    <MainLayout>
      <div>
        <div className="search h-12 flex flex-row w-full justify-center items-center bg-[rgba(17,17,17,1)]">
          <div className="w-[18%] pl-2 flex flex-row justify-center">
            <button className="w-[53px] h-[21px] bg-[rgba(255,255,255,1)] text-[rgba(230,58,58,1)] uppercase rounded-[16.83px] text-[12px] font-bold flex flex-row justify-center items-center">
              Live
              <Icon icon="pepicons-pop:circle" width={17} height={17} className="text-[rgba(230,58,58,1)]" />
            </button>
          </div>

          <div
            className="w-[62%] flex flex-row justify-center gap-4 items-center  overflow-x-auto whitespace-nowrap no-scrollbar"
            ref={tabsListRef}
          >
            {demoDateSearch.map((date, index) => (
              <div
                className="hover:cursor-pointer hover:text-[rgba(255,255,255,1)] flex flex-col items-center justify-center text-[12px] font-bold gap-[2px] text-[rgba(109,109,109,1)]"
                key={index}
              >
                <p>{getDayOfWeek(date)}</p>
                <p>{getDayAndMonth(date)}</p>
              </div>
            ))}
          </div>

          <div className="w-[18%] flex flex-row justify-around items-center ">
            <Popover open={openCalendar} onOpenChange={() => setOpenSearch(!openCalendar)}>
              {/* <PopoverTrigger asChild> */}
              <Icon
                icon="bx:calendar"
                width={25}
                height={25}
                className="hover:cursor-pointer text-[rgba(255,255,255,1)]"
                onClick={() => setOpenCalendar(!openCalendar)}
              />
              {/* </PopoverTrigger> */}
              <PopoverContent
                className="py-2 w-[95%] m-auto bg-[rgba(40,55,74,1)] mt-4 max-h-[80vh] rounded-sm"
                align="center"
              >
                <Input
                  type="search"
                  placeholder="Tìm kiếm"
                  className=" rounded-sm text-[rgba(255,255,255,1)] px-2 pb-[8px] border-none pl-2"
                />
                <div
                  className="flex flex-row justify-start items-center  gap-2 py-1 mt-2 pl-2"
                  style={{ borderTop: "1px solid rgba(255,255,255,1)", borderBottom: "1px solid rgba(255,255,255,1)" }}
                >
                  <Button variant="secondary" color="" size="sm">
                    Đội
                  </Button>
                  <Button variant="secondary" size="sm">
                    Giải đấu
                  </Button>
                </div>

                <div className="justify-start items-center pt-2 pl-2 text-white overflow-y-auto">
                  {frameworks.map((framework, index) => (
                    <div className="hover:bg-[rgba(255,255,255,1)] hover:text-[#000] hover:cursor-pointer" key={index}>
                      <p className="pl-2">{framework.label}</p>
                    </div>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
            <Popover open={openSearch} onOpenChange={() => setOpenCalendar(!openSearch)}>
              {/* <PopoverTrigger asChild> */}
              <Icon
                icon="ic:baseline-search"
                width={25}
                height={25}
                className="hover:cursor-pointer text-[rgba(255,255,255,1)]"
                onClick={() => setOpenSearch(!openSearch)}
              />
              {/* </PopoverTrigger> */}
              <PopoverContent
                className="py-2 w-[95%] m-auto bg-[rgba(40,55,74,1)] mt-4 max-h-[80vh] rounded-sm"
                align="center"
              >
                <div className="p-2 text-white">
                  <p>Calendar content goes here...</p>
                </div>
              </PopoverContent>
            </Popover>
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
