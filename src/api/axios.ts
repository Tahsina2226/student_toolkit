import axios from "axios";

export const API_BASE = "http://localhost:5000/api";

const axiosInstance = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
