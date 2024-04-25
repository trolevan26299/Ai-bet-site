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

export const getValueByBetStatus = (type: string, value: string) => {
  if (type === "winlose") {
    if (value === "WON") {
      return "Thắng";
    } else if (value === "LOST") {
      return "Thua";
    } else {
      return value;
    }
  }
};
