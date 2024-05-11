import { addDays, format } from "date-fns";

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
  if (utcDateString) {
    const date = new Date(utcDateString);
    return format(date, "dd/MM/yy HH:mm:ss");
  }
};
export const utcToUtc7FormatNoSecond = (utcDateString: string) => {
  if (utcDateString) {
    const date = new Date(utcDateString);
    return format(date, "dd/MM/yy HH:mm");
  }
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
export const formatRangeTime = (dateTime: Date, type: string, typeSelectTime: number) => {
  // Lấy giờ hiện tại
  const currentHour = new Date().getHours();
  // Nếu giờ hiện tại chưa qua 11 giờ trưa, giảm ngày đi 1
  // if (currentHour < 11 && (typeSelectTime === 0 || typeSelectTime === 1)) {
  //   dateTime = addDays(dateTime, -1);
  // }

  // Kiểm tra nếu type là 'today', thêm 1 ngày vào dateTime
  const newDate = type === "today" ? addDays(dateTime, 1) : dateTime;
  const year = newDate.getFullYear();
  const month = String(newDate.getMonth() + 1).padStart(2, "0");
  const day = String(newDate.getDate()).padStart(2, "0");
  const hours = type === "from" ? "04" : "03";
  const minutes = type === "from" ? "00" : "59";
  const seconds = type === "from" ? "00" : "59";

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}Z`;
};
