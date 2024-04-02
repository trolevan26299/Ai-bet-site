/* eslint-disable @next/next/no-img-element */

"use client";

import { fetchOddsData } from "@/api/odds";
import { IMatchData } from "@/types/odds.types";
import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";

export default function ScreenInfoMatch({}) {
  const [live, setLive] = useState(true);
  const [dataScreenInfo, setDataScreenInfo] = useState<IMatchData[]>([]);

  console.log("dataScreenInfo", dataScreenInfo);
  useEffect(() => {
    const fetchData = async () => {
      const response: IMatchData[] = await fetchOddsData();
      setDataScreenInfo(response);
    };

    fetchData();
  }, []);

  return (
    <div className="relative pb-2">
      <img src="assets/bg_team.jpg" alt="Stadium" className="w-full h-auto" />

      <div className="absolute inset-0 grid grid-cols-10 items-start justify-center px-4 pt-2">
        <div className="col-span-10 text-gray-300  flex flex-row items-center">
          <Icon icon="ph:soccer-ball-fill" width="20" />
          <p className="pl-2 text-sm">{dataScreenInfo[0]?.league_name}</p>
        </div>
        <div className="flex flex-col items-start col-span-3">
          {dataScreenInfo.length > 0 && (
            <img
              src={`assets/team_logo/${dataScreenInfo[0].league_name}/${dataScreenInfo[0].team[0]}.png`}
              alt="team home Logo"
              className="h-12 w-12"
            />
          )}
          <span className="text-white py-2 text-sm">{dataScreenInfo[0]?.home}</span>
          {dataScreenInfo[0]?.liveStatus && (
            <div className="flex flex-row justify-around items-center w-2/5 text-white font-bold">
              <div className="bg-red-600 w-3 h-3" />
              <p>{dataScreenInfo[0]?.awayRedCards}</p>
            </div>
          )}
        </div>

        {dataScreenInfo[0]?.liveStatus ? (
          <div className="col-span-4 flex flex-col items-center justify-center text-gray-300 pt-2">
            <div className="flex flex-row items-center gap-2">
              <Icon icon="fluent:live-20-filled" width={25} color="red" />
              <p className="font-bold text-green-500">{`${dataScreenInfo[0].liveMinute}’ Hiệp ${dataScreenInfo[0].liveScope}`}</p>
            </div>
            <div className="flex justify-center items-center pt-3">
              <p className="py-0.5 px-2 border-2 border-gray-300 rounded-sm font-bold text-white">
                {dataScreenInfo[0].homeScore}
              </p>
              <p className="px-3">:</p>
              <p className="py-0.5 px-2 border-2 border-gray-300 rounded-sm font-bold text-white">
                {dataScreenInfo[0].awayScore}
              </p>
            </div>
          </div>
        ) : (
          <div className="col-span-4 flex flex-col items-center justify-center text-gray-300 pt-2">
            <span className="">Ngày mai</span>
            <span className="">18:30</span>
          </div>
        )}

        <div className="flex flex-col items-end col-span-3">
          {dataScreenInfo.length > 0 && (
            <img
              src={`assets/team_logo/${dataScreenInfo[0].league_name}/${dataScreenInfo[0].team[1]}.png`}
              alt="team home Logo"
              className="h-12 w-12"
            />
          )}
          <span className="text-white py-2 text-sm">{dataScreenInfo[0]?.away}</span>
          {dataScreenInfo[0]?.liveStatus && (
            <div className="flex flex-row justify-around items-center w-2/5 text-white font-bold">
              <div className="bg-red-600 w-3 h-3" />
              <p>{dataScreenInfo[0]?.awayRedCards}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
