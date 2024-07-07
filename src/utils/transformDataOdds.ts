import { IBetDetail, IMatchData } from "@/types/odds.types";

export const transformData = (data: IMatchData[], line: string) => {
  return data
    ?.map((item: IMatchData) => {
      const keoChinhToanTran = item?.bets?.spreads?.find(
        (bet: IBetDetail) => bet?.number === 0 && bet?.altLineId === 0
      );
      const keoChinhHiep1 = item?.bets?.spreads?.find((bet: IBetDetail) => bet?.number === 1 && bet?.altLineId === 0);
      const keoChinhTaiXiuToanTran = item?.bets?.totals?.find(
        (bet: IBetDetail) => bet?.number === 0 && bet?.altLineId === 0
      );
      const keoChinhTaiXiuHiep1 = item?.bets?.totals?.find(
        (bet: IBetDetail) => bet?.number === 1 && bet?.altLineId === 0
      );
      const keoChinhHiepPhu = item?.bets?.spreads?.find((bet: IBetDetail) => bet?.number === 3 && bet?.altLineId === 0);
      const keoChinhTaiXiuHiepPhu = item?.bets?.totals?.find(
        (bet: IBetDetail) => bet?.number === 3 && bet?.altLineId === 0
      );
      const keoChinhTaiXiu10Pen = item?.bets?.totals?.find(
        (bet: IBetDetail) => bet?.number === 7 && bet?.altLineId === 0
      );
      const keoChinh1X2Pen = item?.bets?.moneylines?.find(
        (bet: IBetDetail) => bet?.number === 6 && bet?.altLineId === 0
      );
      // Hàm helper để lấy ra kèo cược dựa vào số lượng hàng yêu cầu
      const filterBets = (
        bets: IBetDetail[],
        mainBet: IBetDetail | undefined,
        num: number,
        betType: "spreads" | "totals" | "moneylines"
      ) => {
        if (!mainBet) return []; // Trả về tất cả các kèo nếu num là 0
        if (num === 0) num = 9; // Lấy ra tất cả kèo là 9 maximum
        const range = (num - 1) / 2; // Tính toán khoảng cách từ kèo chính

        return bets
          ?.filter((bet: IBetDetail) => {
            // Xác định kèo dựa trên loại kèo chính
            const mainValue = betType === "spreads" ? mainBet?.hdp : mainBet?.points;
            const betValue = betType === "spreads" ? bet?.hdp : bet?.points;

            return (
              bet?.number === mainBet?.number && // Kiểm tra số của kèo
              ((mainValue !== undefined && betValue !== undefined && Math.abs(betValue - mainValue) <= range * 0.25) ||
                bet?.altLineId === 0)
            ); // So sánh khoảng cách và lấy kèo chính
          })
          ?.slice(0, num); // Giới hạn số lượng kèo trả về
      };

      const spreadsToanTran = filterBets(item?.bets?.spreads, keoChinhToanTran, Number(line), "spreads");
      const spreadsHiep1 = filterBets(item?.bets?.spreads, keoChinhHiep1, Number(line), "spreads");
      const spreadsHiepPhu = filterBets(item?.bets?.spreads, keoChinhHiepPhu, Number(line), "spreads");
      const totalTaiXiuToanTran = filterBets(item?.bets?.totals, keoChinhTaiXiuToanTran, Number(line), "totals");
      const totalTaiXiuHiep1 = filterBets(item?.bets?.totals, keoChinhTaiXiuHiep1, Number(line), "totals");
      const totalTaiXiuHiepPhu = filterBets(item?.bets?.totals, keoChinhTaiXiuHiepPhu, Number(line), "totals");
      const totalTaiXiu10Pen = filterBets(item?.bets?.totals, keoChinhTaiXiu10Pen, Number(line), "totals");
      const moneyLine1x2Pen = filterBets(item?.bets?.moneylines, keoChinh1X2Pen, Number(line), "moneylines");

      const result = [];

      if (spreadsToanTran && spreadsToanTran?.length > 0) {
        result.push({
          name_Odds: "Kèo cược chấp - Toàn trận",
          status: keoChinhToanTran?.status,
          detail: spreadsToanTran?.map((spread: IBetDetail) => [
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
      if (spreadsHiep1 && spreadsHiep1.length > 0) {
        result?.push({
          name_Odds: "Kèo cược chấp - Hiệp 1",
          status: keoChinhHiep1?.status,
          detail: spreadsHiep1?.map((spread: IBetDetail) => [
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
      if (spreadsHiepPhu && spreadsHiepPhu?.length > 0) {
        result.push({
          name_Odds: "Kèo cược chấp - Hiệp phụ",
          status: keoChinhHiepPhu?.status,
          detail: spreadsHiepPhu?.map((spread: IBetDetail) => [
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
                spread?.hdp === 0 ? 0 : spread?.hdp ?? 0 >= 0 ? -(spread?.hdp ?? 0) : Math.abs(spread.hdp ?? 0),
              value: spread?.away,
              game_orientation: item?.away,
              eventId: spread?.eventId,
              lineId: spread?.lineId,
              altLineId: spread?.altLineId,
            },
          ]),
        });
      }

      if (totalTaiXiuToanTran && totalTaiXiuToanTran?.length > 0) {
        result.push({
          name_Odds: "Kèo tài xỉu - Toàn trận",
          status: keoChinhTaiXiuToanTran?.status,
          detail: totalTaiXiuToanTran?.map((total: IBetDetail) => [
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
      if (totalTaiXiuHiep1 && totalTaiXiuHiep1?.length > 0) {
        result.push({
          name_Odds: "Kèo tài xỉu - Hiệp 1",
          status: keoChinhTaiXiuHiep1?.status,
          detail: totalTaiXiuHiep1?.map((total: IBetDetail) => [
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
      if (totalTaiXiuHiepPhu && totalTaiXiuHiepPhu?.length > 0) {
        result.push({
          name_Odds: "Kèo tài xỉu - Hiệp phụ",
          status: keoChinhTaiXiuHiepPhu?.status,
          detail: totalTaiXiuHiepPhu?.map((total: IBetDetail) => [
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
      if (totalTaiXiu10Pen && totalTaiXiu10Pen?.length > 0) {
        result.push({
          name_Odds: "Kèo tài xỉu - Luân lưu 10 quả",
          status: keoChinhTaiXiu10Pen?.status,
          detail: totalTaiXiu10Pen?.map((total: IBetDetail) => [
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
      if (moneyLine1x2Pen && moneyLine1x2Pen?.length > 0) {
        result.push({
          name_Odds: "Kèo 1X2 - Luân lưu",
          status: keoChinh1X2Pen?.status,
          detail: moneyLine1x2Pen?.map((spread: IBetDetail) => [
            {
              name: item?.home,
              value: spread?.home,
              game_orientation: item?.home,
              eventId: spread?.eventId,
              lineId: spread?.lineId,
              altLineId: spread?.altLineId,
            },
            {
              name: item?.away,
              value: spread?.away,
              game_orientation: item?.away,
              eventId: spread?.eventId,
              lineId: spread?.lineId,
              altLineId: spread?.altLineId,
            },
          ]),
        });
      }

      return result;
    })
    .flat();
};
