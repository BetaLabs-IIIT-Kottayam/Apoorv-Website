import { DashboardStats } from "@/types";
import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api/v1"; // Replace with your backend API URL

export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
});

export const fetchDashboardStats = async (): Promise<DashboardStats> => {
  const response = await axiosInstance.get("/dashboard");
  return response.data;
};
