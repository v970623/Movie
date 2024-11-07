import axios from "axios";
import { message } from "antd";

const request = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5001/api",
  timeout: 10000,
});

request.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

request.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    message.error(error.response?.data?.message || "Error requesting");
    return Promise.reject(error);
  }
);

export default request;
