import { DashboardStats } from "@/types";
import axios from "axios";

const API_BASE_URL = `${import.meta.env.VITE_API_URL}/api/v1`; // Replace with your backend API URL

export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export const fetchDashboardStats = async (): Promise<DashboardStats> => {
  const response = await axiosInstance.get("/dashboard");
  return response.data;
};

import { useState, useEffect } from "react";

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

interface OrdersResponse {
  orders: Order[];
  count: number;
} // Adjust based on your setup

export const fetchOrders = async (): Promise<OrdersResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/order`,{
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw error;
  }
};

// Custom hook for orders
export const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadOrders = async () => {
    try {
      setIsLoading(true);
      const { orders } = await fetchOrders();
      setOrders(orders);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to fetch orders")
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
    try {
      const response = await fetch(`${API_BASE_URL}/order`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ id: orderId, status }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Refresh orders after update
      await loadOrders();
    } catch (error) {
      console.error("Error updating order status:", error);
      throw error;
    }
  };

  return {
    orders,
    isLoading,
    error,
    refreshOrders: loadOrders,
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
