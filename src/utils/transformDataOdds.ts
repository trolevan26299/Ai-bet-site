import { IBetDetail, IMatchData } from "@/types/odds.types";

export const transformData = (data: IMatchData[]) => {
  return data
    ?.map((item: IMatchData) => {
      const keoChinhToanTran = item.bets.spreads.find((bet: IBetDetail) => bet.number === 0 && bet.altLineId === 0);
      const keoChinhHiep1 = item.bets.spreads.find((bet: IBetDetail) => bet.number === 1 && bet.altLineId === 0);
      const keoChinhTaiXiu = item.bets.totals.find((bet: IBetDetail) => bet.altLineId === 0);

      const spreadsToanTran =
        keoChinhToanTran &&
        item.bets.spreads
          .filter(
            (bet: IBetDetail) =>
              bet.number === 0 &&
              (bet.hdp === (keoChinhToanTran?.hdp || 0) - 0.25 ||
                bet.altLineId === 0 ||
                bet.hdp === (keoChinhToanTran.hdp || 0) + 0.25) // bỏ dòng này lấy ra tất cả
          )
          .slice(0, 3);

      const spreadsHiep1 =
        keoChinhHiep1 &&
        item.bets.spreads
          .filter(
            (bet: IBetDetail) =>
              bet.number === 1 &&
              (bet.hdp === (keoChinhHiep1.hdp || 0) - 0.25 ||
                bet.altLineId === 0 ||
                bet.hdp === (keoChinhHiep1.hdp || 0) + 0.25) // bỏ dòng này lấy ra tất cả
          )
          .slice(0, 3);

      const spreadsTaiXiu =
        keoChinhTaiXiu &&
        item.bets.totals
          .filter(
            (bet: IBetDetail) =>
              bet.points === (keoChinhTaiXiu.points || 0) - 0.25 ||
              bet.altLineId === 0 ||
              bet.points === (keoChinhTaiXiu.points || 0) + 0.25 // bỏ dòng này lấy ra tất cả
          )
          .slice(0, 3);

      return [
        {
          name_Odds: "Kèo cược chấp - Toàn trận",
          detail:
            spreadsToanTran &&
            spreadsToanTran?.map((spread: IBetDetail) => [
              {
                name: item.home,
                rate_odds: spread.hdp,
                value: spread.home,
              },
              {
                name: item.away,
                rate_odds: spread.hdp === 0 ? 0 : spread.hdp ?? 0 >= 0 ? -(spread.hdp ?? 0) : Math.abs(spread.hdp ?? 0),
                value: spread.away,
              },
            ]),
        },
        {
          name_Odds: "Kèo cược chấp - Hiệp 1",
          detail:
            spreadsHiep1 &&
            spreadsHiep1?.map((spread: IBetDetail) => [
              {
                name: item.home,
                rate_odds: spread.hdp,
                value: spread.home,
              },
              {
                name: item.away,
                rate_odds: spread.hdp === 0 ? 0 : spread.hdp ?? 0 >= 0 ? -(spread.hdp ?? 0) : Math.abs(spread.hdp ?? 0),
                value: spread.away,
              },
            ]),
        },
        {
          name_Odds: "Kèo tài xỉu - Toàn trận",
          detail:
            spreadsTaiXiu &&
            spreadsTaiXiu?.map((total: IBetDetail) => [
              { name: "Tài", rate_odds: total.points, value: total.over },
              { name: "Xỉu", rate_odds: total.points, value: total.under },
            ]),
        },
      ];
    })
    .flat();
};
