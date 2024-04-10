import { Button } from "@/components/ui/button";
import React from "react";
import { Icon } from "@iconify/react";

const HistoryItem = ({ dataDetail, type }: { dataDetail: any; type?: string }) => {
  return (
    <div className="h-[288px] rounded-[10px] bg-[rgba(40,55,74,0.5)] p-2 w-full mt-3 font-sans">
      <div className="flex flex-row items-center justify-between  pb-1" style={{ borderBottom: "1px solid #223a76" }}>
        <div className="tracking-wide">
          <p className="text-sm text-text-main">ID:{dataDetail.betId} </p>
          <span className="text-xs text-[rgba(235,235,245,0.6)] ">{dataDetail.time}</span>
        </div>
        <Button className="rounded-full w-[103px] bg-[#f7b502] h-7">Đang chạy</Button>
      </div>
      <div style={{ borderBottom: "1px solid #223a76" }} className="pb-3">
        <div className="pb-1 ">
          <div className="flex flex-row pt-3 items-center">
            <Icon icon="ph:soccer-ball-fill" width="24" color="#fafafa" className="mr-1" />
            {dataDetail.isLive && (
              <Icon icon="fluent:live-20-filled" width={20} height={18} color="rgba(255,69,58,1)" className="mr-1" />
            )}
            <p className="text-sm text-text-main font-semibold ">
              {dataDetail.nameGame} / {dataDetail.isLive && "Trực tiếp"}{" "}
              {dataDetail.game_scope === "full time" ? "Toàn trận" : "Hiệp 1"} -{" "}
              {dataDetail.game_type === "handicap" ? "Cược chấp" : "Tài xỉu"}
            </p>
          </div>
        </div>
        <div className="flex flex-col justify-center items-start pl-7">
          <div className="flex flex-row justify-start items-center text-sm gap-1">
            <p className="text-text-main">
              {dataDetail.game_orientation === "over"
                ? "Tài"
                : dataDetail.game_orientation === "under"
                ? "Xỉu"
                : dataDetail.game_orientation}
            </p>
            <p className={`${dataDetail.game_detail >= 0 ? "text-[#34c759]" : "text-[#ff453a]"}`}>
              {dataDetail.game_detail}
            </p>
            <p className="text-text-main">@</p>
            <p className="text-[#ffe665]">{dataDetail.odds}</p>
            <p className="text-text-main">({dataDetail.oddsFormat})</p>
          </div>
          <div className=" mt-3">
            <div className="flex flex-grow items-start justify-start">
              <p className="text-text-noActive text-sm w-[84px]">Cược :</p>
              <p className="text-text-main text-sm font-semibold">5.00</p>
            </div>
            <div className="flex flex-grow items-start justify-start">
              <p className="text-text-noActive text-sm w-[84px]">Mạo hiểm :</p>
              <p className="text-text-main text-sm font-semibold">{dataDetail.risk}</p>
            </div>
            <div className="flex flex-grow items-start justify-start">
              <p className="text-text-noActive text-sm w-[84px]">Thắng :</p>
              <p className="text-text-main text-sm font-semibold">{dataDetail.win}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-start justify-start gap-1">
        <p className="text-base text-[#34c759] font-medium pt-2">{dataDetail.league_name}</p>
        <p className="text-sm text-[rgba(235,235,245,0.6)] font-normal">
          {dataDetail.team1} - vs - {dataDetail.team2}
        </p>
        <p className="text-text-main font-normal text-sm">{dataDetail.starts}</p>
      </div>
    </div>
  );
};

export default HistoryItem;
