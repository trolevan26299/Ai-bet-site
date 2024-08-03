import { HOST_API } from "@/config-global";
import axios from "axios";

const axiosInstance = axios.create({ baseURL: HOST_API });
axiosInstance.defaults.headers.common["Accept"] = "application/json, text/plain, */*";
axiosInstance.defaults.headers.common["Content-Type"] = "application/json";
axiosInstance.defaults.headers.common["Cache-Control"] = "no-cache, no-store, must-revalidate";
axiosInstance.defaults.headers.common["Pragma"] = "no-cache";

axiosInstance.interceptors.response.use(
  (res) => res,
  (error) => Promise.reject((error.response && error.response.data) || "Something went wrong")
);

export { axiosInstance };

// --------------------------ENDPONTS --------------------------------------------
export const endpoints = {
  game: "bot/game",
  match: "search/match",
  history: "proxy/call_api",
  favorite: {
    add: "favorite_leagues/insert_favorite_leagues",
    delete: "favorite_leagues/delete_favorite_leagues",
    get: "favorite_leagues/get_leagues_list",
  },
};
