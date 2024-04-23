import moment from "moment-timezone";

export const currentTimeUtcMinus4 = () => {
  const currentTime = moment().tz("America/New_York").tz("EDT");
  return currentTime.format("YYYY-MM-DD HH:mm:ss");
};
