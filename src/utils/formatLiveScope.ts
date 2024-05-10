export const formatLiveScope = (status: number): string => {
  const statusMap: { [key: number]: string } = {
    1: "Hiệp 1",
    2: "Nghỉ giữa hiệp",
    3: "Hiệp 2",
    4: "Kết thúc hiệp chính",
    5: "Hiệp phụ 1",
    6: "Nghỉ giữa hiệp phụ",
    7: "Hiệp phụ 2",
    8: "Kết thúc hiệp phụ",
    9: "Kết thúc trận",
    10: "Trận đấu tạm hoãn",
    11: "Luân lưu",
  };
  return statusMap[status] || "";
};
