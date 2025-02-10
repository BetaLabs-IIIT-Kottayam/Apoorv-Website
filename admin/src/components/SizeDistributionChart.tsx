

  // MerchandiseAnalytics.tsx
  import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ColorChartData, MatrixData, MerchandiseAnalyticsProps, SizeChartData } from '@/types';
import React, { useMemo } from 'react';
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
  YAxis
} from 'recharts';
  
  const MerchandiseAnalytics: React.FC<MerchandiseAnalyticsProps> = ({ data }) => {
    const COLORS = ['#FF4842', '#00A76F', '#3366FF', '#FFB020', '#8884d8'];
  
    // Memoized data transformations
    const sizeData: SizeChartData[] = useMemo(() => {
      return data.merchSalesSummary.reduce<SizeChartData[]>((acc, merch) => {
        merch.colors.forEach(color => {
          color.sizes.forEach(size => {
            const existingSize = acc.find(item => item.name === `Size ${size.size}`);
            if (existingSize) {
              existingSize.value += size.quantity;
            } else {
              acc.push({
                name: `Size ${size.size}`,
                value: size.quantity
              });
            }
          });
        });
        return acc;
      }, []);
    }, [data.merchSalesSummary]);
  
    const colorData: ColorChartData[] = useMemo(() => {
      return data.merchSalesSummary.reduce<ColorChartData[]>((acc, merch) => {
        merch.colors.forEach(color => {
          acc.push({
            name: color.color,
            value: color.totalQuantity,
            revenue: color.totalRevenue
          });
        });
        return acc;
      }, []);
    }, [data.merchSalesSummary]);
  
    const matrixData: MatrixData[] = useMemo(() => {
      return data.merchSalesSummary[0].colors.map(color => {
        const sizeQuantities: { [key: string]: number } = {};
        color.sizes.forEach(size => {
          sizeQuantities[`Size ${size.size}`] = size.quantity;
        });
        return {
          color: color.color,
          ...sizeQuantities,
          total: color.totalQuantity
        };
      });
    }, [data.merchSalesSummary]);
  
    // Custom tooltip formatter
    const tooltipFormatter = (value: number, name: string): [string, string] => {
      return [`${value} units`, name];
    };
  
    // Get unique size names for matrix headers
    const uniqueSizes = useMemo(() => 
      Array.from(new Set(sizeData.map(s => s.name))),
      [sizeData]
    );
  
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  
        {/* Size Distribution */}
        <Card className='bg-black'>
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
                  label={({name, value}: SizeChartData) => `${name}: ${value}`}
                >
                  {sizeData.map((_, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={COLORS[index % COLORS.length]} 
                    />
                  ))}
                </Pie>
                <Tooltip formatter={tooltipFormatter} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
  
        {/* Color Distribution */}
        <Card className='bg-black'>
          <CardHeader>
            <CardTitle>Color Distribution</CardTitle>
          </CardHeader>
          <CardContent className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={colorData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar 
                  dataKey="value" 
                  name="Quantity" 
                  fill="#8884d8" 
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
  
        {/* Size-Color Matrix */}
        <Card className="md:col-span-2 bg-black text-white">
          <CardHeader>
            <CardTitle>Size-Color Matrix</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="text-left p-2 text-white">Color</th>
                    {uniqueSizes.map(size => (
                      <th key={size} className="text-left p-2">{size}</th>
                    ))}
                    <th className="text-left p-2">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {matrixData.map((row) => (
                    <tr key={row.color} className="border-t border-white/10">
                      <td className="p-2">{row.color}</td>
                      {uniqueSizes.map(size => (
                        <td key={`${row.color}-${size}`} className="p-2">
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