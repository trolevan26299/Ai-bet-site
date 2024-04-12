import axiosInstance, { endpoints } from "@/utils/axios";

export const getUserInfo = async (body: any) => {
  const response = await axiosInstance.post(endpoints.history, body);
  return response.data;
};
