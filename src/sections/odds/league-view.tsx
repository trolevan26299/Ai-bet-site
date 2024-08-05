/* eslint-disable @next/next/no-img-element */
"use client";

import Menu from "@/components/app/menu/menu";
import { LoadingPopup } from "@/components/loading-screen";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogClose, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import MainLayout from "@/layouts/main/layout";
import { useGetRequestId } from "@/store/context/requestId.context";
import { locale } from "@/utils/configCalendarToVN";
import { getDayOfWeek } from "@/utils/convertDateToDateOfWeek";
import { getDayAndMonth } from "@/utils/convertToDayAndMonth";
import { Icon } from "@iconify/react";
import * as PopoverRD from "@radix-ui/react-popover";
import { Popover } from "@radix-ui/themes";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import "./index.css";
import { ILeague } from "@/types/league.type";

const generateDateList = () => {
  const dates = [];
  const today = new Date();

  for (let i = 0; i < 10; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    dates.push(date.toLocaleDateString("en-GB")); // Format: "dd/MM/yyyy"
  }

  return dates;
};

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

const tagDemo = [
  {
    name: "Euro 2024",
    logo: "https://toppng.com/uploads/preview/official-symbol-logo-design-for-euro-2024-germany-european-football-final-11715224051fchzryfqfd.png",
  },
  {
    name: "Copa America 2024",
    logo: "https://toppng.com/uploads/preview/official-symbol-logo-design-for-euro-2024-germany-european-football-final-11715224051fchzryfqfd.png",
  },
  {
    name: "Cúp C1 Châu Âu",
    logo: "https://toppng.com/uploads/preview/official-symbol-logo-design-for-euro-2024-germany-european-football-final-11715224051fchzryfqfd.png",
  },
  {
    name: "La Liga",
    logo: "https://toppng.com/uploads/preview/official-symbol-logo-design-for-euro-2024-germany-european-football-final-11715224051fchzryfqfd.png",
  },
  {
    name: "UEFA Nations League",
    logo: "https://toppng.com/uploads/preview/official-symbol-logo-design-for-euro-2024-germany-european-football-final-11715224051fchzryfqfd.png",
  },
  {
    name: "Bundesliga",
    logo: "https://toppng.com/uploads/preview/official-symbol-logo-design-for-euro-2024-germany-european-football-final-11715224051fchzryfqfd.png",
  },
  {
    name: "Seri A",
    logo: "https://toppng.com/uploads/preview/official-symbol-logo-design-for-euro-2024-germany-european-football-final-11715224051fchzryfqfd.png",
  },
];

