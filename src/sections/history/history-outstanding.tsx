import React from "react";
import HistoryItem from "./history-item";

const HistoryOutstanding = ({ historyData }: { historyData: any[] }) => {
  return (
    <>
      <div className="fixed top-[46px] h-12 w-full flex flex-grow items-center bg-backgroundColor-main px-3">
        <div className="flex flex-grow items-center text-text-main w-full">
          <div className="flex flex-grow items-center justify-start">
            <p className="text-sm font-normal pr-1">Tổng cược :</p>
            <p className="text-base font-medium">5.00</p>
          </div>
          <div className="flex flex-grow items-center justify-end">
            <p className="text-sm font-normal pr-1">Tổng vé :</p>
            <p className="text-base font-medium">5</p>
          </div>
        </div>
      </div>
      <div className="px-3 h-full">
        <div className="mt-[100px] pb-3">
          {historyData.map((item: any) => {
            return <HistoryItem key={item.betId} dataDetail={item} type="outstanding" />;
          })}
        </div>
      </div>
    </>
  );
};

export default HistoryOutstanding;
