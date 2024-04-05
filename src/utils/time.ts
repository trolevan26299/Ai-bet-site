export const convertToGMT7 = (dateTimeString: string, type: string) => {
  const dateTime = new Date(dateTimeString);
  const currentTime = new Date();

  // Chuyển đổi thời gian sang múi giờ GMT+7
  const GMT7DateTime = new Date(dateTime.getTime() + 7 * 60 * 60 * 1000);

  // Lấy ngày hiện tại ở múi giờ GMT+7
  const currentDateGMT7 = new Date(currentTime.getTime() - 7 * 60 * 60 * 1000);

  const oneDay = 24 * 60 * 60 * 1000;
  const diffDays = Math.floor((GMT7DateTime.getTime() - currentDateGMT7.getTime()) / oneDay);
  console.log(diffDays);

  if (type === "date") {
    if (diffDays === 1 || (diffDays === 0 && GMT7DateTime.getUTCHours() === 0)) {
      return "Ngày mai";
    } else if (diffDays === 0) {
      return "Hôm nay";
    } else {
      const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "2-digit", day: "2-digit" };
      return GMT7DateTime.toLocaleDateString("vi-VN", options);
    }
  } else if (type === "time") {
    const hours = (GMT7DateTime.getUTCHours() + 24) % 24;
    const minutes = GMT7DateTime.getMinutes();

    return `${hours}:${minutes < 10 ? "0" + minutes : minutes}`;
  } else {
    return "Invalid type";
  }
};
