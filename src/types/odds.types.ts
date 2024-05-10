export type IBetDetail = {
  altLineId: number;
  hdp?: number;
  home?: number;
  away?: number;
  max?: number;
  points?: number;
  over?: number;
  under?: number;
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
  liveState: number;
};

export type IOdds = {
  name: string;
  rate_odds: number;
  value: number;
  game_orientation: string;
  eventId: number;
  lineId: number;
  altLineId: number;
};
export type IOddsDetail = {
  name_Odds: string;
  detail: IOdds[][];
};

export type OddsStatusType = Record<string, "green" | "red" | "none">;

export type IPayloadFetchOddsData = {
  request_id: string | null;
  match: string[];
  time: string;
  league: string | null;
  game_type: string;
  game_detail: string;
  game_scope: string;
  filter_by: string;
};

type IDataBetConfirm = {
  league_name: string;
  team: string[];
  last_updated_odd: string;
  liveStatus: boolean;
  liveMinute: string;
  liveScope: string;
  starts: string;
  home: string;
  away: string;
  game_type: string;
  game_detail: number;
  game_scope: string;
  odds: number;
  game_orientation: string;
  eventId: number;
  lineId: number;
  altLineId: number;
};
export type IBetConfirm = {
  request_id: string;
  data: IDataBetConfirm;
};
