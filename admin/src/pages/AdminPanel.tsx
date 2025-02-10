import { fetchDashboardStats, formatCurrency, formatDate, getStatusColor, useOrders } from "@/api";
import SizeDistributionChart from "@/components/SizeDistributionChart";
import { DashboardStats } from "@/types";
import {
  Loader,
  Package,
  Search,
  ShoppingBag
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type OrderStatus = "Delivered" | "Paid";

interface Order {
  id: number;
  customer: string;
  email: string;
  items: string[];
  total: string;
  status: OrderStatus;
  code: string;
  date: string;
}

const AdminLayout = () => {
  const [activeTab, setActiveTab] = useState("analytics");
  const [data, setData] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [orders, ] = useState<Order[]>([]);

  //TODO: Order status - Paid but not delivered, Paid delivered
  const orderStatus = [
    {
      name: "Paid",
      value: orders.filter((o) => o.status === "Paid").length,
    },
    {
      name: "Delivered",
      value: orders.filter((o) => o.status === "Delivered").length,
    },
  ];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

  const StatCard = ({
    title,
    value,
    icon: Icon,
    color,
  }: {
    title: string;
    value: number | string;
    icon: typeof Package | typeof ShoppingBag;
    color: string;
  }) => (
    <div className={`${color} rounded-lg p-6 flex items-center gap-4`}>
      <Icon className="w-8 h-8 text-white" />
      <div>
        <h3 className="text-white text-sm font-medium">{title}</h3>
        <p className="text-white text-2xl font-bold">{value}</p>
      </div>
    </div>
  );

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        const stats = await fetchDashboardStats();
        setData(stats);
      } catch (err) {
        setError("Failed to load dashboard data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadDashboardData();
  }, []);

  console.log(data);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader className="w-8 h-8 text-white animate-spin" />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center p-4">{error}</div>;
  }

  if (!data) {
    return null;
  }

  const chartData = data?.merchSalesSummary.map(
    (item: {
      merchName: string;
      totalQuantity: number;
      totalRevenue: number;
    }) => ({
      name: item.merchName,
      quantity: item.totalQuantity,
      revenue: item.totalRevenue,
    })
  );

  const AnalyticsTab = () => (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-8">
        <StatCard
          title="Total Orders"
          value={data.summary.totalOrders}
          icon={Package}
          color="bg-blue-500"
        />
        <StatCard
          title="Total Revenue"
          value={`₹${data.summary.totalAmount}`}
          icon={ShoppingBag}
          color="bg-green-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white/5 rounded-lg border border-white/10 p-6">
          <h2 className="text-xl font-bold text-white mb-4">
            Items Distribution
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="name" stroke="#666" />
              <YAxis stroke="#666" />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {data && <SizeDistributionChart data={data} />}

        <div className="bg-white/5 rounded-lg border border-white/10 p-6">
          <h2 className="text-xl font-bold text-white mb-4">Order Status</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={orderStatus}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {orderStatus.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  );



const OrdersTab = () => {
    const { orders, isLoading, error, updateOrderStatus } = useOrders();
    const [searchField, setSearchField] = useState<'secretCode' | 'firstName' | 'email'>('secretCode');
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | OrderStatus>('all');

    const filteredOrders = orders.filter(order => {
        const matchesSearch = searchQuery === '' || (
            searchField === 'secretCode' ? order.secretCode.toLowerCase().includes(searchQuery.toLowerCase()) :
            searchField === 'firstName' ? order.buyerDetails.firstName.toLowerCase().includes(searchQuery.toLowerCase()) :
            order.buyerDetails.email.toLowerCase().includes(searchQuery.toLowerCase())
        );

        const matchesStatus = statusFilter === 'all';

        return matchesSearch && matchesStatus;
    });

    if (isLoading) return <div className="text-center py-8">Loading orders...</div>;
    if (error) return <div className="text-center py-8 text-red-500">Error: {error.message}</div>;

    return (
        <div className="bg-white/5 rounded-lg border border-white/10 p-6">
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <h2 className="text-xl font-bold text-white">Orders Management</h2>
                <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                    <div className="flex gap-2 w-full md:w-auto">
                        <select
                            className="bg-black text-white rounded-lg px-4 py-2"
                            value={searchField}
                            onChange={(e) => setSearchField(e.target.value as typeof searchField)}
                        >
                            <option value="secretCode">Search by Code</option>
                            <option value="firstName">Search by Name</option>
                            <option value="email">Search by Email</option>
                        </select>
                        <div className="relative flex-1 md:w-64">
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search orders..."
                                className="w-full bg-white/10 text-white rounded-lg pl-10 pr-4 py-2"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                    <select
                        className="bg-black text-white rounded-lg px-4 py-2"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value as 'all' | OrderStatus)}
                    >
                        <option value="all">All Orders</option>
                        <option value="Pending">Pending</option>
                        <option value="Paid">Paid</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Expired">Expired</option>
                    </select>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="text-gray-400 border-b border-white/10">
                            <th className="py-3 px-4 text-left">Order ID</th>
                            <th className="py-3 px-4 text-left">Date</th>
                            <th className="py-3 px-4 text-left">Customer</th>
                            <th className="py-3 px-4 text-left">Email</th>
                            <th className="py-3 px-4 text-left">Items</th>
                            <th className="py-3 px-4 text-left">Total</th>
                            <th className="py-3 px-4 text-left">Code</th>
                            <th className="py-3 px-4 text-left">Status</th>
                            <th className="py-3 px-4 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredOrders.map((order) => (
                            <tr key={order._id} className="border-b border-white/10">
                                <td className="py-4 px-4 text-white">{order._id}</td>
                                <td className="py-4 px-4 text-white">{formatDate(order.createdAt)}</td>
                                <td className="py-4 px-4 text-white">
                                    {`${order.buyerDetails.firstName} ${order.buyerDetails.lastName}`}
                                </td>
                                <td className="py-4 px-4 text-white">{order.buyerDetails.email}</td>
                                <td className="py-4 px-4 text-white">
                                    {order.items.map(item => 
                                        `${item.merchName} (${item.size}) x${item.quantity}`
                                    ).join(", ")}
                                </td>
                                <td className="py-4 px-4 text-white">{formatCurrency(order.totalAmount)}</td>
                                <td className="py-4 px-4 text-white">{order.secretCode}</td>
                                <td className="py-4 px-4">
                                    <div className={`flex items-center gap-2 ${getStatusColor(order.status)}`}>
                                        <span>{order.status}</span>
                                    </div>
                                </td>
                                <td className="py-4 px-4">
                                    {order.status === 'Paid' && (
                                        <button
                                            onClick={() => updateOrderStatus(order._id, 'Delivered')}
                                            className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg text-sm transition-colors"
                                        >
                                            Mark Delivered
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredOrders.length === 0 && (
                    <div className="text-center py-8 text-gray-400">
                        No orders found matching your search criteria
                    </div>
                )}
            </div>
        </div>
    );
};

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white">
            Apoorv Merchandise Dashboard
          </h1>
          <p className="text-gray-400 mt-2">
            Real-time merchandise analytics and management
          </p>
        </div>

        <div className="flex gap-4 mb-8">
          <button
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === "analytics"
                ? "bg-white/20 text-white"
                : "bg-white/5 text-gray-400 hover:bg-white/10"
            }`}
            onClick={() => setActiveTab("analytics")}
          >
            Analytics
          </button>
          <button
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === "orders"
                ? "bg-white/20 text-white"
                : "bg-white/5 text-gray-400 hover:bg-white/10"
            }`}
            onClick={() => setActiveTab("orders")}
          >
            Orders
          </button>
        </div>

        {activeTab === "analytics" ? <AnalyticsTab /> : <OrdersTab />}
      </div>
    </div>
  );
};

export default AdminLayout;
