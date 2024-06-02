import { IHistoryBet } from "@/types/history.type";
import { formatNumber, formatNumberAndFloor } from "@/utils/formatNumber";
import { getBackgroundByBetStatus, getValueByBetStatus } from "@/utils/renderInfoByBetStatus";
import { utcToUtc7Format, utcToUtc7FormatNoSecond } from "@/utils/time";
import { Icon } from "@iconify/react";
import { formatBet } from "../../utils/formatBet";

const HistoryItem = ({ dataDetail, type }: { dataDetail: IHistoryBet; type?: string }) => {
  const stake = dataDetail.price > 0 ? dataDetail.risk : dataDetail.risk / -dataDetail.price;
  return (
    <div className={`h-[${type ? "288px" : "300px"}] rounded-[10px] bg-[rgba(40,55,74,0.5)] p-2 w-full mt-3 font-sans`}>
      <div className="flex flex-row items-center justify-between  pb-1" style={{ borderBottom: "1px solid #223a76" }}>
        <div className="tracking-wide">
          <p className="text-sm text-text-main">ID:{dataDetail.betId} </p>
          <span className="text-xs text-[rgba(235,235,245,0.6)] ">{utcToUtc7Format(dataDetail.placedAt)} (UTC+7)</span>
        </div>
        <div
          className={`rounded-full min-w-28 px-2 ${getBackgroundByBetStatus(
            "winlose",
            dataDetail.betStatus2
          )}  h-7 flex flex-row justify-center items-center text-[#fafafa] text-sm font-medium `}
        >
          {type ? "Đang chạy" : getValueByBetStatus("winlose", dataDetail.betStatus2)}
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
          <div className="flex flex-row justify-start items-center text-sm gap-1 w-full">
            <p className="text-text-main" style={{ maxWidth: "40%" }}>
              {dataDetail.betType === "SPREAD" ? dataDetail.teamName : dataDetail.side === "OVER" ? "Tài" : "Xỉu"}
            </p>
            <p
              className={`${
                dataDetail.handicap > 0
                  ? "text-[#34c759]"
                  : dataDetail.handicap < 0
                  ? "text-[#ff453a]"
                  : "text-text-main"
              }`}
            >
              {dataDetail.handicap > 0 ? "+" : ""}
              {dataDetail.handicap}
            </p>
            {dataDetail.team1Score !== undefined && dataDetail.team2Score !== undefined && (
              <p className="text-text-main">
                {`[${dataDetail.team1Score?.toString()} - ${dataDetail.team2Score?.toString()}]`}{" "}
              </p>
            )}
            <p className="text-text-main">@</p>
            <p className="text-[#ffe665]">{dataDetail.price}</p>
            <p className="text-[#4181ff] text-xs">{`(${formatBet(dataDetail.oddsFormat)})`}</p>
          </div>
          <div className=" mt-3">
            <div className="flex flex-grow items-start justify-start">
              <p className="text-text-noActive text-sm w-[90px]">Cược :</p>
              <p className="text-text-main text-sm font-semibold">{formatNumberAndFloor(stake)}</p>
            </div>
            <div className="flex flex-grow items-start justify-start">
              <p className="text-text-noActive text-sm w-[90px]">Mạo hiểm :</p>
              <p className="text-text-main text-sm font-semibold">{formatNumber(dataDetail.risk)}</p>
            </div>
            {type ? (
              <div className="flex flex-grow items-start justify-start">
                <p className="text-text-noActive text-sm w-[90px]">Thắng :</p>
                <p className="text-text-main text-sm font-semibold">{formatNumber(dataDetail.win)}</p>
              </div>
            ) : (
              <div className="flex flex-grow items-start justify-start">
                <p className="text-text-noActive text-sm w-[90px]">Thắng/Thua :</p>
                <p
                  className={`text-sm font-semibold ${
                    dataDetail && dataDetail.winLoss !== undefined
                      ? dataDetail.winLoss > 0
                        ? "text-[#34c759]"
                        : dataDetail.winLoss < 0
                        ? "text-[#ff453a]"
                        : "text-text-main"
                      : "text-text-main"
                  }`}
                >
                  {dataDetail && dataDetail.winLoss !== undefined ? formatNumber(dataDetail.winLoss) : ""}
                </p>
              </div>
            )}

            {!type && (
              <div className="flex flex-grow items-start justify-start">
                <p className="text-text-noActive text-sm w-[90px]">Hoa hồng :</p>
                <p className="text-text-main text-sm font-semibold">{formatNumber(dataDetail.customerCommission)}</p>
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
          {!type && dataDetail.pTeam1Score !== undefined && dataDetail.pTeam2Score !== undefined && (
            <span>
              - Hiệp 1{" "}
              <span className="text-[#ffe665]">
                [{dataDetail.pTeam1Score}-{dataDetail.pTeam2Score}]
              </span>
            </span>
          )}
          {!type && dataDetail.ftTeam1Score !== undefined && dataDetail.ftTeam2Score !== undefined && (
            <span>
              - Cả trận{" "}
              <span className="text-[#4181ff]">
                [{dataDetail.ftTeam1Score}-{dataDetail.ftTeam2Score}]
              </span>
            </span>
          )}
        </p>
      </div>
    </div>
  );
};

export default HistoryItem;
