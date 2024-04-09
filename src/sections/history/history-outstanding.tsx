import React from "react";
import HistoryItem from "./history-item";

const HistoryOutstanding = ({ historyData }: { historyData: any[] }) => {
  console.log("history data ", historyData);
  return (
    <div className="px-3 py-2">
      <div className="flex flex-grow items-center text-text-main ">
        <div className="flex flex-grow items-center justify-start">
          <p className="text-sm font-normal pr-1">Tổng cược :</p>
          <p className="text-base font-medium">5.00</p>
        </div>
        <div className="flex flex-grow items-center justify-end">
          <p className="text-sm font-normal pr-1">Tổng vé :</p>
          <p className="text-base font-medium">5</p>
        </div>
      </div>
      <div className="mt-2">
        {historyData.map((item: any) => {
          return <HistoryItem key={item.betId} dataDetail={item} type="outstanding" />;
        })}
      </div>
    </div>
  );
};

export default HistoryOutstanding;
