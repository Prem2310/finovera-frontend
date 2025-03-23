import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

export default function PieChartComponent({ holdings }) {
  if (!holdings || holdings.length === 0) {
    return (
      <div className="h-[300px] w-full flex items-center justify-center text-gray-500">
        <div className="text-center">
          <p className="font-medium">No allocation data available</p>
          <p className="text-sm">
            Connect your account to view portfolio allocation
          </p>
        </div>
      </div>
    );
  }
  // Transform data for the chart
  const chartData = holdings?.map((holding) => ({
    name: holding.tradingsymbol,
    value: holding.quantity * holding.ltp,
  }));

  // Calculate total value for percentage calculation
  const totalValue = chartData?.reduce((sum, item) => sum + item.value, 0);

  // Colors for the pie chart segments
  const COLORS = ["#3b82f6", "#10b981", "#6366f1", "#f59e0b", "#ef4444"];

  // Custom tooltip component
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const percentage = ((data.value / totalValue) * 100).toFixed(2);

      return (
        <div className="bg-white p-3 border border-gray-200 shadow-md rounded-md">
          <div className="font-medium">{data.name}</div>
          <div>₹{data.value.toLocaleString()}</div>
          <div>{percentage}% of portfolio</div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-[230px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData?.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
      <div className="mt-4 flex flex-wrap justify-center gap-4">
        {chartData?.map((entry, index) => (
          <div key={`legend-${index}`} className="flex items-center">
            <div
              className="mr-2 h-3 w-3 rounded-sm"
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
            />
            <span className="text-sm">{entry.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
