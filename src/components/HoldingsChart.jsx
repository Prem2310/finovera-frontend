import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export default function HoldingsChart({ holdings }) {
   if (!holdings || holdings.length === 0) {
     return (
       <div className="h-[300px] w-full flex items-center justify-center text-gray-500">
         <div className="text-center">
           <p className="font-medium">No holdings data available</p>
           <p className="text-sm">Connect your account to view P&L chart</p>
         </div>
       </div>
     );
   }
  // Transform data for the chart
  const chartData = holdings?.map((holding) => ({
    name: holding.tradingsymbol,
    value: holding.profitandloss,
    percentage: holding.pnlpercentage,
  }));

  // Custom tooltip component
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 shadow-md rounded-md">
          <div className="font-medium">{data.name}</div>
          <div className={data.value >= 0 ? "text-green-500" : "text-red-500"}>
            P&L: ₹{data?.value.toLocaleString()}
          </div>
          <div
            className={data.percentage >= 0 ? "text-green-500" : "text-red-500"}
          >
            {data?.percentage}%
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="name"
            angle={-45}
            textAnchor="end"
            height={60}
            tick={{ fontSize: 12 }}
          />
          <YAxis
            tickFormatter={(value) => `₹${value.toLocaleString()}`}
            tick={{ fontSize: 12 }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="value" radius={[4, 4, 0, 0]}>
            {chartData?.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.value >= 0 ? "#4ade80" : "#f87171"}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
