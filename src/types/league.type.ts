type detailLeague = {
  league: string;
  number_match: number;
  favorite: boolean;
  league_id: number;
};
export type ILeague = {
  name: string;
  detail: detailLeague[];
};
