export const formatBet = (oddsFormat: string) => {
  const formatMap: { [key: string]: string } = {
    AMERICAN: "AM",
    DECIMAL: "DEC",
    HONGKONG: "HK",
    INDONESIAN: "IND",
    MALAY: "MY",
  };
  return formatMap[oddsFormat] || oddsFormat;
};
