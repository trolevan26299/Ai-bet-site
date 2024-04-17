export type IUserInfo = {
  username: string;
  password: string;
};

export type IHistoryBet = {
  betId: number;
  uniqueRequestId: string;
  wagerNumber: number;
  placedAt: string;
  betStatus: string;
  betStatus2: string;
  betType: string;
  win: number;
  risk: number;
  side?: string;

  oddsFormat: string;
  customerCommission: number;
  updateSequence: number;
  sportId: number;
  leagueId: number;
  leagueName: string;
  eventId: number;
  handicap: number;
  price: number;
  teamName?: string;
  team1: string;
  team2: string;
  periodNumber: number;
  isLive: string;
  eventStartTime: string;
  resultingUnit: string;
  winLoss?: number;
};
