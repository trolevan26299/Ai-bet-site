import { Button } from "@/components/ui/button";
import React from "react";
import { Icon } from "@iconify/react";

const HistoryItem = ({ dataDetail, type }: { dataDetail: any; type: string }) => {
  return (
    <div className="h-[288px] rounded-[10px] bg-[rgba(40,55,74,0.5)] p-2 w-full mt-3">
      <div className="flex flex-row items-center justify-between  pb-1" style={{ borderBottom: "1px solid #223a76" }}>
        <div>
          <p className="text-sm text-text-main">ID:{dataDetail.betId} </p>
          <span className="text-xs text-[rgba(235,235,245,0.6)]">{dataDetail.time}</span>
        </div>
        <Button className="rounded-full w-[103px] bg-[#f7b502] h-7">Đang chạy</Button>
      </div>
      <div>
        <div className="flex flex-row pt-3">
          <Icon icon="ph:soccer-ball-fill" width="16" color="#fafafa" />
          {dataDetail.isLive && <Icon icon="fluent:live-20-filled" width={20} height={16} color="rgba(255,69,58,1)" />}
          <p className="text-sm text-text-main font-semibold">
            {dataDetail.nameGame} / {dataDetail.isLive && "Trực tiếp"} {dataDetail.game}
          </p>
        </div>
      </div>
    </div>
  );
};

export default HistoryItem;
