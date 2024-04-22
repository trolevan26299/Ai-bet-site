export const formatNumber = (num: number) => {
  if (Math.floor(num) !== num) {
    // Check if it's not an integer
    return num.toFixed(2).replace(/\.?0+$/, "");
  }
  return num.toString();
};

export const formatNumberAndFloor = (num: number) => {
  const roundedNum = Math.round(num * 100) / 100; // Làm tròn đến 2 chữ số thập phân

  if (Math.floor(roundedNum) !== roundedNum) {
    // Check if it's not an integer
    return roundedNum.toFixed(2).replace(/\.?0+$/, "");
  }
  return roundedNum.toString();
};
