import { HiOutlineSparkles } from "react-icons/hi2";
import OrderTypeChip from "./OrderTypeChip";
import { useGetLLMMutation } from "../../hooks/mutations/useGetLLMMutation";
import { useState } from "react";

function RecommendedStockCard({
  stockName,
  stockSymbol,
  sector,
  price,
  currency = "₹",
  percentageChange,
  trend = "up",
  recommendation = "BUY",
  showOptions = true,
  exchange = "NSE", // Default exchange; adjust or make dynamic
}) {
  const [summaryData, setSummaryData] = useState(null);
  const { mutate: llmMutation, isLoading } = useGetLLMMutation();
  const { mutateAsync: llmMutateAsync } = useGetLLMMutation();

  const handleSummarize = () => {
    const accessToken = localStorage.getItem("access_token");
    const requestData = {
      access_token: accessToken,
    };
    llmMutation(requestData, {
      onSuccess: (data) => {
        console.log("LLM summary data:", data);
        setSummaryData(data);
      },
    });
  };

  const handleSummarizeAsync = async () => {
    try {
      const access_token = localStorage.getItem("access_token");
      const requestData = {
        access_token: access_token,
      };
      const data = await llmMutateAsync(requestData);
      console.log("LLM summary data:", data);
      setSummaryData(data);
    } catch (error) {
      console.error("Error getting summary:", error);
    }
  };

  const getInitials = (name) => {
    if (!name) return "";
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase();
  };

  // Construct TradingView URL
  const tradingViewUrl = `https://www.tradingview.com/symbols/${exchange}-${stockSymbol}/`; // Fallback if no symbol

  return (
    <a
      href={tradingViewUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="block border border-slate-300 bg-white rounded-md shadow-sm p-4 pb-2 w-64 hover:shadow-md transition-shadow"
    >
      <div className="flex items-center gap-2 justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold text-indigo-600 p-2 border border-slate-300 rounded-md inline-block">
            {getInitials(stockName)}
          </span>
          <div>
            <p className="font-medium tracking-tight text-slate-800">
              {stockSymbol}
            </p>
            <p className="text-xs text-slate-500">{stockName}</p>
          </div>
        </div>
        <OrderTypeChip type={recommendation} />
      </div>
      <div>
        <div className="flex justify-between items-center">
          {sector && (
            <div className="text-sm text-gray-700 mt-1">
              <span className="font-medium"></span> {sector}
            </div>
          )}
          <p className="text-lg font-semibold tracking-tight">
            <span className="text-slate-400 font-medium">{currency}</span>{" "}
            {price}
          </p>
        </div>
        {percentageChange && (
          <p className="text-xs text-slate-400 font-medium mt-2">
            <span
              className={`${
                trend === "up"
                  ? "text-emerald-600 bg-emerald-50"
                  : "text-red-600 bg-red-50"
              } p-1 rounded mr-0.5`}
            >
              {trend === "up" ? "+" : "-"}
              {percentageChange}%
            </span>
            today
          </p>
        )}
      </div>
    </a>
  );
}

export default RecommendedStockCard;