const demoFavorite = [
  {
    name: "Trực tiếp",
    logo: "fluent:live-24-filled",
    detail: [
      {
        id: 1,
        name: "Euro 2024",
        container: "Châu Âu",
        away: "Spain",
        home: "England",
        awayScore: 1,
        homeScore: 2,
        isLive: true,
        time: "30'",
        scope: "1st Half",
      },
      {
        id: 1,
        name: "Euro 2024",
        container: "Châu Âu",
        away: "Hà Lan",
        home: "Pháp",
        awayScore: 1,
        homeScore: 2,
        isLive: true,
        time: "30'",
        scope: "1st Half",
      },
    ],
  },
  {
    name: "Sắp tới",
    logo: "ant-design:reload-time-outline",
    detail: [
      {
        id: 7,
        name: "Euro 2024",
        container: "Châu Âu",
        away: "Spain",
        home: "England",
        time: "02:00, 15/07",
        isLive: false,
      },
      {
        id: 8,
        name: "Euro 2024",
        container: "Châu Âu",
        away: "Spain",
        home: "England",
        time: "02:00, 15/07",
        isLive: false,
      },
    ],
  },
];
const LeagueView = () => {
  const router = useRouter();
  const { requestId } = useGetRequestId();
  const tabsListRef = useRef<HTMLDivElement>(null);
  const league1ListRef = useRef<HTMLDivElement>(null);
  const league2ListRef = useRef<HTMLDivElement>(null);
  const dateSearch = generateDateList();
  const allItems = demoFavorite.map((item) => item.name);
  const [openItems, setOpenItems] = useState(allItems);
  const [loadingPopupAll, setLoadingPopupAll] = useState(false);
  const [listAllLeague, setListAllLeague] = useState<ILeague[]>([]);
  const [loadingFavorite, setLoadingFavorite] = useState<number | null>(null);

  const handleValueChange = (value: string[]) => {
    setOpenItems(value);
  };
  const handleNavigate = () => {
    const matchId = "1594429137";
    const queryParams = {
      request_id: requestId as string,
      match: "APIA Leichhardt Tigers,West Sydney Wanderers Youth",
      time: "today",
      league: "Australia - NPL New South Wales",
      line: "0",
      from_date: "",
      to_date: "",
      match_id: "1594433333",
      tracker_id: "",
    };
    const queryString = new URLSearchParams(queryParams).toString();
    router.push(`/match/${matchId}?${queryString}`);
  };

  // Hàm thêm và xóa kèo yêu thích
  const handleAddRemoveFavorite = async ({
    leagueId,
    nowFavorite,
    container,
  }: {
    leagueId: number;
    nowFavorite: boolean;
    container: string;
  }) => {
    setLoadingFavorite(leagueId);
    try {
      const url = "/api/favorite";
      const method = nowFavorite ? axios.put : axios.post;
      const response = await method(url, {
        request_id: requestId,
        league_id: leagueId,
      });
      if (container && response.data.ok) {
        setListAllLeague((prevListAllLeague) => {
          return prevListAllLeague.map((item) => {
            if (item.name === container) {
              const updatedDetail = item.detail.map((league) => {
                if (league.league_id === leagueId) {
                  return { ...league, favorite: !nowFavorite };
                }
                return league;
              });
              return { ...item, detail: updatedDetail };
            }
            return item;
          });
        });
        setLoadingFavorite(null);
      }
    } catch (error) {
      setLoadingFavorite(null);
      console.log("error:", error);
    }
  };

  // FORMAT DATA FOR POPUP ALL
  const processLeagueData = (data: any) => {
    const groupedData = data?.reduce((acc: any, curr: any) => {
      const containerName = curr?.container?.container;

      if (!acc[containerName]) {
        acc[containerName] = {
          name: containerName,
          detail: [],
        };
      }

      const existingLeague = acc[containerName]?.detail.find((detail: any) => detail.league === curr.league_name);

      if (existingLeague) {
        existingLeague.number_match += 1;
        if (curr.is_favorite) {
          existingLeague.favorite = true;
        }
      } else {
        acc[containerName].detail.push({
          league: curr.league_name,
          number_match: 1,
          favorite: curr.is_favorite || false,
          league_id: curr.league_id,
        });
      }

      return acc;
    }, {});

    return Object.values(groupedData);
  };

  // Hàm mở POPUP tất cả
  const handleOpenPopupAll = async (open: boolean) => {
    try {
      if (open) {
        setLoadingPopupAll(true);
        const response = await axios.post("/api/league/match-in-league", {
          request_id: requestId,
          is_get_bets: false,
        });
        if (response.data.ok) {
          console.log("response:", response);
          const processedList = processLeagueData(response?.data?.data);
          console.log("processedList:", processedList);
          setListAllLeague(processedList as any);
          setLoadingPopupAll(false);
        }
      }
    } catch (error) {
      setLoadingPopupAll(false);
      console.error("error:", error);
    }
  };

  // xử lý cuộn chuột tagsList
  const handleMouseMove = (e: MouseEvent, ref: React.RefObject<HTMLDivElement>) => {
    if (ref.current) {
      const target = ref.current;
      if (e.buttons === 1) {
        target.scrollLeft -= e.movementX;
      }
    }
  };

  useEffect(() => {
    const refs = [tabsListRef, league1ListRef, league2ListRef];

    refs.forEach((ref) => {
      const target = ref.current;
      if (target) {
        const mouseMoveHandler = (e: MouseEvent) => handleMouseMove(e, ref);
        target.addEventListener("mousemove", mouseMoveHandler);
        return () => {
          target.removeEventListener("mousemove", mouseMoveHandler);
        };
      }
    });
  }, []);
  // END xử lý cuộn chuột tagsList

  return (
    <MainLayout>
      <div>
        <div className="search h-12 flex flex-row w-full justify-start items-center bg-[rgba(17,17,17,1)]">
          <div className="w-[18%] pl-2 flex flex-row justify-center">
            <button className="w-[53px] h-[21px] bg-[rgba(255,255,255,1)] text-[rgba(230,58,58,1)] uppercase rounded-[16.83px] text-[12px] font-bold flex flex-row justify-center items-center">
              Live
              <Icon icon="pepicons-pop:circle" width={17} height={17} className="text-[rgba(230,58,58,1)]" />
            </button>
          </div>
          <div className="w-[62%]">
            <div
              className="w-full flex flex-row justify-start gap-4 items-center  overflow-x-auto whitespace-nowrap no-scrollbar hover:cursor-pointer"
              ref={tabsListRef}
            >
              {dateSearch.map((date, index) => (
                <div
                  className="hover:cursor-pointer hover:text-[rgba(255,255,255,1)] flex flex-col items-center justify-center text-[12px] font-bold gap-[2px] text-[rgba(109,109,109,1)]"
                  key={index}
                >
                  <p>{getDayOfWeek(date)}</p>
                  <p>{getDayAndMonth(date)}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="w-[18%] flex flex-row justify-around items-center ">
            <Popover.Root>
              <Popover.Trigger>
                <Icon
                  icon="bx:calendar"
                  width={25}
                  height={25}
                  className="hover:cursor-pointer text-[rgba(255,255,255,1)]"
                />
              </Popover.Trigger>
              <Popover.Content
                className="py-2 w-[95%] bg-[rgba(40,55,74,1)] mt-[14px] max-h-[80vh] rounded-sm ml-[10px]"
                align="center"
              >
                <Calendar
                  className="w-full rounded-2xl"
                  initialFocus
                  mode="range"
                  //   defaultMonth={selectedDate?.from}
                  //   selected={selectedDate}
                  //   onSelect={setSelectedDate}
                  numberOfMonths={1}
                  locale={locale}
                  weekStartsOn={1}
                />
                <div className="flex flex-row justify-end items-center mr-7 gap-7 pb-2 text-sm">
                  <PopoverRD.Close>
                    <button className=" text-[#006ef8] font-semibold">Xác nhận</button>
                  </PopoverRD.Close>
                </div>
              </Popover.Content>
            </Popover.Root>
            <Popover.Root>
              <Popover.Trigger>
                <Icon
                  icon="ic:baseline-search"
                  width={25}
                  height={25}
                  className="hover:cursor-pointer text-[rgba(255,255,255,1)]"
                />
              </Popover.Trigger>
              <Popover.Content
                className="py-2 w-[95%] bg-[rgba(40,55,74,1)] mt-[14px] max-h-[80vh] rounded-sm"
                align="center"
              >
                <Input
                  type="search"
                  placeholder="Tìm kiếm"
                  className=" rounded-sm text-[rgba(255,255,255,1)] px-2 pb-[8px] border-none pl-2"
                />
                <div
                  className="flex flex-row justify-start items-center  gap-2 py-1 mt-2 pl-2"
                  style={{
                    borderTop: "1px solid rgba(255,255,255,1)",
                    borderBottom: "1px solid rgba(255,255,255,1)",
                  }}
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
              </Popover.Content>
            </Popover.Root>
          </div>
        </div>
        <div className="pt-2 w-full">
          <div
            className="flex flex-row w-full justify-start items-center gap-2 overflow-x-auto whitespace-nowrap no-scrollbar px-2 hover:cursor-pointer"
            ref={league1ListRef}
          >
            <Dialog onOpenChange={(open) => handleOpenPopupAll(open)}>
              <DialogTrigger asChild>
                <div className="flex flex-row items-center justify-center gap-1 rounded-[20px] bg-[rgba(41,53,67,1)] h-8 px-[10px]">
                  <p className=" font-bold text-[rgba(255,255,255,1)] text-sm">Tất cả</p>
                </div>
              </DialogTrigger>
              <DialogContent className="h-full px-0 " style={{ borderWidth: "0px" }}>
                {loadingPopupAll ? (
                  <LoadingPopup />
                ) : (
                  <Accordion
                    type="multiple"
                    value={openItems}
                    onValueChange={handleValueChange}
                    className="w-[95%]  m-auto p-2 bg-[rgba(30,42,56,1)] rounded-[10px] h-[85vh]"
                  >
                    <DialogClose asChild>
                      <div className="flex flex-row justify-end px-2 h-[40px] hover:cursor-pointer">
                        <Icon icon="ic:baseline-close" width={20} height={20} className="text-[rgba(255,255,255,1)]" />
                      </div>
                    </DialogClose>
                    <div className="h-[90%] overflow-y-auto">
                      {listAllLeague.map((tag, index) => (
                        <AccordionItem key={index} value={tag.name}>
                          <AccordionTrigger className="flex flex-row items-center justify-between px-2 py-1 hover:cursor-pointer">
                            <div className="flex flex-row items-center gap-2">
                              <img
                                src="https://static.vecteezy.com/system/resources/thumbnails/016/328/942/small_2x/vietnam-flat-rounded-flag-icon-with-transparent-background-free-png.png"
                                alt={tag.name}
                                className="w-[25px] h-[25px] rounded-full"
                              />
                              <p className=" font-bold text-[rgba(255,255,255,1)] text-[15px]">{tag.name}</p>
                              <Badge
                                variant="secondary"
                                className="bg-[rgba(53,64,76,1)] text-[12px] font-bold text-white py-[0px]"
                              >
                                {tag.detail.length}
                              </Badge>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="flex flex-col gap-2 px-2 py-1">
                            {tag.detail.map((detail, index) => (
                              <div
                                className="flex flex-row items-center justify-between  py-1 hover:cursor-pointer"
                                key={index}
                              >
                                <div className="flex flex-row items-center gap-2 ml-8" key={index}>
                                  <p className="text-[10px] font-bold text-[rgba(137,143,151,1)] hover:text-[rgba(255,255,255,1)]">
                                    {detail.league}
                                  </p>
                                  <Badge
                                    variant="secondary"
                                    className="px-[10px] py-[0px] bg-[rgba(53,64,76,1)] text-[10px] font-bold text-white"
                                  >
                                    {detail.number_match}
                                  </Badge>
                                </div>
                                {loadingFavorite === detail.league_id ? (
                                  <Icon
                                    icon="line-md:loading-alt-loop"
                                    width={25}
                                    height={25}
                                    className=" hover:cursor-pointer"
                                    style={{ color: "#fff" }}
                                  />
                                ) : detail.favorite ? (
                                  <Icon
                                    icon="emojione:star"
                                    width={18}
                                    height={18}
                                    className=" hover:cursor-pointer"
                                    onClick={() =>
                                      handleAddRemoveFavorite({
                                        leagueId: detail.league_id,
                                        nowFavorite: detail.favorite,
                                        container: tag.name,
                                      })
                                    }
                                  />
                                ) : (
                                  <Icon
                                    icon="material-symbols-light:star-outline"
                                    width={25}
                                    height={25}
                                    color="rgba(170,170,170,1)"
                                    className=" hover:cursor-pointer mr-[-3px]"
                                    onClick={() =>
                                      handleAddRemoveFavorite({
                                        leagueId: detail.league_id,
                                        nowFavorite: detail.favorite,
                                        container: tag.name,
                                      })
                                    }
                                  />
                                )}
                              </div>
                            ))}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </div>
                  </Accordion>
                )}
              </DialogContent>
            </Dialog>
            {tagDemo.slice(0, 4).map((tag, index) => (
              <div
                className="flex flex-row items-center justify-center gap-1 rounded-[20px] bg-[rgba(41,53,67,1)] h-8 px-[18px]"
                key={index}
              >
                <img src={tag.logo} alt={tag.name} className="w-[25px] h-[25px] rounded-full" />
                <p className=" font-bold text-[rgba(255,255,255,1)] text-sm">{tag.name}</p>
              </div>
            ))}
          </div>
          <div
            className="flex flex-row w-full justify-start items-center gap-2 overflow-x-auto whitespace-nowrap no-scrollbar px-2 hover:cursor-pointer mt-1"
            ref={league2ListRef}
          >
            {tagDemo.slice(4).map((tag, index) => (
              <div
                className="flex flex-row items-center justify-center gap-1 rounded-[20px] bg-[rgba(41,53,67,1)] h-8 px-[18px]"
                key={index}
              >
                <img src={tag.logo} alt={tag.name} className="w-[25px] h-[25px] rounded-full" />
                <p className=" font-bold text-[rgba(255,255,255,1)] text-sm">{tag.name}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="mb-[30px]   mt-[10px] w-full">
          <Accordion
            type="multiple"
            value={openItems}
            onValueChange={handleValueChange}
            className="w-full m-auto p-2 rounded-[10px] h-full mb-[55px]"
          >
            {demoFavorite.map((tag, index) => (
              <AccordionItem key={index} value={tag.name}>
                <AccordionTrigger className="flex flex-row items-center justify-between hover:cursor-pointer py-1">
                  <div className="flex flex-row items-center gap-2">
                    <Icon
                      icon={tag.logo}
                      width={25}
                      height={25}
                      color={
                        tag.name === "Trực tiếp"
                          ? "rgba(245,93,62,1)"
                          : tag.name === "Sắp tới"
                          ? "rgba(73,166,245,1)"
                          : ""
                      }
                    />
                    <p className=" font-bold text-[rgba(255,255,255,1)] text-[15px]">{tag.name}</p>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="flex flex-col gap-2 ">
                  {tag.detail.map((item: any, index) => (
                    <div
                      className="p-2 flex flex-row justify-between bg-[rgba(30,42,56,1)] rounded-[10px] mb-[10px]"
                      key={index}
                      onClick={() => handleNavigate()}
                    >
                      <div className="flex flex-col justify-between items-start">
                        <div className="flex flex-row gap-1 items-center">
                          <Icon
                            icon="fluent:sport-soccer-24-filled"
                            width={16}
                            height={16}
                            color="rgba(170,170,170,1)"
                          />
                          <p className="pl-2 text-[10px] font-normal text-[rgba(170,170,170,1)]">{item.container}</p>
                          <Icon icon="ic:outline-arrow-right" width={20} height={20} color="rgba(170,170,170,1)" />
                          <p className="text-[10px] font-normal text-[rgba(170,170,170,1)]">{item.name}</p>
                        </div>
                        <p
                          className={`${
                            item.isLive ? "text-[rgba(70,230,164,1)]" : "text-[rgba(165,165,165,1)]"
                          } text-[9px] font-normal`}
                        >
                          {item.isLive ? `${item.time} ${item.scope}` : item.time}
                        </p>
                        <div className="flex flex-row justify-start items-center gap-2">
                          <Image
                            src="https://w7.pngwing.com/pngs/982/984/png-transparent-red-and-white-flag-flag-of-spain-iberian-peninsula-computer-icons-spanish-free-spain-flag-svg-miscellaneous-english-country-thumbnail.png"
                            alt="no-content"
                            className="w-[20px] h-[20px]"
                          />
                          <p className="text-[rgba(251,255,255,1)] text-[14.41px] font-normal">{item.home}</p>
                        </div>
                        <div className="flex flex-row justify-start items-center gap-2">
                          <Image
                            src="https://upload.wikimedia.org/wikipedia/en/thumb/8/8b/England_national_football_team_crest.svg/1200px-England_national_football_team_crest.svg.png"
                            alt="no-content"
                            className="w-[20px] h-[20px]"
                          />
                          <p className="text-[rgba(251,255,255,1)] text-[14.41px] font-normal">{item.away}</p>
                        </div>
                      </div>
                      <div className="flex flex-col justify-between items-center">
                        <Icon
                          icon="mage:chart-fill"
                          className="hover:cursor-pointer"
                          width={16}
                          height={16}
                          color="rgba(170,170,170,1)"
                          onClick={(e) => {
                            e.stopPropagation(); // Ngăn chặn lan truyền sự kiện click
                          }}
                        />

                        {item.isLive && (
                          <Icon icon="fluent:live-20-filled" width={16} height={16} color="rgba(245,93,62,1)" />
                        )}
                        {item.isLive && (
                          <div
                            className="w-[22px] h-[17px] p-[2px] rounded-[5px] font-bold flex flex-row justify-center items-center text-[rgba(255,255,255,1)] bg-[rgba(41,53,66,1)] "
                            style={{ border: "0.68px solid rgba(64,74,86,1)" }}
                          >
                            {item?.homeScore}
                          </div>
                        )}
                        {item.isLive && (
                          <div
                            className="w-[22px] h-[17px] p-[2px] rounded-[5px] font-bold flex flex-row justify-center items-center text-[rgba(255,255,255,1)] bg-[rgba(41,53,66,1)] "
                            style={{ border: "0.68px solid rgba(64,74,86,1)" }}
                          >
                            {item?.awayScore}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
        <Menu />
      </div>
    </MainLayout>
  );
};

export default LeagueView;
