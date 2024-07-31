export function getDayAndMonth(dateString: string) {
  // Tách các thành phần ngày, tháng, năm từ chuỗi
  const [day, month, year] = dateString.split("/").map(Number);

  // Trả về chỉ ngày và tháng dưới dạng chuỗi
  return `${day}/${month}`;
}
