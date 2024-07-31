const daysOfWeek = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];

export function getDayOfWeek(dateString: string) {
  const [day, month, year] = dateString.split("/").map(Number);

  // Tạo đối tượng Date với năm, tháng (trong JS tháng bắt đầu từ 0) và ngày
  const date = new Date(year, month - 1, day);

  // Lấy số ngày trong tuần (0-6) và tìm tên ngày trong tuần
  const dayOfWeek = date.getDay();
  return daysOfWeek[dayOfWeek];
}
