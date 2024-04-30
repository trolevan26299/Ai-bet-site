export const getBackgroundByBetStatus = (type: string, value: string) => {
  if ((type = "winlose")) {
    if (value === "WON") {
      return "bg-[#34c759]";
    } else if (value === "LOST") {
      return "bg-[#ff453a]";
    } else {
      return "bg-[#f7b502]";
    }
  } else {
    return "bg-[#f7b502]";
  }
};

export const getValueByBetStatus = (type: string, value: string): string => {
  if (type === "winlose") {
    const statusMap: { [key: string]: string } = {
      WON: "Thắng",
      LOST: "Thua",
      CANCELLED: "Hủy",
      REFUNDED: "Hoàn tiền",
      NOT_ACCEPTED: "Không chấp nhận",
      ACCEPTED: "Đã chấp nhận",
      PENDING_ACCEPTANCE: "Đang đợi chấp nhận",
      REJECTED: "Từ chối",
      HALF_WON_HALF_PUSHED: "Thắng nửa",
      HALF_LOST_HALF_PUSHED: "Thua nửa",
    };

    return statusMap[value] || value;
  }
  return value;
};
