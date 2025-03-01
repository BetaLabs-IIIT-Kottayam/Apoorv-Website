import { DashboardStats } from "@/types";
import axios from "axios";

const API_BASE_URL = `${import.meta.env.VITE_API_URL}/api/v1`; // Replace with your backend API URL

export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export const fetchDashboardStats = async (): Promise<DashboardStats> => {
  const response = await axiosInstance.get("/dashboard");
  return response.data;
};

import { useState, useEffect, useCallback } from "react";

// Type definitions
type OrderStatus = "Pending" | "Paid" | "Expired" | "Delivered";
type MerchSize = "XS" | "S" | "M" | "L" | "XL" | "2XL" | "3XL";

interface MerchData {
  colors: string[];
  description: string;
  name: string;
  photos: string[];
  price: number;
  sizes: string[];
  __v: number;
  _id: string;
}

interface BuyerDetails {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

interface OrderItem {
  merchId: MerchData;
  merchName: string;
  size: MerchSize;
  quantity: number;
  price: number;
  color: string;
}

export interface Order {
  _id: string;
  items: OrderItem[];
  totalAmount: number;
  secretCode: string;
  status: OrderStatus;
  razorpayOrderId: string;
  razorpayPaymentId?: string;
  paidAt?: string;
  expiredAt?: string;
  buyerDetails: BuyerDetails;
  createdAt: string;
  updatedAt: string;
}

// interface OrdersResponse {
//   orders: Order[];
//   count: number;
// } // Adjust based on your setup

// Custom hook for orders
export const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchOrders = useCallback(async (pageNum = page) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication token not found");
      }
      
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/v1/order?page=${pageNum}&limit=10`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.msg || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setOrders(data.orders || []);
      setTotalPages(data.totalPages || 1);
      setPage(pageNum);
      setTotalOrders(data.totalOrders || 0);
      setCurrentPage(data.currentPage || pageNum);
      return data;
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError(err instanceof Error ? err.message : "Failed to load orders. Please try again.");
      // Return empty data instead of throwing to prevent component crashes
      return { orders: [], count: 0, totalOrders: 0, totalPages: 0, currentPage: pageNum };
    } finally {
      setIsLoading(false);
    }
  }, [page]);

  const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
    try {
      setError(null);
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication token not found");
      }
      
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/order`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id: orderId, status }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.msg || `HTTP error! status: ${response.status}`);
      }

      // Update the order in the current state to avoid refetching
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order._id === orderId ? { ...order, status } : order
        )
      );
      
      return true;
    } catch (err) {
      console.error("Error updating order status:", err);
      setError(err instanceof Error ? err.message : "Failed to update order status");
      return false;
    }
  };

  useEffect(() => {
    fetchOrders(1);
  }, []);

  return {
    orders,
    isLoading,
    error,
    page: currentPage,
    totalPages,
    totalOrders,
    fetchOrders,
    updateOrderStatus,
  };
};

// Utility functions for the orders table
export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(amount);
};

export const getStatusColor = (status: OrderStatus): string => {
  const colors = {
    Pending: "text-yellow-500",
    Paid: "text-blue-500",
    Expired: "text-red-500",
    Delivered: "text-green-500",
  };
  return colors[status];
};
