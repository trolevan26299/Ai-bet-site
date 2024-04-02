export type IBetDetail = {
  altLineId: number;
  hdp?: number;
  home?: number;
  away?: number;
  max?: number;
  lineId: number;
  eventId: number;
  number: number;
};

export type IBet = {
  spreads: IBetDetail[];
  totals: IBetDetail[];
};

export type IMatchData = {
  id: number;
  starts: string;
  home: string;
  away: string;
  rotNum: string;
  liveStatus: boolean;
  status: string;
  parlayRestriction: number;
  altTeaser: boolean;
  resultingUnit: string;
  betAcceptanceType: number;
  version: number;
  league_name: string;
  time: string;
  team: string[];
  last_updated_odd: string;
  liveMinute: string;
  liveScope: string;
  awayScore?: number;
  homeScore?: number;
  awayRedCards?: number;
  homeRedCards?: number;
  bets: IBet;
};