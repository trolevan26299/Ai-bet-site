import { IBetDetail, IMatchData } from "@/types/odds.types";

export const transformData = (data: IMatchData[], numberLines = 0) => {
  return data
    ?.map((item: IMatchData) => {
      const keoChinhToanTran = item.bets.spreads.find((bet: IBetDetail) => bet.number === 0 && bet.altLineId === 0);
      const keoChinhHiep1 = item.bets.spreads.find((bet: IBetDetail) => bet.number === 1 && bet.altLineId === 0);
      const keoChinhTaiXiuToanTran = item.bets.totals.find(
        (bet: IBetDetail) => bet.number === 0 && bet.altLineId === 0
      );
      const keoChinhTaiXiuHiep1 = item.bets.totals.find((bet: IBetDetail) => bet.number === 1 && bet.altLineId === 0);

      const filterSpreads = (bet: any, centerHdp: any) => {
        if (numberLines === 0) return bet.number === 0;
        let range = Math.floor(numberLines / 2) * 0.25;
        return bet.number === 0 && bet.hdp >= centerHdp - range && bet.hdp <= centerHdp + range;
      };

      const spreadsToanTran = keoChinhToanTran
        ? item.bets.spreads.filter((bet: IBetDetail) => filterSpreads(bet, keoChinhToanTran.hdp))
        : [];

      const spreadsHiep1 = keoChinhHiep1
        ? item.bets.spreads.filter((bet: IBetDetail) => filterSpreads(bet, keoChinhHiep1.hdp))
        : [];

      const filterTotals = (bet: any, centerPoints: any) => {
        if (numberLines === 0) return bet.number === 0; // Return all lines for numberLines = 0
        let range = Math.floor(numberLines / 2) * 0.25;
        return bet.number === 0 && bet.points >= centerPoints - range && bet.points <= centerPoints + range;
      };

      const totalTaiXiuToanTran = keoChinhTaiXiuToanTran
        ? item.bets.totals.filter((bet: IBetDetail) => filterTotals(bet, keoChinhTaiXiuToanTran.points))
        : [];

      const totalTaiXiuHiep1 = keoChinhTaiXiuHiep1
        ? item.bets.totals.filter((bet: IBetDetail) => filterTotals(bet, keoChinhTaiXiuHiep1.points))
        : [];

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
