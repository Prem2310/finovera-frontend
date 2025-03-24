import React, { useState, useEffect } from "react";
import DashboardCard from "../components/ui/DashboardCard";
import {
  HiBanknotes,
  HiInbox,
  HiPaperAirplane,
  HiPlus,
  HiSparkles,
} from "react-icons/hi2";
import { HiTrendingUp } from "react-icons/hi";
import PageHeading from "../components/ui/PageHeading";
import Button from "../components/Button";
import RecommendedStockCard from "../components/ui/RecommendedStockCard";
import StockPortfolioTable from "../components/StockPortfolioTable";
import { useGetUserTrnasMutation } from "../hooks/mutations/useGetUserTrnasMutation";
import UploadCSV from "../components/UploadXls";
import { useGetLLMMutation } from "../hooks/mutations/useGetLLMMutation";
import PortfolioInsights from "../components/PortfolioInsights";

// Recommendation cache
const recommendationCache = {
  data: null,
  timestamp: null,
  cacheExpiry: 5 * 60 * 1000, // 5 minutes in milliseconds
};

function Dashboard() {
  const { transactionData, isLoading, isError } = useGetUserTrnasMutation();
  const [summaryData, setSummaryData] = useState(null);
  const [showInsightsModal, setShowInsightsModal] = useState(false);
  const {
    mutate: llmMutation,
    isLoading: isLLMLoading,
    mutateAsync: llmMutateAsync,
  } = useGetLLMMutation();

  const [recommendationData, setRecommendationData] = useState(null);
  const [isLoadingRecommendations, setIsLoadingRecommendations] =
    useState(false);
  const [recommendationError, setRecommendationError] = useState(null);
  const [hasAttemptedFetch, setHasAttemptedFetch] = useState(false);

  useEffect(() => {
    if (!hasAttemptedFetch) {
      fetchRecommendations();
      setHasAttemptedFetch(true);
    }
  }, [hasAttemptedFetch]);

  const isCacheValid = () => {
    if (!recommendationCache.data || !recommendationCache.timestamp) {
      return false;
    }
    const now = new Date().getTime();
    const cacheAge = now - recommendationCache.timestamp;
    return cacheAge < recommendationCache.cacheExpiry;
  };

  const fetchRecommendations = async () => {
    if (isCacheValid()) {
      setRecommendationData(recommendationCache.data);
      return;
    }

    setIsLoadingRecommendations(true);
    setRecommendationError(null);

    const accessToken = localStorage.getItem("access_token");

    if (!accessToken) {
      setRecommendationError("Authentication required");
      setIsLoadingRecommendations(false);
      return;
    }

    const requestData = { access_token: accessToken };

    try {
      const apiBaseUrl = import.meta.env.VITE_REACT_APP_API_BASE_URL;
      const response = await fetch(`${apiBaseUrl}recommend/recommend_stocks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      if (data && data.recommendations && data.recommendations.length > 0) {
        setRecommendationData(data);
        recommendationCache.data = data;
        recommendationCache.timestamp = new Date().getTime();
        console.log("Recommendations fetched and cached:", data);
      } else {
        setRecommendationData(null);
      }
    } catch (error) {
      console.error("Error fetching recommendations:", error);
      setRecommendationError(error.message);
    } finally {
      setIsLoadingRecommendations(false);
    }
  };

  const refreshRecommendations = () => {
    recommendationCache.timestamp = null;
    fetchRecommendations();
  };

  const handleSummarize = async () => {
    const accessToken = localStorage.getItem("access_token");

    if (!accessToken) {
      console.error("No access token found");
      return;
    }

    const requestData = { access_token: accessToken };

    try {
      const summaryResponse = await llmMutateAsync({
        ...requestData,
        endpoint: "summarize_llm/get_data", // Specify the endpoint
      });
      console.log("Summary data fetched:", summaryResponse);
      setSummaryData(summaryResponse);
      setShowInsightsModal(true);
    } catch (error) {
      console.error("Error fetching summary data:", error);
      setSummaryData(null); // Fallback to default data in PortfolioInsights
      setShowInsightsModal(true); // Still show modal with fallback
    }
  };

  const renderRecommendedStocks = () => {
    if (isLoadingRecommendations) {
      return (
        <div className="text-gray-500 py-4">Loading recommendations...</div>
      );
    }

    if (recommendationError) {
      return (
        <div className="text-red-500 py-4">
          Failed to load recommendations: {recommendationError}
          <button
            className="ml-2 text-blue-500 underline"
            onClick={refreshRecommendations}
          >
            Retry
          </button>
        </div>
      );
    }

    if (
      !recommendationData ||
      !recommendationData.recommendations ||
      recommendationData.recommendations.length === 0
    ) {
      return (
        <div className="text-gray-500 py-4">
          No stock recommendations available.
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
        {recommendationData.recommendations.map((stock, index) => {
          if (!stock.stockname) return null;
          return (
            <RecommendedStockCard
              key={index}
              stockName={stock.stockname}
              stockSymbol={stock.symbol !== "N/A" ? stock.symbol : null}
              sector={stock.sector}
            />
          );
        })}
      </div>
    );
  };

  return (
    <div>
      <div className="flex justify-between">
        <PageHeading>Dashboard</PageHeading>
        <div className="flex gap-4">
          <Button
            onClick={handleSummarize}
            icon={<HiSparkles />}
            type="primary"
            className="tracking-wide"
            disabled={isLLMLoading} // Disable button while loading
          >
            Portfolio Insights
          </Button>
          <UploadCSV />
        </div>
      </div>

      <div className="flex flex-nowrap gap-4">
        <DashboardCard
          title="Realised Gains"
          icon={<HiTrendingUp />}
          value="1,245"
          currency={null}
          percentage="5.7"
          trend="up"
          comparisonText="since last week"
        />
        <DashboardCard
          title="Unrealised Gains"
          icon={<HiInbox />}
          value="12,325.18"
          currency="₹"
          percentage="3.8"
          trend="down"
          comparisonText="from previous quarter"
        />
        <DashboardCard
          title="Revenue"
          icon={<HiBanknotes />}
          value="43,434.22"
          currency="₹"
          percentage="21.32"
          trend="up"
          comparisonText="from last month"
        />
      </div>

      <p className="py-2 font-medium">Your personalized picks</p>
      {renderRecommendedStocks()}

      <p className="py-4">Transaction table</p>
      <StockPortfolioTable data={transactionData} isLoading={isLoading} />

      {showInsightsModal && (
        <PortfolioInsights
          insightsData={summaryData}
          onClose={() => setShowInsightsModal(false)}
        />
      )}
    </div>
  );
}

export default Dashboard;
