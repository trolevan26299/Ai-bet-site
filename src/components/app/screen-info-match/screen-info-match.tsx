/* eslint-disable @next/next/no-img-element */

"use client";

import { IMatchData } from "@/types/odds.types";
import { convertToGMT7 } from "@/utils/time";
import { Icon } from "@iconify/react";
import Image from "next/image";

export default function ScreenInfoMatch({ dataScreenInfo }: { dataScreenInfo: IMatchData[] }) {
  return (
    <div className="relative pb-2 min-h-[200px]">
      <Image src="/assets/bg_team.jpg" alt="Stadium" className="w-full h-auto" />

      <div className="absolute inset-0 grid grid-cols-12 items-start justify-center px-4 pt-2">
        <div className="col-span-12 text-gray-300  flex flex-row items-center pt-1">
          <Icon icon="ph:soccer-ball-fill" width="20" color="#fafafa" />
          <p className="pl-1 text-sm text-[#fafafa] font-[600]">{dataScreenInfo[0]?.league_name}</p>
        </div>
        <div className={`flex flex-col items-start col-span-3  ${dataScreenInfo[0]?.liveStatus ? "mt-7" : "mt-4"}`}>
          {dataScreenInfo.length > 0 && (
            <Image
              src={`/assets/team_logo/${dataScreenInfo[0].league_name.replace(/\s+/g, "").toLowerCase()}/${
                dataScreenInfo[0].team[0]
              }.png`}
              alt="team home Logo"
              width={48}
              height={48}
            />
          )}
        </div>

        {dataScreenInfo[0]?.liveStatus ? (
          <div className="col-span-6 flex flex-col items-center justify-center text-gray-300">
            <div className="flex flex-row items-center gap-1 pr-1">
              <Icon icon="fluent:live-20-filled" width={25} height={23} color="rgba(255,69,58,1)" />
              <p className="font-[600] text-sm text-[rgba(255,230,101,1)] ">
                {`${dataScreenInfo[0].liveMinute}  ${
                  dataScreenInfo[0].liveScope === "first half"
                    ? "Hiệp 1"
                    : dataScreenInfo[0].liveScope === "half time"
                    ? "Nghỉ giữa hiệp"
                    : "Hiệp 2"
                }`}
              </p>
            </div>
            <div className="flex justify-center items-center pt-3">
              <div className="flex flex-row justify-center gap-1 items-center w-[40px] text-white font-bold mr-2">
                <p>{dataScreenInfo[0]?.homeRedCards}</p>
                <div className="bg-red-600 w-2 h-3" />
              </div>
              <div
                style={{ backgroundColor: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.4)" }}
                className="h-10 w-11 flex items-center justify-center rounded-[10px]"
              >
                <p className="font-[600] text-[20px] text-[#fafafa] ">{dataScreenInfo[0]?.homeScore || 0}</p>
              </div>
              <p className="px-2 font-bold text-lg text-[#fafafa]">:</p>
              <div
                style={{ backgroundColor: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.4)" }}
                className="h-10 w-11 flex items-center justify-center rounded-[10px]"
              >
                <p className="font-[600] text-[20px] text-[#fafafa] ">{dataScreenInfo[0].awayScore || 0}</p>
              </div>
              <div className="flex flex-row justify-center gap-1 items-center w-[35px] ml-2 text-white font-bold">
                <div className="bg-red-600 w-2 h-3" />
                <p>{dataScreenInfo[0]?.awayRedCards}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="col-span-6 flex flex-col items-center justify-center text-gray-300 mt-6 gap-3">
            {dataScreenInfo[0]?.starts && (
              <span className="text-sm text-[rgba(255,230,101,1)] font-[600]">
                {convertToGMT7(dataScreenInfo[0]?.starts, "date")}
              </span>
            )}
            <span className="text-sm text-[#fafafa] font-[600]">
              {convertToGMT7(dataScreenInfo[0]?.starts, "time")}
            </span>
          </div>
        )}

        <div className={`flex flex-col items-end col-span-3  ${dataScreenInfo[0]?.liveStatus ? "mt-7" : "mt-4"}`}>
          {dataScreenInfo.length > 0 && (
            <Image
              src={`/assets/team_logo/${dataScreenInfo[0].league_name.replace(/\s+/g, "").toLowerCase()}/${
                dataScreenInfo[0].team[1]
              }.png`}
              alt="team home Logo"
              className="flex flex-row justify-start"
              width={48}
              height={48}
            />
          )}
        </div>
        <div className="flex flex-row justify-between col-span-12 mt-[-25px]">
          <span className="text-[#fff] py-3 text-sm font-[600] ml-0 w-[48%] flex-wrap">{dataScreenInfo[0]?.home}</span>
          <span className="text-[#fff] py-3 text-sm font-[600] mr-0 w-[48%] flex flex-row justify-end flex-wrap text-right  overflow-hidden text-overflow-ellipsis">
            {dataScreenInfo[0]?.away}
          </span>
        </div>
      </div>
    </div>
  );
}
