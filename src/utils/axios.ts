import { HOST_API } from "@/config-global";
import axios from "axios";

const axiosInstance = axios.create({ baseURL: HOST_API });
axiosInstance.defaults.headers.common["Accept"] = "application/json, text/plain, */*";
axiosInstance.defaults.headers.common["Content-Type"] = "application/json";
axiosInstance.interceptors.response.use(
  (res) => res,
  (error) => Promise.reject((error.response && error.response.data) || "Something went wrong")
);

// Thêm các thông số và tiêu đề mở rộng vào mỗi request
axiosInstance.interceptors.request.use(
  (config) => {
    // Thiết lập các thông số mở rộng
    config.headers["Sec-Ch-Ua"] = '"Google Chrome";v="123", "Not:A-Brand";v="8", "Chromium";v="123"';
    config.headers["Sec-Ch-Ua-Platform"] = '"Windows"';
    config.headers["Sec-Fetch-Dest"] = "empty";
    config.headers["Sec-Fetch-Mode"] = "cors";
    config.headers["Sec-Fetch-Site"] = "cross-site";

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
export default axiosInstance;

// --------------------------ENDPONTS --------------------------------------------
export const endpoints = {
  game: "bot/game",
  match: "search/match",
};
