import { IBetDetail, IMatchData } from "@/types/odds.types";

export const transformDataCorner = (data: IMatchData[], line: string) => {
  return data
    ?.map((item: IMatchData) => {
      const gocChinhCuocChapToanTran = item?.bets?.spreads?.find(
        (bet: IBetDetail) => bet?.number === 0 && bet?.altLineId === 0
      );
      const gocChinhCuocChapHiep1 = item?.bets?.spreads?.find(
        (bet: IBetDetail) => bet?.number === 1 && bet?.altLineId === 0
      );
      const gocChinhTaiXiuToanTran = item?.bets?.totals?.find(
        (bet: IBetDetail) => bet?.number === 0 && bet?.altLineId === 0
      );
      const gocChinhTaiXiuHiep1 = item?.bets?.totals?.find(
        (bet: IBetDetail) => bet?.number === 1 && bet?.altLineId === 0
      );

      // Hàm helper để lấy ra kèo cược dựa vào số lượng hàng yêu cầu
      const filterBets = (
        bets: IBetDetail[],
        mainBet: IBetDetail | undefined,
        num: number,
        betType: "spreads" | "totals"
      ) => {
        if (!mainBet) return []; // Trả về tất cả các kèo nếu mainBet không tồn tại
        if (num === 0) num = 9; // Lấy ra tất cả kèo là 9 maximum
        const range = (num - 1) / 2; // Tính toán khoảng cách từ kèo chính

        return bets
          ?.filter((bet: IBetDetail) => {
            // Xác định kèo dựa trên loại kèo chính
            const mainValue = betType === "spreads" ? mainBet?.hdp : mainBet?.points;
            const betValue = betType === "spreads" ? bet?.hdp : bet?.points;

            return (
              bet?.number === mainBet?.number && // Kiểm tra số của kèo
              ((mainValue !== undefined && betValue !== undefined && Math.abs(betValue - mainValue) <= range * 0.5) ||
                bet?.altLineId === 0)
            ); // So sánh khoảng cách và lấy kèo chính
          })
          ?.slice(0, num); // Giới hạn số lượng kèo trả về
      };

      const gocCuocChapToanTran = filterBets(item?.bets?.spreads, gocChinhCuocChapToanTran, Number(line), "spreads");
      const gocCuocChapHiep1 = filterBets(item?.bets?.spreads, gocChinhCuocChapHiep1, Number(line), "spreads");
      const gocTaiXiuToanTran = filterBets(item?.bets?.totals, gocChinhTaiXiuToanTran, Number(line), "totals");
      const gocTaiXiuHiep1 = filterBets(item?.bets?.totals, gocChinhTaiXiuHiep1, Number(line), "totals");

      const result = [];

      if (gocCuocChapToanTran && gocCuocChapToanTran?.length > 0) {
        result.push({
          name_Odds: "Cược chấp phạt góc - Toàn trận",
          status: gocChinhCuocChapToanTran?.status,
          detail: gocCuocChapToanTran?.map((spread: IBetDetail) => [
            {
              name: item?.home,
              rate_odds: spread?.hdp,
              value: spread?.home,
              game_orientation: item?.home,
              eventId: spread?.eventId,
              lineId: spread?.lineId,
              altLineId: spread?.altLineId,
            },
            {
              name: item?.away,
              rate_odds:
                spread?.hdp === 0 ? 0 : spread?.hdp ?? 0 >= 0 ? -(spread?.hdp ?? 0) : Math.abs(spread?.hdp ?? 0),
              value: spread?.away,
              game_orientation: item?.away,
              eventId: spread?.eventId,
              lineId: spread?.lineId,
              altLineId: spread?.altLineId,
            },
          ]),
        });
      }
      if (gocCuocChapHiep1 && gocCuocChapHiep1.length > 0) {
        result?.push({
          name_Odds: "Cược chấp phạt góc - Hiệp 1",
          status: gocChinhCuocChapHiep1?.status,
          detail: gocCuocChapHiep1?.map((spread: IBetDetail) => [
            {
              name: item?.home,
              rate_odds: spread?.hdp,
              value: spread?.home,
              game_orientation: item?.home,
              eventId: spread?.eventId,
              lineId: spread?.lineId,
              altLineId: spread?.altLineId,
            },
            {
              name: item?.away,
              rate_odds: spread?.hdp === 0 ? 0 : spread?.hdp ?? 0 >= 0 ? -(spread.hdp ?? 0) : Math.abs(spread.hdp ?? 0),
              value: spread?.away,
              game_orientation: item?.away,
              eventId: spread?.eventId,
              lineId: spread?.lineId,
              altLineId: spread?.altLineId,
            },
          ]),
        });
      }

      if (gocTaiXiuToanTran && gocTaiXiuToanTran?.length > 0) {
        result.push({
          name_Odds: "Tài xỉu phạt góc - Toàn trận",
          status: gocChinhTaiXiuToanTran?.status,
          detail: gocTaiXiuToanTran?.map((total: IBetDetail) => [
            {
              name: "Tài",
              rate_odds: total?.points,
              value: total?.over,
              game_orientation: "over",
              eventId: total?.eventId,
              lineId: total?.lineId,
              altLineId: total?.altLineId,
            },
            {
              name: "Xỉu",
              rate_odds: total?.points,
              value: total?.under,
              game_orientation: "under",
              eventId: total?.eventId,
              lineId: total?.lineId,
              altLineId: total?.altLineId,
            },
          ]),
        });
      }
      if (gocTaiXiuHiep1 && gocTaiXiuHiep1?.length > 0) {
        result.push({
          name_Odds: "Tài xỉu phạt góc - Hiệp 1",
          status: gocChinhTaiXiuHiep1?.status,
          detail: gocTaiXiuHiep1?.map((total: IBetDetail) => [
            {
              name: "Tài",
              rate_odds: total?.points,
              value: total?.over,
              game_orientation: "over",
              eventId: total?.eventId,
              lineId: total?.lineId,
              altLineId: total?.altLineId,
            },
            {
              name: "Xỉu",
              rate_odds: total?.points,
              value: total?.under,
              game_orientation: "under",
              eventId: total?.eventId,
              lineId: total?.lineId,
              altLineId: total?.altLineId,
            },
          ]),
        });
      }

      return result;
    })
    .flat();
};
