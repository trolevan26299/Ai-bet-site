import { IPayloadFetchOddsData } from "@/types/odds.types";
import axiosInstance, { endpoints } from "@/utils/axios";

export const fetchOddsData = async (payload: IPayloadFetchOddsData) => {
  const response = await axiosInstance.post(endpoints.match, payload);
  return response.data;
};
