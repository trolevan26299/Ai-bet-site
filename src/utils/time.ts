import { addHours, format } from "date-fns";

export const convertToGMT7 = (dateTimeString: string, type: string) => {
  // const dateTime = new Date(dateTimeString);

  // if (type === "date") {
  //   const currentDate = new Date();

  //   const oneDay = 24 * 60 * 60 * 1000;
  //   const diffDays = Math.floor((dateTime.getTime() - currentDate.getTime()) / oneDay);

  //   if (diffDays === 1 || (diffDays === 0 && dateTime.getUTCHours() === 0)) {
  //     return "Ngày mai";
  //   } else if (diffDays === 0) {
  //     return "Hôm nay";
  //   } else {
  //     const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "2-digit", day: "2-digit" };
  //     return dateTime.toLocaleDateString("vi-VN", options);
  //   }
  // } else if (type === "time") {
  //   const hours = dateTime.getUTCHours();
  //   const minutes = dateTime.getMinutes();

  //   return `${hours || 0} : ${minutes < 10 ? "0" + minutes || 0 : minutes || 0}`;
  // } else {
  //   return "Invalid type";
  // }
  const dateTime = new Date(dateTimeString);
  const currentDate = new Date();
  currentDate.setHours(currentDate.getHours() + 7); // Chuyển về múi giờ GMT+7
  console.log("dateTime", dateTime);
  console.log("currentDate", currentDate);
  console.log("dateTimeString", dateTimeString);
  const isSameDay =
    dateTime.getDate() === currentDate.getDate() &&
    dateTime.getMonth() === currentDate.getMonth() &&
    dateTime.getFullYear() === currentDate.getFullYear();

  if (type === "date") {
    if (isSameDay) {
      return "Hôm nay";
    } else if (dateTime > currentDate) {
      return "Ngày mai";
    } else {
      const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "2-digit", day: "2-digit" };
      return dateTime.toLocaleDateString("vi-VN", options);
    }
  } else if (type === "time") {
    const hours = dateTime.getHours();
    const minutes = dateTime.getMinutes();
    return `${hours < 10 ? "0" + hours : hours}:${minutes < 10 ? "0" + minutes : minutes}`;
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
