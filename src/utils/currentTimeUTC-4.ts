import { addHours } from "date-fns";
import { toZonedTime } from "date-fns-tz";

export const getCurrentUtcTimeUTCMinus4 = () => {
  const now = new Date();
  const utcDate = toZonedTime(now, "UTC");
  const currentUtcMinus4 = addHours(utcDate, 3);
  return currentUtcMinus4;
};
