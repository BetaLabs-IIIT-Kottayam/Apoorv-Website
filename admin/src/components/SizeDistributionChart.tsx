/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MatrixData, MerchandiseAnalyticsProps, SizeChartData } from "@/types";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from "recharts";

const MerchandiseAnalytics: React.FC<MerchandiseAnalyticsProps> = ({ data }) => {
  const COLORS = ["#FF4842", "#00A76F", "#3366FF", "#FFB020", "#8884d8"];

  const sizeData: SizeChartData[] = useMemo(() => {
    const sizes: { [key: string]: number } = {};
    data.merchSalesSummary.forEach(merch => {
      merch.colors.forEach(color => {
        color.sizes.forEach(size => {
          const key = `Size ${size.size}`;
          sizes[key] = (sizes[key] || 0) + size.quantity;
        });
      });
    });
    return Object.entries(sizes).map(([name, value]) => ({ name, value }));
  }, [data.merchSalesSummary]);

  const matrixData: MatrixData[] = useMemo(() => {
    return data.merchSalesSummary.flatMap(merch => 
      merch.colors.map(color => {
        const sizeQuantities: { [key: string]: number } = {};
        color.sizes.forEach(size => {
          sizeQuantities[`Size ${size.size}`] = size.quantity;
        });
        return {
          merchName: merch.merchName,
          color: color.color,
          ...sizeQuantities,
          total: color.totalQuantity
        };
      })
    );
  }, [data.merchSalesSummary]);

  const itemsData = useMemo(() => 
    data.merchSalesSummary.map(item => ({
      name: item.merchName,
      quantity: item.totalQuantity,
      revenue: item.totalRevenue
    }))
  , [data.merchSalesSummary]);

  const uniqueSizes = useMemo(() => 
    Array.from(new Set(sizeData.map(s => s.name))).sort()
  , [sizeData]);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-black/90 p-2 rounded border border-white/20">
          <p className="text-white">{`${payload[0].name}: ${payload[0].value} units`}</p>
          {payload[0].payload.revenue && (
            <p className="text-white">{`Revenue: ₹${payload[0].payload.revenue}`}</p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="bg-black">
        <CardHeader>
          <CardTitle>Size Distribution</CardTitle>
        </CardHeader>
        <CardContent className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={sizeData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={({ name, value }) => `${name}: ${value}`}
              >
                {sizeData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="bg-black">
        <CardHeader>
          <CardTitle>Items Distribution</CardTitle>
        </CardHeader>
        <CardContent className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={itemsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="name" stroke="#666" />
              <YAxis stroke="#666" />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="quantity" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="md:col-span-2 bg-black text-white">
        <CardHeader>
          <CardTitle>Size-Color Matrix</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="text-left p-2 text-white">Product</th>
                  <th className="text-left p-2 text-white">Color</th>
                  {uniqueSizes.map(size => (
                    <th key={size} className="text-left p-2 text-white">{size}</th>
                  ))}
                  <th className="text-left p-2 text-white">Total</th>
                </tr>
              </thead>
              <tbody>
                {matrixData.map((row, idx) => (
                  <tr key={`${row.merchName}-${row.color}-${idx}`} className="border-t border-white/10">
                    <td className="p-2">{row.merchName}</td>
                    <td className="p-2">{row.color}</td>
                    {uniqueSizes.map(size => (
                      <td key={`${row.merchName}-${row.color}-${size}`} className="p-2">
                        {(row[size] as number) || 0}
                      </td>
                    ))}
                    <td className="p-2">{row.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MerchandiseAnalytics;