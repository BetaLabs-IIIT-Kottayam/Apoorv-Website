import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api/v1"; // Replace with your backend API URL

export const fetchStatistics = async () => {
  try {
    const ordersResponse = await axios.get(`${API_BASE_URL}/orders`);

    const totalOrders = ordersResponse.data.count;
    const totalRevenue = ordersResponse.data.orders.reduce(
      (acc, order) => acc + order.totalAmount,
      0
    );
    const itemsSold = ordersResponse.data.orders.reduce(
      (acc, order) => acc + order.items.length,
      0
    );
    const uniqueCustomers = new Set(
      ordersResponse.data.orders.map((order) => order.customerId)
    ).size;

    return {
      totalOrders,
      totalRevenue,
      itemsSold,
      uniqueCustomers,
    };
  } catch (error) {
    console.error("Error fetching statistics:", error);
    return null;
  }
};
