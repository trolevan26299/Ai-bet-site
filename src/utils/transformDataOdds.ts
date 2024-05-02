import { IBetDetail, IMatchData } from "@/types/odds.types";

export const transformData = (data: IMatchData[], line: number) => {
  return data
    ?.map((item: IMatchData) => {
      const keoChinhToanTran = item.bets.spreads.find((bet: IBetDetail) => bet.number === 0 && bet.altLineId === 0);
      const keoChinhHiep1 = item.bets.spreads.find((bet: IBetDetail) => bet.number === 1 && bet.altLineId === 0);
      const keoChinhTaiXiuToanTran = item.bets.totals.find(
        (bet: IBetDetail) => bet.number === 0 && bet.altLineId === 0
      );
      const keoChinhTaiXiuHiep1 = item.bets.totals.find((bet: IBetDetail) => bet.number === 1 && bet.altLineId === 0);

      // Hàm helper để lấy ra kèo cược dựa vào số lượng hàng yêu cầu
      const filterBets = (
        bets: IBetDetail[],
        mainBet: IBetDetail | undefined,
        num: number,
        betType: "spreads" | "totals"
      ) => {
        if (!mainBet || num === 0) return bets; // Trả về tất cả các kèo nếu num là 0
        const range = (num - 1) / 2; // Tính toán khoảng cách từ kèo chính

        return bets
          .filter((bet: IBetDetail) => {
            // Xác định kèo dựa trên loại kèo chính
            const mainValue = betType === "spreads" ? mainBet.hdp : mainBet.points;
            const betValue = betType === "spreads" ? bet.hdp : bet.points;

            return (
              bet.number === mainBet.number && // Kiểm tra số của kèo
              ((mainValue !== undefined && betValue !== undefined && Math.abs(betValue - mainValue) <= range * 0.25) ||
                bet.altLineId === 0)
            ); // So sánh khoảng cách và lấy kèo chính
          })
          .slice(0, num); // Giới hạn số lượng kèo trả về
      };

      const spreadsToanTran = filterBets(item.bets.spreads, keoChinhToanTran, line, "spreads");
      const spreadsHiep1 = filterBets(item.bets.spreads, keoChinhHiep1, line, "spreads");
      const totalTaiXiuToanTran = filterBets(item.bets.totals, keoChinhTaiXiuToanTran, line, "totals");
      const totalTaiXiuHiep1 = filterBets(item.bets.totals, keoChinhTaiXiuHiep1, line, "totals");

      const result = [];

      if (spreadsToanTran && spreadsToanTran.length > 0) {
        result.push({
          name_Odds: "Kèo cược chấp - Toàn trận",
          detail: spreadsToanTran.map((spread: IBetDetail) => [
            {
              name: item.home,
              rate_odds: spread.hdp,
              value: spread.home,
              game_orientation: item.home,
              eventId: spread.eventId,
              lineId: spread.lineId,
              altLineId: spread.altLineId,
            },
            {
              name: item.away,
              rate_odds: spread.hdp === 0 ? 0 : spread.hdp ?? 0 >= 0 ? -(spread.hdp ?? 0) : Math.abs(spread.hdp ?? 0),
              value: spread.away,
              game_orientation: item.away,
              eventId: spread.eventId,
              lineId: spread.lineId,
              altLineId: spread.altLineId,
            },
          ]),
        });
      }
      if (spreadsHiep1 && spreadsHiep1.length > 0) {
        result.push({
          name_Odds: "Kèo cược chấp - Hiệp 1",
          detail: spreadsHiep1.map((spread: IBetDetail) => [
            {
              name: item.home,
              rate_odds: spread.hdp,
              value: spread.home,
              game_orientation: item.home,
              eventId: spread.eventId,
              lineId: spread.lineId,
              altLineId: spread.altLineId,
            },
            {
              name: item.away,
              rate_odds: spread.hdp === 0 ? 0 : spread.hdp ?? 0 >= 0 ? -(spread.hdp ?? 0) : Math.abs(spread.hdp ?? 0),
              value: spread.away,
              game_orientation: item.away,
              eventId: spread.eventId,
              lineId: spread.lineId,
              altLineId: spread.altLineId,
            },
          ]),
        });
      }

      if (totalTaiXiuToanTran && totalTaiXiuToanTran.length > 0) {
        result.push({
          name_Odds: "Kèo tài xỉu - Toàn trận",
          detail: totalTaiXiuToanTran.map((total: IBetDetail) => [
            {
              name: "Tài",
              rate_odds: total.points,
              value: total.over,
              game_orientation: "over",
              eventId: total.eventId,
              lineId: total.lineId,
              altLineId: total.altLineId,
            },
            {
              name: "Xỉu",
              rate_odds: total.points,
              value: total.under,
              game_orientation: "under",
              eventId: total.eventId,
              lineId: total.lineId,
              altLineId: total.altLineId,
            },
          ]),
        });
      }
      if (totalTaiXiuHiep1 && totalTaiXiuHiep1.length > 0) {
        result.push({
          name_Odds: "Kèo tài xỉu - Hiệp 1",
          detail: totalTaiXiuHiep1.map((total: IBetDetail) => [
            {
              name: "Tài",
              rate_odds: total.points,
              value: total.over,
              game_orientation: "over",
              eventId: total.eventId,
              lineId: total.lineId,
              altLineId: total.altLineId,
            },
            {
              name: "Xỉu",
              rate_odds: total.points,
              value: total.under,
              game_orientation: "under",
              eventId: total.eventId,
              lineId: total.lineId,
              altLineId: total.altLineId,
            },
          ]),
        });
      }
      return result;
    })
    .flat();
};
