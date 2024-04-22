export const formatNumber = (num: number) => {
  if (Math.floor(num) !== num) {
    // Check if it's not an integer
    return num.toFixed(2).replace(/\.?0+$/, "");
  }
  return num.toString();
};
