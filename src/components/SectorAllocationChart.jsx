import React, { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
  Sector,
} from "recharts";

const SectorAllocationChart = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const [capData, setCapData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Sample portfolio data from your JSON
  const portfolioData = {
    status: true,
    message: "SUCCESS",
    data: {
      holdings: [
        {
          tradingsymbol: "RELIANCE-EQ",
          exchange: "NSE",
          isin: "INE002A01018",
          quantity: 70,
          averageprice: 1511.63,
          ltp: 1276.35,
          profitandloss: -16470.0,
          pnlpercentage: -15.56,
        },
        {
          tradingsymbol: "HUDCO-EQ",
          exchange: "NSE",
          isin: "INE031A01017",
          quantity: 108,
          averageprice: 289.72,
          ltp: 202.8,
          profitandloss: -9387.0,
          pnlpercentage: -30.0,
        },
        {
          tradingsymbol: "NYKAA-EQ",
          exchange: "NSE",
          isin: "INE388Y01029",
          quantity: 540,
          averageprice: 203.36,
          ltp: 172.52,
          profitandloss: -16651.0,
          pnlpercentage: -15.16,
        },
        {
          tradingsymbol: "JIOFIN-EQ",
          exchange: "NSE",
          isin: "INE758E01017",
          quantity: 99,
          averageprice: 329.48,
          ltp: 229.12,
          profitandloss: -9935.0,
          pnlpercentage: -30.46,
        },
      ],
    },
  };

  // Market cap classification - in a real app, this would come from an API
  // or be stored in your database
  const marketCapMap = {
    "RELIANCE-EQ": "Large Cap",
    "HUDCO-EQ": "Small Cap",
    "NYKAA-EQ": "Mid Cap",
    "JIOFIN-EQ": "Mid Cap",
  };

  useEffect(() => {
    // Process the data to group by market cap
    processMarketCapData();
  }, []);

  const processMarketCapData = () => {
    setIsLoading(true);

    // Calculate total portfolio value
    const holdings = portfolioData.data.holdings;
    const totalValue = holdings.reduce(
      (sum, stock) => sum + stock.ltp * stock.quantity,
      0
    );

    // Calculate value by market cap
    const capValues = {
      "Large Cap": 0,
      "Mid Cap": 0,
      "Small Cap": 0,
    };

    holdings.forEach((stock) => {
      const capCategory = marketCapMap[stock.tradingsymbol] || "Unknown";
      const stockValue = stock.ltp * stock.quantity;

      if (capCategory in capValues) {
        capValues[capCategory] += stockValue;
      }
    });

    // Convert to percentage and format for pie chart
    const capDataArray = Object.keys(capValues)
      .map((cap) => {
        const value = capValues[cap];
        return {
          name: cap,
          value: Math.round((value / totalValue) * 100),
          actualValue: value,
          color:
            cap === "Large Cap"
              ? "#0088FE"
              : cap === "Mid Cap"
              ? "#00C49F"
              : "#FFBB28",
        };
      })
      .filter((item) => item.value > 0); // Remove categories with 0%

    setCapData(capDataArray);
    setIsLoading(false);
  };

  const onPieEnter = (_, index) => {
    setActiveIndex(index);
  };

  const onPieLeave = () => {
    setActiveIndex(null);
  };

  const renderActiveShape = (props) => {
    const {
      cx,
      cy,
      midAngle,
      innerRadius,
      outerRadius,
      startAngle,
      endAngle,
      fill,
      payload,
      percent,
      value,
    } = props;

    return (
      <g>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius + 10}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        <text x={cx} y={cy} dy={-20} textAnchor="middle" fill="#333">
          {payload.name}
        </text>
        <text x={cx} y={cy} dy={8} textAnchor="middle" fill="#333">
          {`${value}%`}
        </text>
        <text x={cx} y={cy} dy={32} textAnchor="middle" fill="#999">
          {`₹${Math.round(payload.actualValue).toLocaleString()}`}
        </text>
      </g>
    );
  };

  if (isLoading) {
    return (
      <div className="w-full h-96 p-4 bg-white rounded-lg shadow flex items-center justify-center">
        <p>Processing data...</p>
      </div>
    );
  }

  return (
    <div className="w-full h-96 p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4 text-center">
        Stock Market Cap Allocation
      </h2>
      <div className="text-sm text-center mb-2 text-gray-600">
        Breakdown of stock investments by company size
      </div>
      <ResponsiveContainer width="100%" height="80%">
        <PieChart>
          <Pie
            activeIndex={activeIndex}
            activeShape={renderActiveShape}
            data={capData}
            cx="50%"
            cy="50%"
            innerRadius={70}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
            onMouseEnter={onPieEnter}
            onMouseLeave={onPieLeave}
          >
            {capData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value, name, props) => {
              if (name === "value") {
                return [`${value}%`, "Allocation"];
              }
              return [value, name];
            }}
          />
          <Legend
            verticalAlign="bottom"
            height={36}
            formatter={(value) => {
              const item = capData.find((d) => d.name === value);
              return `${value} (${item ? item.value : 0}%)`;
            }}
          />
        </PieChart>
      </ResponsiveContainer>

      <div className="mt-2 text-xs text-gray-500">
        <div className="font-semibold">Stock Classification:</div>
        <ul className="list-disc pl-5 mt-1 grid grid-cols-2">
          {portfolioData.data.holdings.map((stock) => (
            <li key={stock.tradingsymbol}>
              {stock.tradingsymbol.replace("-EQ", "")}:{" "}
              {marketCapMap[stock.tradingsymbol]}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SectorAllocationChart;
