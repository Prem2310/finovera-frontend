import React from "react";
import {
  HiTrendingDown,
  HiTrendingUp,
  HiExclamationCircle,
  HiChartPie,
  HiCurrencyRupee,
  HiArrowRight,
  HiX,
} from "react-icons/hi";
import { HiArrowsRightLeft, HiMiniChartBar } from "react-icons/hi2";

const PortfolioInsights = ({ insightsData, onClose }) => {
  // Check if data exists with fallback to sample data
  const data = insightsData || {
    total_invested_value: 1034881.47,
    current_value: 7020.0,
    total_profit_loss: -354316.86,
    total_pnl_percentage: -34.24,
    insights_and_recommendations: `## Summary\n\nThe portfolio "user1" has a Total Invested Value of $1,034,881.47, but its Current Value is significantly lower at $7,020.00. This results in a substantial Total Profit/Loss of $-354,316.86, representing a -34.24% decrease in value...`,
  };

  // Parse the markdown content into sections
  const sections = data.insights_and_recommendations
    ?.split("##")
    .filter(Boolean)
    .map((section) => section.trim());

  // Format currency values
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(value);
  };

  // Extract action items from recommendations section
  const getActionItems = () => {
    const recommendationsSection = sections?.find((section) =>
      section.startsWith("Recommendations")
    );
    if (!recommendationsSection) return [];

    // Extract bullet points for "Immediate Actions"
    const immediateActionsMatch = recommendationsSection.match(
      /\*\*1\. Immediate Actions:\*\*([\s\S]*?)(?=\*\*2\.)/
    );

    if (!immediateActionsMatch || !immediateActionsMatch[1]) return [];

    const actionItemsText = immediateActionsMatch[1];
    const actionItems =
      actionItemsText.match(/\*\s+\*\*([^:]+):\*\*([^\*]+)/g) || [];

    return actionItems
      .map((item) => {
        const parts = item.match(/\*\s+\*\*([^:]+):\*\*([^\*]+)/);
        if (parts && parts.length >= 3) {
          return {
            title: parts[1].trim(),
            description: parts[2].trim(),
          };
        }
        return null;
      })
      .filter(Boolean)
      .slice(0, 3); // Limited to first 3 action items
  };

  return (
    <div className="fixed inset-0 bg-white backdrop-blur-md bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center">
            <HiChartPie className="mr-2 text-slate-600" />
            Portfolio Analysis & Insights
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <HiX className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="overflow-y-auto p-6">
          {/* Key Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
              <div className="text-sm text-gray-500 mb-1">Total Invested</div>
              <div className="text-xl font-bold flex items-center">
                <HiCurrencyRupee className="text-gray-400" />
                {formatCurrency(data.total_invested_value).replace("₹", "")}
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
              <div className="text-sm text-gray-500 mb-1">Current Value</div>
              <div className="text-xl font-bold flex items-center">
                <HiCurrencyRupee className="text-gray-400" />
                {formatCurrency(data.current_value).replace("₹", "")}
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
              <div className="text-sm text-gray-500 mb-1">Total P&L</div>
              <div
                className={`text-xl font-bold flex items-center ${
                  data.total_profit_loss < 0 ? "text-red-600" : "text-green-600"
                }`}
              >
                {data.total_profit_loss < 0 ? (
                  <HiTrendingDown className="mr-1" />
                ) : (
                  <HiTrendingUp className="mr-1" />
                )}
                {formatCurrency(Math.abs(data.total_profit_loss))}
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
              <div className="text-sm text-gray-500 mb-1">P&L Percentage</div>
              <div
                className={`text-xl font-bold flex items-center ${
                  data.total_pnl_percentage < 0
                    ? "text-red-600"
                    : "text-green-600"
                }`}
              >
                {data.total_pnl_percentage < 0 ? (
                  <HiTrendingDown className="mr-1" />
                ) : (
                  <HiTrendingUp className="mr-1" />
                )}
                {Math.abs(data.total_pnl_percentage).toFixed(2)}%
              </div>
            </div>
          </div>

          {/* Alert Banner */}
          <div className="bg-amber-50 border-l-4 border-amber-400 p-4 mb-6 rounded">
            <div className="flex">
              <div className="flex-shrink-0">
                <HiExclamationCircle className="h-5 w-5 text-amber-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-amber-700">
                  Your portfolio requires immediate attention. There's a
                  significant loss of{" "}
                  {Math.abs(data.total_pnl_percentage).toFixed(2)}% on your
                  investments.
                </p>
              </div>
            </div>
          </div>

          {/* Summary Section */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
              <HiMiniChartBar className="mr-2 text-slate-600" />
              Portfolio Summary
            </h3>
            <div className="prose prose-sm max-w-none text-gray-600">
              {sections && sections.length > 0 && (
                <p>{sections[0].replace("Summary", "").trim()}</p>
              )}
            </div>
          </div>

          {/* Key Insights */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
              <HiArrowsRightLeft className="mr-2 text-slate-600" />
              Key Insights
            </h3>
            <div className="prose prose-sm max-w-none">
              {sections && sections.length > 1 && (
                <ul className="space-y-2 text-gray-600">
                  {sections[1]
                    .replace("Insights", "")
                    .trim()
                    .split("*   ")
                    .filter(Boolean)
                    .map((insight, index) => (
                      <li key={index} className="flex items-start">
                        <span className="mr-2 mt-1 text-slate-500">•</span>
                        <span>{insight.trim()}</span>
                      </li>
                    ))}
                </ul>
              )}
            </div>
          </div>

          {/* Priority Actions */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
              <HiArrowRight className="mr-2 text-slate-600" />
              Priority Actions
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {getActionItems().map((item, index) => (
                <div key={index} className="bg-slate-50 rounded-lg p-4">
                  <div className="font-medium text-slate-800 mb-1">
                    {item.title}
                  </div>
                  <div className="text-sm text-gray-600">
                    {item.description}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 p-4 flex justify-end bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-600 text-white rounded hover:bg-slate-700 font-medium"
          >
            Close Insights
          </button>
        </div>
      </div>
    </div>
  );
};

export default PortfolioInsights;
