/* eslint-disable @next/next/no-img-element */

"use client";

import { IMatchData } from "@/types/odds.types";
import { convertToGMT7 } from "@/utils/time";
import { Icon } from "@iconify/react";
import TeamLogo from "../../cloudinary/teamlogo";
import { formatLiveScope } from "@/utils/formatLiveScope";

export default function ScreenInfoMatch({ dataScreenInfo }: { dataScreenInfo: IMatchData[] }) {
  return (
    <div className="relative pb-2" style={{ minHeight: "116px", background: `url('/assets/bg_team.jpg')` }}>
      {/* <img src="/assets/bg_team.jpg" alt="Stadium" className="w-full h-full opacity-[20%]" /> */}

      <div className="absolute inset-0 grid grid-cols-12 items-start justify-center px-4 pt-2">
        {/* <div className="col-span-12 text-gray-300  flex flex-row items-center ">
          <Icon icon="ph:soccer-ball-fill" width="20" color="#fafafa" />
          <p className="pl-1 text-sm text-[#fafafa] font-[600]">{dataScreenInfo[0]?.league_name}</p>
        </div> */}
        <div className={`flex flex-col items-start col-span-3 pb-2 ${dataScreenInfo[0]?.liveStatus ? "mt-7" : "mt-4"}`}>
          {dataScreenInfo.length > 0 && <TeamLogo teamName={dataScreenInfo[0].team[0]} typeError="home" />}
        </div>

        {dataScreenInfo[0]?.liveStatus ? (
          <div className="col-span-6 flex flex-col items-center justify-center text-gray-300">
            <div className="flex flex-row items-center gap-1 pr-1">
              <Icon icon="fluent:live-20-filled" width={25} height={23} color="rgba(255,69,58,1)" />
              <p className="font-[600] text-sm text-[rgba(255,230,101,1)] ">
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
            <div className="flex justify-center items-center pt-2">
              <div className="flex flex-row justify-center gap-1 items-center w-[60px] text-white font-bold mr-1">
                {dataScreenInfo[0].homeRedCards !== 0 && (
                  <div className="flex flex-row justify-center gap-[2px] items-center">
                    <div className="bg-red-600 w-2 h-3" />
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

              <div
                style={{ backgroundColor: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.4)" }}
                className="h-8 w-9 flex items-center justify-center rounded-[8px]"
              >
                <p className="font-[600] text-[18px] text-[#fafafa] ">{dataScreenInfo[0]?.homeScore || 0}</p>
              </div>
              <p className="px-2 font-bold text-lg text-[#fafafa]">:</p>
              <div
                style={{ backgroundColor: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.4)" }}
                className="h-8 w-9 flex items-center justify-center rounded-[8px]"
              >
                <p className="font-[600] text-[18px] text-[#fafafa] ">{dataScreenInfo[0].awayScore || 0}</p>
              </div>

              <div className="flex flex-row justify-center gap-1 items-center w-[60px] ml-1 text-white font-bold">
                {dataScreenInfo[0].awayRedCards !== 0 && (
                  <div className="flex flex-row justify-center gap-[2px] items-center">
                    <div className="bg-red-600 w-2 h-3" />
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

        <div className={`flex flex-col items-end col-span-3 pb-2 ${dataScreenInfo[0]?.liveStatus ? "mt-7" : "mt-4"}`}>
          {dataScreenInfo.length > 0 && <TeamLogo teamName={dataScreenInfo[0].team[1]} typeError="away" />}
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
