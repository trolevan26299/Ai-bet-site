export const getBackgroundByBetStatus = (type: string, value: string) => {
  if ((type = "winlose")) {
    if (value === "WON") {
      return "bg-[#34c759]";
    } else if (value === "LOSE") {
      return "bg-[#ff453a]";
    } else {
      return "bg-[#f7b502]";
    }
  }
};

export const getValueByBetStatus = (type: string, value: string) => {
  if (type === "winlose") {
    if (value === "WON") {
      return "Thắng";
    } else if (value === "LOSE") {
      return "Thua";
    } else {
      return value;
    }
  }
};
