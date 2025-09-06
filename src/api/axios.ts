import axios from "axios";

export const API_BASE = "https://studenttoolkit.vercel.app/api";

const axiosInstance = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
