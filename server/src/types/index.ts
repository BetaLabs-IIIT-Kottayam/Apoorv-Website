// Types for our data models
interface Order {
  id: number;
  customer: string;
  items: OrderItem[];
  total: number;
  status: "not_delivered" | "delivered";
  code: string;
  createdAt: Date;
}

interface OrderItem {
  id: number;
  productId: number;
  size: "S" | "M" | "L" | "XL" | "XXL";
  quantity: number;
  price: number;
}

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  sizes: Array<{
    size: "S" | "M" | "L" | "XL" | "XXL";
    inventory: number;
  }>;
}

// API Endpoints

// Analytics endpoints
//   GET /api/analytics/quick-stats
//   Response: {
//     totalOrders: number;
//     totalRevenue: number;
//     itemsSold: number;
//     dailyAverage: number;
//     uniqueCustomers: number;
//   }

//   GET /api/analytics/sales-trend
//   Query params: {
//     startDate: string;
//     endDate: string;
//     groupBy: 'day' | 'week' | 'month';
//   }
//   Response: Array<{
//     date: string;
//     sales: number;
//     revenue: number;
//   }>

//   GET /api/analytics/items-distribution
//   Response: Array<{
//     name: string;
//     value: number;
//     price: number;
//   }>

//   GET /api/analytics/size-distribution
//   Response: Array<{
//     size: string;
//     value: number;
//   }>

//   GET /api/analytics/order-status
//   Response: Array<{
//     status: string;
//     value: number;
//   }>

//   // Orders endpoints
//   GET /api/orders
//   Query params: {
//     status?: 'not_delivered' | 'delivered';
//     page?: number;
//     limit?: number;
//     sort?: string;
//   }
//   Response: {
//     orders: Order[];
//     total: number;
//     page: number;
//     totalPages: number;
//   }

//   PATCH /api/orders/:orderId/status
//   Request body: {
//     status: 'delivered' | 'not_delivered';
//   }
//   Response: Order

//   // Products endpoints
//   GET /api/products
//   POST /api/products
//   PATCH /api/products/:productId
//   DELETE /api/products/:productId

//   // Inventory management
//   PATCH /api/products/:productId/inventory
//   Request body: {
//     size: string;
//     quantity: number;
//   }
