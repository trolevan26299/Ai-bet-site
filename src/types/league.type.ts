type detailLeague = {
  league: string;
  number_match: number;
  favorite: boolean;
};
export type ILeague = {
  name: string;
  detail: detailLeague[];
};
