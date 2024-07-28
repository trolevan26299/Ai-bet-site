/* eslint-disable @next/next/no-img-element */

"use client";

import { IMatchData } from "@/types/odds.types";
import { convertToGMT7 } from "@/utils/time";
import { Icon } from "@iconify/react";
import TeamLogo from "../../cloudinary/teamlogo";
import { formatLiveScope } from "@/utils/formatLiveScope";

export default function ScreenInfoMatch({ dataScreenInfo }: { dataScreenInfo: IMatchData[] }) {
  return (
    <div
      className="relative min-h-[116px] w-full overflow-hidden h-full"
      // style={{
      //   minHeight: "116px",
      //   width: "100%",
      //   background: `url('/assets/bg_team.jpg') center center / cover no-repeat`,
      // }}
    >
      <img src="/assets/bg_team.png" alt="Stadium" className=" absolute w-full h-full z-0 object-cover" />

      {/* <div className="absolute inset-0 z-[1px]" style={{ backgroundColor: "rgba(255, 255, 255, 0.7)" }}></div> */}

      <div className="absolute inset-0 grid z-[2px] grid-cols-12 items-start justify-center px-4 h-full">
        {/* <div className="col-span-12 text-gray-300  flex flex-row items-center ">
          <Icon icon="ph:soccer-ball-fill" width="20" color="#fafafa" />
          <p className="pl-1 text-sm text-[#fafafa] font-[600]">{dataScreenInfo[0]?.league_name}</p>
        </div> */}
        <div className={`flex flex-col items-start col-span-3 pb-2 ${dataScreenInfo[0]?.liveStatus ? "mt-4" : "mt-3"}`}>
          {dataScreenInfo.length > 0 && <TeamLogo teamName={dataScreenInfo[0].team[0]} typeError="home" />}
        </div>

        {dataScreenInfo[0]?.liveStatus ? (
          <div className="col-span-6 flex flex-col items-center justify-center text-gray-300 mt-3">
            <div className="flex flex-row items-center gap-1 pr-1">
              <Icon icon="fluent:live-20-filled" width={20} height={18} color="rgba(245,93,62,1)" />
              <p className="font-bold text-xs text-[rgba(39,199,55,1)] ">
                {`${
                  dataScreenInfo[0].liveState !== 2 &&
                  dataScreenInfo[0].liveState !== 6 &&
                  !dataScreenInfo[0].liveMinute
                    ? convertToGMT7(dataScreenInfo[0]?.starts, "time")
                    : ""
                }`}
                {`${
                  dataScreenInfo[0].liveState !== 4 &&
                  dataScreenInfo[0].liveState !== 6 &&
                  dataScreenInfo[0].liveState !== 8 &&
                  dataScreenInfo[0].liveState !== 9 &&
                  dataScreenInfo[0].liveMinute
                    ? dataScreenInfo[0].liveMinute
                    : ""
                } ${formatLiveScope(dataScreenInfo[0].liveState) || ""}`}
              </p>
            </div>
            <div className="flex justify-center items-center pt-[10px]">
              <div
                style={{ border: "1px solid rgba(255,255,255,0.4)" }}
                className="h-[29.6px] w-[28.4px] flex items-center justify-center rounded-[6px]"
              >
                <p className="font-bold text-[19.2px] text-[rgba(255,255,255,1)] ">
                  {dataScreenInfo[0]?.homeScore || 0}
                </p>
              </div>
              <p className="px-2 font-bold text-lg text-[rgba(239,255,255,0.8)]">:</p>
              <div
                style={{ border: "1px solid rgba(239,255,255,0.4)" }}
                className="h-[29.6px] w-[28.4px] flex items-center justify-center rounded-[6px]"
              >
                <p className="font-bold text-[19.2px] text-[rgba(255,255,255,1)] ">
                  {dataScreenInfo[0].awayScore || 0}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="col-span-6 flex flex-col items-center justify-center text-gray-300 mt-4 gap-3">
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

        <div className={`flex flex-col items-end col-span-3 pb-2 ${dataScreenInfo[0]?.liveStatus ? "mt-4" : "mt-3"}`}>
          {dataScreenInfo.length > 0 && <TeamLogo teamName={dataScreenInfo[0].team[1]} typeError="away" />}
        </div>
        <div className="flex flex-row justify-between col-span-12 mt-[-15px]">
          <span className="text-[#fff] text-sm font-[600] ml-0 w-[48%] flex-wrap leading-[1rem]">
            {dataScreenInfo[0]?.home}
          </span>
          <span className="text-[#fff] text-sm font-[600] mr-0 w-[48%] flex flex-row justify-end flex-wrap text-right  overflow-hidden text-overflow-ellipsis leading-[1rem]">
            {dataScreenInfo[0]?.away}
          </span>
        </div>
        <div className="flex flex-row justify-between col-span-12 ">
          <div className="flex flex-row justify-center gap-1 items-center w-[60px] text-white font-bold ml-[-5px]">
            {dataScreenInfo[0].homeRedCards !== 0 && (
              <div className="flex flex-row justify-center gap-[2px] items-center">
                <div className="bg-red-600 w-[6px] h-[8px]" />
                <p className="text-sm">{dataScreenInfo[0]?.homeRedCards}</p>
              </div>
            )}
            {dataScreenInfo[1]?.homeScore !== undefined && (
              <div className="flex flex-row justify-center gap-[2px] items-center">
                <img src="/assets/corner.svg" alt="" width="10px" height="10px" />
                <p className="text-sm">{dataScreenInfo[1]?.homeScore}</p>
              </div>
            )}
          </div>
          <div className="flex flex-row justify-center gap-1 items-center w-[60px]  text-white font-bold mr-[-5px]">
            {dataScreenInfo[0].awayRedCards !== 0 && (
              <div className="flex flex-row justify-center gap-[2px] items-center">
                <div className="bg-red-600 w-[6px] h-[8px]" />
                <p className="text-sm">{dataScreenInfo[0]?.awayRedCards}</p>
              </div>
            )}
            {dataScreenInfo[1]?.awayScore !== undefined && (
              <div className="flex flex-row justify-center gap-[2px] items-center">
                <img src="/assets/corner.svg" alt="" width="10px" height="10px" />
                <p className="text-sm">{dataScreenInfo[1]?.awayScore}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
