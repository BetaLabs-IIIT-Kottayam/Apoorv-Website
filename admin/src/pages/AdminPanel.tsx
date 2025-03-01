import {
  fetchDashboardStats,
  formatCurrency,
  formatDate,
  getStatusColor,
  useOrders,
} from "@/api";
import SizeDistributionChart from "@/components/SizeDistributionChart";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { DashboardStats } from "@/types";
import axios from "axios";
import { ChevronFirstIcon, ChevronLastIcon, ChevronLeftIcon, ChevronRightIcon, Loader, Loader2, Mail, Package, Search, ShoppingBag } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import MerchManagement from "./MerchManager";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const AdminLayout = () => {
  const [activeTab, setActiveTab] = useState("analytics");
  const [data, setData] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

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

      {data && <SizeDistributionChart data={data} />}
    </>
  );

  const OrdersTab = () => {
    const { orders, isLoading, updateOrderStatus, fetchOrders, page, totalPages, totalOrders } = useOrders();
    const [searchField, setSearchField] = useState<
      "secretCode" | "firstName" | "email"
    >("secretCode");
    const [searchQuery, setSearchQuery] = useState("");
    const [isResendDialogOpen, setIsResendDialogOpen] = useState(false);
    const [isResending, setIsResending] = useState(false);
    const [currentOrderId, setCurrentOrderId] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState("");
    const [error, setError] = useState<string | null>(null);
  
    const filteredOrders = orders.filter((order) => {
      if (searchQuery === "") return true;
      
      switch (searchField) {
        case "secretCode":
          return order.secretCode.toLowerCase().includes(searchQuery.toLowerCase());
        case "firstName":
          return order.buyerDetails.firstName.toLowerCase().includes(searchQuery.toLowerCase());
        case "email":
          return order.buyerDetails.email.toLowerCase().includes(searchQuery.toLowerCase());
        default:
          return true;
      }
    });
  
    const handleResendInvoice = (id: string) => {
      setCurrentOrderId(id);
      setIsResendDialogOpen(true);
      // Clear any previous error when opening the dialog
      setError(null);
    };
  
    const confirmResendInvoice = async () => {
      if (!currentOrderId) return;
  
      try {
        const token = localStorage.getItem("token");
        setIsResending(true);
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/order/resend-invoice`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify({ id: currentOrderId }),
        });
  
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.msg || "Failed to resend invoice");
        }
  
        const data = await response.json();
  
        if (data.success) {
          setSuccessMessage("Invoice resent successfully!");
          setIsResendDialogOpen(false);
          
          // Clear success message after 3 seconds
          setTimeout(() => {
            setSuccessMessage("");
          }, 3000);
        }
      } catch (err) {
        console.error("Error resending invoice:", err);
        setError(err instanceof Error ? err.message : "Failed to resend invoice");
      } finally {
        setIsResending(false);
      }
    };
  
    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-40">
          <Loader2 className="w-8 h-8 text-white animate-spin" />
        </div>
      );
    }
  
    return (
      <div className="bg-white/5 rounded-lg border border-white/10 p-6">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <h2 className="text-xl font-bold text-white">Orders Management</h2>
          <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
            <div className="flex gap-2 w-full md:w-auto">
              <select
                className="bg-black text-white rounded-lg px-4 py-2"
                value={searchField}
                onChange={(e) =>
                  setSearchField(e.target.value as typeof searchField)
                }
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
          </div>
        </div>
  
        {successMessage && (
          <div className="bg-green-500/20 border border-green-500 text-green-500 px-4 py-2 rounded mb-4">
            {successMessage}
          </div>
        )}
  
        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-500 px-4 py-2 rounded mb-4">
            {error}
          </div>
        )}
  
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
              {filteredOrders.length === 0 ? (
                <tr>
                  <td
                    colSpan={9}
                    className="py-8 px-4 text-center text-gray-400"
                  >
                    No orders found matching your search criteria
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr
                    key={order._id}
                    className="hover:bg-gray-800/50 transition-colors border-b border-white/5"
                  >
                    <td className="px-4 py-3 text-sm text-white">{order._id}</td>
                    <td className="px-4 py-3 text-sm text-white">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="px-4 py-3 text-sm text-white">
                      {`${order.buyerDetails.firstName} ${order.buyerDetails.lastName}`}
                    </td>
                    <td className="px-4 py-3 text-sm text-white">
                      {order.buyerDetails.email}
                    </td>
                    <td className="px-4 py-3 text-sm text-white">
                      {order.items.map((item, idx) => (
                        <div key={idx}>
                          {`${item.merchId?.name} (${item.color} - ${item.size}) x${item.quantity}`}
                        </div>
                      ))}
                    </td>
                    <td className="px-4 py-3 text-sm text-white">
                      {formatCurrency(order.totalAmount)}
                    </td>
                    <td className="px-4 py-3 text-sm text-white font-mono">
                      {order.secretCode}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleResendInvoice(order._id)}
                        disabled={isResending && currentOrderId === order._id}
                        className="text-white hover:text-blue-400"
                        title="Resend Invoice"
                      >
                        <Mail className="w-4 h-4" />
                      </Button>
  
                      {order.status === "Paid" && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              size="sm"
                              className="bg-green-500 hover:bg-green-600 text-white transition-colors"
                            >
                              Mark Delivered
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Confirm Status Update
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Do you really want to mark this order as
                                Delivered?
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() =>
                                  updateOrderStatus(order._id, "Delivered")
                                }
                              >
                                Confirm
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
  
        <div className="mt-4 flex justify-between items-center">
          <div className="text-sm text-gray-400">
            {searchQuery ? (
              `Showing ${filteredOrders.length} filtered orders`
            ) : (
              `Showing ${orders.length} of ${totalOrders} orders`
            )}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchOrders(1)}
              disabled={page === 1}
            >
              <ChevronFirstIcon className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchOrders(page - 1)}
              disabled={page === 1}
            >
              <ChevronLeftIcon className="w-4 h-4" />
            </Button>
            <span className="text-white px-3 py-1">
              Page {page} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchOrders(page + 1)}
              disabled={page === totalPages}
            >
              <ChevronRightIcon className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchOrders(totalPages)}
              disabled={page === totalPages}
            >
              <ChevronLastIcon className="w-4 h-4" />
            </Button>
          </div>
        </div>
  
        <Dialog open={isResendDialogOpen} onOpenChange={setIsResendDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Resend Invoice</DialogTitle>
              <DialogDescription>
                Resend the invoice to the customer's email?
              </DialogDescription>
            </DialogHeader>
            {error && (
              <div className="bg-red-500/20 border border-red-500 text-red-500 px-4 py-2 rounded mb-4">
                {error}
              </div>
            )}
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsResendDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="default"
                onClick={confirmResendInvoice}
                disabled={isResending}
              >
                {isResending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Resend"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    );
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");

      // Send logout request to backend
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/auth/logout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Clear token and redirect to login
      localStorage.removeItem("token");
      navigate("/login");
    } catch (err) {
      console.error(err);
      // Even if logout fails, clear token and redirect
      // console.log(err);
      localStorage.removeItem("token");
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white">
              Apoorv Merchandise Dashboard
            </h1>
            <p className="text-gray-400 mt-2">
              Real-time merchandise analytics and management
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Logout
          </button>
        </div>

        <div className="flex gap-4 mb-8">
          <button
            className={`px-4 py-2 rounded-lg transition-colors ${activeTab === "analytics"
                ? "bg-white/20 text-white"
                : "bg-white/5 text-gray-400 hover:bg-white/10"
              }`}
            onClick={() => setActiveTab("analytics")}
          >
            Analytics
          </button>
          <button
            className={`px-4 py-2 rounded-lg transition-colors ${activeTab === "orders"
                ? "bg-white/20 text-white"
                : "bg-white/5 text-gray-400 hover:bg-white/10"
              }`}
            onClick={() => setActiveTab("orders")}
          >
            Orders
          </button>
          <button
            className={`px-4 py-2 rounded-lg transition-colors ${activeTab === "merch"
                ? "bg-white/20 text-white"
                : "bg-white/5 text-gray-400 hover:bg-white/10"
              }`}
            onClick={() => setActiveTab("merch")}
          >
            Merch Management
          </button>
        </div>

        <div className="bg-white/5 p-4 rounded-lg">
          {activeTab === "analytics" && <AnalyticsTab />}
          {activeTab === "orders" && <OrdersTab />}
          {activeTab === "merch" && <MerchManagement />}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
