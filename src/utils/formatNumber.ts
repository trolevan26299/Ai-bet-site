export const formatNumber = (num: number) => {
  if (num) {
    if (Math.floor(num) !== num) {
      // Check if it's not an integer
      return num.toFixed(2).replace(/\.?0+$/, "");
    }
    return num.toString();
  }
};

export const formatNumberAndFloor = (num: number) => {
  const roundedNum = Math.round(num * 100) / 100; // Làm tròn đến 2 chữ số thập phân

  if (Math.floor(roundedNum) !== roundedNum) {
    // Check if it's not an integer
    return roundedNum.toFixed(2).replace(/\.?0+$/, "");
  }
  return roundedNum.toString();
};

export const formatNumberToFixed2 = (num: number) => {
  const flooredNum = Math.floor(num * 100) / 100; // Loại bỏ phần dư sau hai chữ số thập phân mà không làm tròn

  if (Math.floor(flooredNum) !== flooredNum) {
    // Kiểm tra nếu số không phải là số nguyên
    return flooredNum.toFixed(2); // Giữ nguyên hai chữ số thập phân
  }
  return flooredNum.toString(); // Chỉ trả về phần nguyên nếu là số nguyên
};
