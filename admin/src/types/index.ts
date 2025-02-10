interface MerchSize {
  size: string;
  quantity: number;
  revenue: number;
}

interface MerchColor {
  color: string;
  sizes: MerchSize[];
  totalQuantity: number;
  totalRevenue: number;
}

interface MerchSummary {
  merchName: string;
  colors: MerchColor[];
  totalQuantity: number;
  totalRevenue: number;
}

export interface DashboardStats {
  summary: {
    totalOrders: number;
    totalAmount: number;
  };
  merchSalesSummary: MerchSummary[];
}

// ChartData types
export interface SizeChartData {
  name: string;
  value: number;
}

export interface ColorChartData {
  name: string;
  value: number;
  revenue: number;
}

export interface MatrixData {
  color: string;
  [key: string]: string | number; // For dynamic size columns
  total: number;
}

// Component props type
export interface MerchandiseAnalyticsProps {
  data: DashboardStats;
}
