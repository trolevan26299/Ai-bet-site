export const fetchNewOddsValue = (oldValue: any) => {
  const change = Math.random() < 0.5 ? -Math.random() : Math.random();
  return Number((oldValue + change).toFixed(2));
};
