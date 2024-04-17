import { Button } from "@/components/ui/button";
import React from "react";
import { Icon } from "@iconify/react";
import { IHistoryBet } from "@/types/history.type";
import { utcToUtc7Format, utcToUtc7FormatNoSecond } from "@/utils/time";
import { getBackgroundByBetStatus, getValueByBetStatus } from "@/utils/renderInfoByBetStatus";

const HistoryItem = ({ dataDetail, type }: { dataDetail: IHistoryBet; type?: string }) => {
  return (
    <div className={`h-[${type ? "288px" : "300px"}] rounded-[10px] bg-[rgba(40,55,74,0.5)] p-2 w-full mt-3 font-sans`}>
      <div className="flex flex-row items-center justify-between  pb-1" style={{ borderBottom: "1px solid #223a76" }}>
        <div className="tracking-wide">
          <p className="text-sm text-text-main">ID:{dataDetail.betId} </p>
          <span className="text-xs text-[rgba(235,235,245,0.6)] ">{utcToUtc7Format(dataDetail.placedAt)}</span>
        </div>
        <div
          className={`rounded-full w-[103px] ${getBackgroundByBetStatus(
            "winlose",
            dataDetail.betStatus
          )} bg-[#f7b502] h-7 flex flex-row justify-center items-center text-[#fafafa] text-sm font-medium `}
        >
          {type ? "Đang chạy" : getValueByBetStatus("winlose", dataDetail.betStatus)}
        </div>
      </div>
      <div style={{ borderBottom: "1px solid #223a76" }} className="pb-3">
        <div className="pb-1 ">
          <div className="flex flex-row pt-3 items-center">
            <Icon icon="ph:soccer-ball-fill" width="24" color="#fafafa" className="mr-1" />
            {dataDetail.isLive === "TRUE" && (
              <Icon icon="fluent:live-20-filled" width={20} height={18} color="rgba(255,69,58,1)" className="mr-1" />
            )}
            <p className="text-sm text-text-main font-semibold ">
              {dataDetail.sportId === 29 ? "Bóng đá" : "Game"} / {dataDetail.isLive === "TRUE" ? "Trực tiếp" : ""}{" "}
              {dataDetail.periodNumber === 0 ? "Toàn trận" : "Hiệp 1"} -{" "}
              {dataDetail.betType === "TOTAL_POINTS" ? "Tài xỉu" : "Cược chấp"}
            </p>
          </div>
        </div>
        <div className="flex flex-col justify-center items-start pl-7">
          <div className="flex flex-row justify-start items-center text-sm gap-1">
            <p className="text-text-main">
              {dataDetail.betType === "SPREAD" ? dataDetail.teamName : dataDetail.side === "OVER" ? "Tài" : "Xỉu"}
            </p>
            <p className={`${dataDetail.handicap >= 0 ? "text-[#34c759]" : "text-[#ff453a]"}`}>{dataDetail.handicap}</p>
            <p className="text-text-main">@</p>
            <p className="text-[#ffe665]">{dataDetail.price}</p>
            <p className="text-text-main">({dataDetail.oddsFormat})</p>
          </div>
          <div className=" mt-3">
            <div className="flex flex-grow items-start justify-start">
              <p className="text-text-noActive text-sm w-[84px]">Cược :</p>
              <p className="text-text-main text-sm font-semibold">{dataDetail.risk}</p>
            </div>
            <div className="flex flex-grow items-start justify-start">
              <p className="text-text-noActive text-sm w-[84px]">Mạo hiểm :</p>
              <p className="text-text-main text-sm font-semibold">{dataDetail.risk}</p>
            </div>
            {type ? (
              <div className="flex flex-grow items-start justify-start">
                <p className="text-text-noActive text-sm w-[84px]">Thắng :</p>
                <p className="text-text-main text-sm font-semibold">{dataDetail.win}</p>
              </div>
            ) : (
              <div className="flex flex-grow items-start justify-start">
                <p className="text-text-noActive text-sm w-[84px]">Thắng/Thua :</p>
                <p
                  className={` text-sm font-semibold ${
                    dataDetail?.winLoss || 0 > 0 ? "text-[#34c759]" : "text-[#ff453a]"
                  }`}
                >
                  {dataDetail.winLoss}
                </p>
              </div>
            )}

            {!type && (
              <div className="flex flex-grow items-start justify-start">
                <p className="text-text-noActive text-sm w-[84px]">Hoa hồng :</p>
                <p className="text-text-main text-sm font-semibold">{dataDetail.customerCommission}</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="flex flex-col items-start justify-start gap-1">
        <p className="text-base text-[#34c759] font-medium pt-2">{dataDetail.leagueName}</p>
        <p className="text-sm text-[rgba(235,235,245,0.6)] font-normal">
          {dataDetail.team1} - vs - {dataDetail.team2}
        </p>
        <p className="text-text-main font-normal text-sm">
          {utcToUtc7FormatNoSecond(dataDetail.eventStartTime)}{" "}
          {!type && (
            <span>
              {dataDetail.periodNumber === 0 ? " - Cả trận :" : " - Nửa trận :"}{" "}
              <span className={`${dataDetail.periodNumber === 0 ? "text-[#4181ff]" : "text-[#ffe665]"}`}>
                [{dataDetail.periodNumber === 0 ? dataDetail.ftTeam1Score : dataDetail.pTeam1Score}-
                {dataDetail.periodNumber === 0 ? dataDetail.ftTeam2Score : dataDetail.pTeam2Score}]
              </span>
            </span>
          )}
        </p>
      </div>
    </div>
  );
};

export default HistoryItem;
