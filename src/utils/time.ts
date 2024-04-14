import { addHours, format } from "date-fns";

export const convertToGMT7 = (dateTimeString: string, type: string) => {
  const offset = 7;
  const dateTime = new Date(dateTimeString);
  dateTime.setHours(dateTime.getHours() - offset);
  const currentDate = new Date();
  const isSameDay =
    dateTime.getDate() === currentDate.getDate() &&
    dateTime.getMonth() === currentDate.getMonth() &&
    dateTime.getFullYear() === currentDate.getFullYear();

  if (type === "date") {
    if (isSameDay) {
      return "Hôm nay";
    } else {
      const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "2-digit", day: "2-digit" };
      return dateTime.toLocaleDateString("vi-VN", options);
    }
  } else if (type === "time") {
    const hours = dateTime.getHours();
    const minutes = dateTime.getMinutes();
    const formattedHours = hours < 10 ? "0" + hours : hours;
    const formattedMinutes = minutes < 10 ? "0" + minutes : minutes;
    return `${formattedHours} : ${formattedMinutes}`;
  } else {
    return "Invalid type";
  }
};

export const utcToUtc7Format = (utcDateString: string) => {
  const date = new Date(utcDateString);
  return format(date, "dd/MM/yy HH:mm:ss");
};

export const formatDateTime = (dateTime: Date) => {
  const year = dateTime.getFullYear();
  const month = String(dateTime.getMonth() + 1).padStart(2, "0");
  const day = String(dateTime.getDate()).padStart(2, "0");
  const hours = String(dateTime.getHours()).padStart(2, "0");
  const minutes = String(dateTime.getMinutes()).padStart(2, "0");
  const seconds = String(dateTime.getSeconds()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}Z`;
};
