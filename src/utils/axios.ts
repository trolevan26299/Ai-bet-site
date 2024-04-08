import { HOST_API } from "@/config-global";
import axios from "axios";

const axiosInstance = axios.create({ baseURL: HOST_API });
axiosInstance.defaults.headers.common["Accept"] = "application/json, text/plain, */*";
axiosInstance.defaults.headers.common["Content-Type"] = "application/json";
axiosInstance.interceptors.response.use(
  (res) => res,
  (error) => Promise.reject((error.response && error.response.data) || "Something went wrong")
);

export default axiosInstance;

// --------------------------ENDPONTS --------------------------------------------
export const endpoints = {
  game: "bot/game",
  match: "search/match",
};
