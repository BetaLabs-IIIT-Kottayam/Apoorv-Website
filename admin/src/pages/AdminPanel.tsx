import {
  Check,
  Clock,
  Edit,
  Package,
  Plus,
  Save,
  Shirt,
  ShoppingBag,
  Trash,
  TrendingUp,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { axiosInstance } from "../api";

const AdminLayout = () => {
  const [activeTab, setActiveTab] = useState("analytics");
  const [orders, setOrders] = useState([
    {
      id: 1,
      customer: "John Doe",
      items: ["Warrior's Hoodie"],
      total: "₹50",
      status: "not_delivered",
      code: "12345",
    },
    {
      id: 2,
      customer: "Jane Smith",
      items: ["Event T-Shirt", "Bushido Cap"],
      total: "₹40",
      status: "not_delivered",
      code: "67890",
    },
    {
      id: 3,
      customer: "Mike Johnson",
      items: ["Event T-Shirt"],
      total: "₹20",
      status: "delivered",
      code: "11223",
    },
  ]);

  // New state for CMS
  const [merch, setMerch] = useState([
    {
      _id: 1,
      name: "Warrior's Hoodie",
      description: "Comfortable hoodie with warrior design",
      price: 50,
      sizes: [
        { size: "S", stock: 10, available: true },
        { size: "M", stock: 15, available: true },
        { size: "L", stock: 12, available: true },
      ],
      isActive: true,
    },
  ]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [newMerch, setNewMerch] = useState({
    name: "",
    description: "",
    price: 0,
    sizes: [
      { size: "S", stock: 0, available: true },
      { size: "M", stock: 0, available: true },
      { size: "L", stock: 0, available: true },
      { size: "XL", stock: 0, available: true },
      { size: "2XL", stock: 0, available: true },
    ],
    isActive: true,
  });

  const [statusFilter, setStatusFilter] = useState("all");

  const salesData = [
    { day: "Mon", sales: 12, revenue: 600 },
    { day: "Tue", sales: 19, revenue: 950 },
    { day: "Wed", sales: 15, revenue: 750 },
    { day: "Thu", sales: 22, revenue: 1100 },
    { day: "Fri", sales: 30, revenue: 1500 },
    { day: "Sat", sales: 40, revenue: 2000 },
  ];

  const itemData = [
    { name: "Warrior's Hoodie", value: 45, price: 50 },
    { name: "Event T-Shirt", value: 80, price: 20 },
    { name: "Bushido Cap", value: 30, price: 20 },
  ];

  const sizeData = [
    { name: "XS", value: 30 },
    { name: "S", value: 30 },
    { name: "M", value: 45 },
    { name: "L", value: 35 },
    { name: "XL", value: 25 },
    { name: "XXL", value: 15 },
  ];

  const orderStatus = [
    { name: "Not Delivered", value: 60 },
    { name: "Delivered", value: 40 },
  ];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

  // CMS functions
  const handleAddMerch = (e: React.FormEvent) => {
    e.preventDefault();
    setMerch([...merch, { ...newMerch, _id: merch.length + 1 }]);
    setNewMerch({
      name: "",
      description: "",
      price: 0,
      sizes: [
        { size: "XS", stock: 0, available: true },
        { size: "S", stock: 0, available: true },
        { size: "M", stock: 0, available: true },
        { size: "L", stock: 0, available: true },
        { size: "XL", stock: 0, available: true },
        { size: "2XL", stock: 0, available: true },
      ],
      isActive: true,
    });
  };

  const handleDelete = (id: number) => {
    setMerch(merch.filter((item) => item._id !== id));
  };

  const handleEdit = (id: number) => {
    const itemToEdit = merch.find((item) => item._id === id);
    setEditingId(id);
    setNewMerch(itemToEdit);
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    setMerch(
      merch.map((item) =>
        item._id === editingId ? { ...newMerch, _id: editingId } : item
      )
    );
    setEditingId(null);
    setNewMerch({
      name: "",
      description: "",
      price: 0,
      sizes: [
        { size: "S", stock: 0, available: true },
        { size: "M", stock: 0, available: true },
        { size: "L", stock: 0, available: true },
        { size: "XL", stock: 0, available: true },
        { size: "2XL", stock: 0, available: true },
      ],
      isActive: true,
    });
  };

  const markAsDelivered = (orderId: number) => {
    setOrders(
      orders.map((order) =>
        order.id === orderId ? { ...order, status: "delivered" } : order
      )
    );
  };

  const getStatusColor = (status: string) => {
    return status === "delivered" ? "text-green-500" : "text-yellow-500";
  };

  const getStatusIcon = (status: string) => {
    return status === "delivered" ? Check : Clock;
  };

  const filteredOrders = orders?.filter((order) =>
    statusFilter === "all" ? true : order.status === statusFilter
  );

  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    itemsSold: 0,
    dailyAverage: 0,
    uniqueCustomers: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axiosInstance.get("/order/stats");
        console.log("Raw Response:", response); // Logs full response
        console.log("Data:", response.data); // Logs extracted data
        setStats(response.data);
      } catch (error) {
        console.error("Error fetching stats:", error);
        if (error) {
          console.error("Response Data:", error);
        }
      }
    };
    fetchStats();
  }, []);  

  const statCards = [
    {
      title: "Total Orders",
      value: stats.totalOrders,
      icon: Package,
      color: "bg-blue-500",
    },
    {
      title: "Total Revenue",
      value: `₹${stats.totalRevenue}`,
      icon: ShoppingBag,
      color: "bg-green-500",
    },
    {
      title: "Items Sold",
      value: stats.itemsSold,
      icon: Shirt,
      color: "bg-purple-500",
    },
    {
      title: "Daily Average",
      value: `₹${stats.dailyAverage.toFixed(2)}`,
      icon: TrendingUp,
      color: "bg-yellow-500",
    },
    {
      title: "Unique Customers",
      value: stats.uniqueCustomers,
      icon: Users,
      color: "bg-red-500",
    },
  ];

  const AnalyticsTab = () => (
    <>
      {/* Quick Stats */}
      {/* <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-8">
        {[
          {
            title: "Total Orders",
            value: "150",
            icon: Package,
            color: "bg-blue-500",
          },
          {
            title: "Total Revenue",
            value: "₹7,500",
            icon: ShoppingBag,
            color: "bg-green-500",
          },
          {
            title: "Items Sold",
            value: "155",
            icon: Shirt,
            color: "bg-purple-500",
          },
          {
            title: "Daily Average",
            value: "₹1,250",
            icon: TrendingUp,
            color: "bg-yellow-500",
          },
          {
            title: "Unique Customers",
            value: "145",
            icon: Users,
            color: "bg-red-500",
          },
        ].map((stat, i) => (
          <div
            key={i}
            className="bg-white/5 rounded-lg border border-white/10 p-6"
          >
            <div className="flex items-center">
              <div className={`p-3 rounded-full ${stat.color}`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-gray-400 text-sm">{stat.title}</p>
                <p className="text-white text-2xl font-bold">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div> */}

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-8">
        {statCards.map((stat, i) => (
          <div
            key={i}
            className="bg-white/5 rounded-lg border border-white/10 p-6"
          >
            <div className="flex items-center">
              <div className={`p-3 rounded-full ${stat.color}`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-gray-400 text-sm">{stat.title}</p>
                <p className="text-white text-2xl font-bold">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white/5 rounded-lg border border-white/10 p-6">
          <h2 className="text-xl font-bold text-white mb-4">Sales Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="day" stroke="#666" />
              <YAxis stroke="#666" />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="sales" stroke="#8884d8" />
              <Line type="monotone" dataKey="revenue" stroke="#82ca9d" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white/5 rounded-lg border border-white/10 p-6">
          <h2 className="text-xl font-bold text-white mb-4">
            Items Distribution
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={itemData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="name" stroke="#666" />
              <YAxis stroke="#666" />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white/5 rounded-lg border border-white/10 p-6">
          <h2 className="text-xl font-bold text-white mb-4">
            Size Distribution
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={sizeData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {sizeData.map((_, index) => (
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

  const OrdersTab = () => (
    <div className="bg-white/5 rounded-lg border border-white/10 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-white">Orders Management</h2>
        <div className="flex gap-4">
          <select
            className="bg-white/10 text-white rounded-lg px-4 py-2"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Orders</option>
            <option value="not_delivered">Not Delivered</option>
            <option value="delivered">Delivered</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-gray-400 border-b border-white/10">
              <th className="py-3 px-4 text-left">Order ID</th>
              <th className="py-3 px-4 text-left">Customer</th>
              <th className="py-3 px-4 text-left">Items</th>
              <th className="py-3 px-4 text-left">Total</th>
              <th className="py-3 px-4 text-left">Verification Code</th>
              <th className="py-3 px-4 text-left">Status</th>
              <th className="py-3 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => {
              const StatusIcon = getStatusIcon(order.status);
              const displayStatus =
                order.status === "not_delivered"
                  ? "Not Delivered"
                  : "Delivered";
              return (
                <tr key={order.id} className="border-b border-white/10">
                  <td className="py-4 px-4 text-white">{order.id}</td>
                  <td className="py-4 px-4 text-white">{order.customer}</td>
                  <td className="py-4 px-4 text-white">
                    {order.items.join(", ")}
                  </td>
                  <td className="py-4 px-4 text-white">{order.total}</td>
                  <td className="py-4 px-4 text-white">{order.code}</td>
                  <td className="py-4 px-4">
                    <div
                      className={`flex items-center gap-2 ${getStatusColor(
                        order.status
                      )}`}
                    >
                      <StatusIcon className="w-4 h-4" />
                      <span>{displayStatus}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    {order.status === "not_delivered" && (
                      <button
                        onClick={() => markAsDelivered(order.id)}
                        className="bg-green-500 text-white px-3 py-1 rounded-lg text-sm"
                      >
                        Mark Delivered
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );

  // New CMS Tab
  const MerchTab = () => (
    <div className="space-y-6">
      <div className="bg-white/5 rounded-lg border border-white/10 p-6">
        <h2 className="text-xl font-bold text-white mb-4">
          {editingId ? "Edit Merchandise" : "Add New Merchandise"}
        </h2>
        <form
          onSubmit={editingId ? handleUpdate : handleAddMerch}
          className="space-y-4"
        >
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Name"
              className="bg-white/10 text-white rounded p-2"
              value={newMerch.name}
              onChange={(e) =>
                setNewMerch({ ...newMerch, name: e.target.value })
              }
            />
            <input
              type="number"
              placeholder="Price"
              className="bg-white/10 text-white rounded p-2"
              value={newMerch.price}
              onChange={(e) =>
                setNewMerch({ ...newMerch, price: Number(e.target.value) })
              }
            />
          </div>
          <textarea
            placeholder="Description"
            className="w-full bg-white/10 text-white rounded p-2"
            value={newMerch.description}
            onChange={(e) =>
              setNewMerch({ ...newMerch, description: e.target.value })
            }
          />
          <div className="grid grid-cols-5 gap-4">
            {newMerch.sizes.map((size, index) => (
              <div key={size.size} className="space-y-2">
                <label className="text-white">{size.size}</label>
                <input
                  type="number"
                  placeholder="Stock"
                  className="w-full bg-white/10 text-white rounded p-2"
                  value={size.stock}
                  onChange={(e) => {
                    const updatedSizes = [...newMerch.sizes];
                    updatedSizes[index].stock = Number(e.target.value);
                    setNewMerch({ ...newMerch, sizes: updatedSizes });
                  }}
                />
              </div>
            ))}
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded flex items-center gap-2"
          >
            {editingId ? (
              <Save className="w-4 h-4" />
            ) : (
              <Plus className="w-4 h-4" />
            )}
            {editingId ? "Update Merchandise" : "Add Merchandise"}
          </button>
        </form>
      </div>

      <div className="bg-white/5 rounded-lg border border-white/10 p-6">
        <h2 className="text-xl font-bold text-white mb-4">
          Manage Merchandise
        </h2>
        <div className="space-y-4">
          {merch.map((item) => (
            <div
              key={item._id}
              className="flex items-center justify-between p-4 bg-white/10 rounded"
            >
              <div>
                <h3 className="text-white font-bold">{item.name}</h3>
                <p className="text-gray-400">₹{item.price}</p>
                <p className="text-gray-400 text-sm">{item.description}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(item._id)}
                  className="p-2 bg-yellow-500 rounded"
                >
                  <Edit className="w-4 h-4 text-white" />
                </button>
                <button
                  onClick={() => handleDelete(item._id)}
                  className="p-2 bg-red-500 rounded"
                >
                  <Trash className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

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

        {/* Updated Tabs */}
        <div className="flex gap-4 mb-8">
          <button
            className={`px-4 py-2 rounded-lg ${
              activeTab === "analytics"
                ? "bg-white/20 text-white"
                : "bg-white/5 text-gray-400"
            }`}
            onClick={() => setActiveTab("analytics")}
          >
            Analytics
          </button>
          <button
            className={`px-4 py-2 rounded-lg ${
              activeTab === "orders"
                ? "bg-white/20 text-white"
                : "bg-white/5 text-gray-400"
            }`}
            onClick={() => setActiveTab("orders")}
          >
            Orders
          </button>
          <button
            className={`px-4 py-2 rounded-lg ${
              activeTab === "merchandise"
                ? "bg-white/20 text-white"
                : "bg-white/5 text-gray-400"
            }`}
            onClick={() => setActiveTab("merchandise")}
          >
            Manage Merchandise
          </button>
        </div>

        {/* Updated Tab Content */}
        {activeTab === "analytics" ? (
          <AnalyticsTab />
        ) : activeTab === "orders" ? (
          <OrdersTab />
        ) : (
          <MerchTab />
        )}
      </div>
    </div>
  );
};

export default AdminLayout;
