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

export default function TransactionsChart({ transactions }) {
  console.log(transactions)
  if (!transactions || transactions.length === 0) {
    return (
      <div className="h-[300px] w-full flex items-center justify-center text-gray-500">
        <div className="text-center">
          <p className="font-medium">No transaction data available</p>
          <p className="text-sm">Upload CSV file to view transaction data</p>
        </div>
      </div>
    );
  }

  // Transform data for the chart
  const chartData = transactions.map((transaction) => ({
    name: transaction.stock_name,
    value: transaction.realized_unrealized_pnl,
    percentage: (
      (transaction.realized_unrealized_pnl / transaction.buy_value) *
      100
    ).toFixed(2),
    buyPrice: transaction.buy_price,
    sellPrice: transaction.sell_price,
    quantity: transaction.quantity,
    buyDate: transaction.buy_date,
    sellDate: transaction.sell_date,
  }));

  // Custom tooltip component
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 shadow-md rounded-md">
          <div className="font-medium">{data.name}</div>
          <div className="text-gray-600">
            Buy: ₹{data.buyPrice} x {data.quantity} ({data.buyDate})
          </div>
          <div className="text-gray-600">
            Sell: ₹{data.sellPrice} x {data.quantity} ({data.sellDate})
          </div>
          <div className={data.value >= 0 ? "text-green-500" : "text-red-500"}>
            P&L: ₹{data.value.toLocaleString()}
          </div>
          <div
            className={
              parseFloat(data.percentage) >= 0
                ? "text-green-500"
                : "text-red-500"
            }
          >
            {data.percentage}%
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
            {chartData.map((entry, index) => (
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
