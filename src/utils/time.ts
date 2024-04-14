import { addHours, format, minus } from "date-fns";

export const convertToGMT7 = (dateTimeString: string, type: string) => {
  const dateTime = new Date(dateTimeString);

  if (type === "date") {
    const currentDate = new Date();

    const oneDay = 24 * 60 * 60 * 1000;
    const diffDays = Math.floor((dateTime.getTime() - currentDate.getTime()) / oneDay);

    if (diffDays === 1 || (diffDays === 0 && dateTime.getUTCHours() === 0)) {
      return "Ngày mai";
    } else if (diffDays === 0) {
      return "Hôm nay";
    } else {
      const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "2-digit", day: "2-digit" };
      return dateTime.toLocaleDateString("vi-VN", options);
    }
  } else if (type === "time") {
    const hours = dateTime.getUTCHours();
    const minutes = dateTime.getMinutes();

    return `${hours || 0}:${minutes < 10 ? "0" + minutes || 0 : minutes || 0}`;
  } else {
    return "Invalid type";
  }
};

export const utcToUtc7 = (utcDateString: string) => {
  const date = new Date(utcDateString);
  // const newDate = addHours(date, 7);
  return format(date, "dd/MM/yy HH:mm:ss");
};
