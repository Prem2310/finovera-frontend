import { HiOutlineSparkles } from "react-icons/hi2";
import OrderTypeChip from "./OrderTypeChip";
import { useGetLLMMutation } from "../../hooks/mutations/useGetLLMMutation";
import { useState } from "react";

function RecommendedStockCard({
  stockName,
  stockSymbol,
  price,
  currency = "₹",
  percentageChange,
  trend = "up",
  recommendation = "BUY",
  showOptions = true,
}) {
  const [summaryData, setSummaryData] = useState(null);
  const { mutate: llmMutation, isLoading } = useGetLLMMutation();
  const { mutateAsync: llmMutateAsync } = useGetLLMMutation();

  const handleSummarize = () => {
    const accessToken = localStorage.getItem("access_token");

    // Use stockSymbol or relevant data to get a summary
    const requestData = {
      access_token: accessToken,
      // Add any other data needed for the summarization
    };

    llmMutation(requestData, {
      onSuccess: (data) => {
        console.log("LLM summary data:", data);
        setSummaryData(data);
        // You can now use this data in your component
      },
    });
  };

  // Alternative async function approach
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

  return (
    <div className="border border-slate-300 bg-white rounded-md shadow-sm p-4 w-64">
      <div className="flex items-center gap-2 justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold text-indigo-600 p-2 border border-slate-300 rounded-md inline-block">
            {getInitials(stockName)}
          </span>
          <div>
            <p className="font-medium tracking-tight text-slate-800">
              {stockName}
            </p>
            <p className="text-xs text-slate-500">{stockSymbol}</p>
          </div>
        </div>
        {showOptions && (
          <div
            className="border border-slate-300 rounded-md p-1"
            onClick={handleSummarize} // Use handleSummarizeAsync if you prefer that approach
            title="Get AI insights about this stock"
          >
            <HiOutlineSparkles
              className={`cursor-pointer ${
                isLoading ? "text-indigo-400 animate-pulse" : "text-slate-600"
              } text-lg`}
            />
          </div>
        )}
      </div>
      <div className="flex flex-col">
        <div className="flex justify-between items-center">
          <p className="text-lg font-semibold tracking-tight">
            <span className="text-slate-400 font-medium">{currency}</span>{" "}
            {price}
          </p>
          <OrderTypeChip type={recommendation} />
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

        {/* Show summary data if available */}
        {summaryData && (
          <div className="mt-3 pt-2 border-t border-slate-200 text-xs text-slate-700">
            <p className="font-medium mb-1">AI Insights:</p>
            <p>{summaryData.summary || "No insights available"}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default RecommendedStockCard;
