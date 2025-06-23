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
    const savedLLMData = localStorage.getItem('portfolio_summary');
    if (savedLLMData && !recommendationData) {
      try {
        const parsedData = JSON.parse(savedLLMData);
        setSummaryData(parsedData);
      } catch (error) {
        console.error('Error parsing saved SUmmary data:', error);
        // Clean up corrupted data
        localStorage.removeItem('portfolio_summary');
      }
    }
  }, [recommendationData]);
  // State for calculated metrics
  const [realizedGains, setRealizedGains] = useState(0);
  const [unrealizedGains, setUnrealizedGains] = useState(0);
  const [revenue, setRevenue] = useState(0);

  useEffect(() => {
    if (!hasAttemptedFetch) {
      fetchRecommendations();
      setHasAttemptedFetch(true);
    }
  }, [hasAttemptedFetch]);

  // Calculate realized gains, unrealized gains, and revenue from transaction data
  useEffect(() => {
    if (!isLoading && !isError && transactionData ) {
      let totalRealizedGains = 0;
      let totalUnrealizedGains = 0;
      let totalRevenue = 0;
      console.log(transactionData);
      console.log(isLoading);
      console.log(isError)
      if (Array.isArray(transactionData)) {
        transactionData.forEach((transaction) => {
          if (transaction.realized_pnl !== null) {
            totalRealizedGains += Number(transaction.realized_pnl) || 0;
          }
          if (transaction.unrealized_pnl !== null) {
            totalUnrealizedGains += Number(transaction.unrealized_pnl) || 0;
          }
          if (transaction.sell_date !== null && transaction.sell_value !== null) {
            totalRevenue += Number(transaction.sell_value) || 0;
          }
        });
      } else if (transactionData?.message === "No transactions found") {
        totalRealizedGains = Number(transactionData.realized_gain) || 0;
        totalUnrealizedGains = Number(transactionData.unrealized_gain) || 0;
      }

      setRealizedGains(totalRealizedGains.toFixed(2));
      setUnrealizedGains(totalUnrealizedGains.toFixed(2));
      setRevenue(totalRevenue.toFixed(2));
    }
  }, [transactionData, isLoading, isError]);

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

  // Check if data is already cached in localStorage
  const savedLLMData = localStorage.getItem("portfolio_summary");
  if (savedLLMData) {
    try {
      const parsedData = JSON.parse(savedLLMData);
      setSummaryData(parsedData);
      setShowInsightsModal(true);
      console.log("Loaded summary from localStorage");
      return; // Skip API call
    } catch (error) {
      console.error("Corrupted summary data in localStorage");
      localStorage.removeItem("portfolio_summary");
    }
  }

  // If no cached data, fetch from API
  const requestData = { access_token: accessToken };

  try {
    const summaryResponse = await llmMutateAsync({
      ...requestData,
      endpoint: "summarize_llm/get_data",
    });
    console.log("Summary data fetched from API:", summaryResponse);
    setSummaryData(summaryResponse);
    localStorage.setItem("portfolio_summary", JSON.stringify(summaryResponse));
    setShowInsightsModal(true);
  } catch (error) {
    console.error("Error fetching summary data:", error);
    setSummaryData(null);
    setShowInsightsModal(true);
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
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-6">
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
            disabled={isLLMLoading}
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
          value={isLoading ? "Loading..." : isError ? "N/A" : realizedGains}
          currency="₹"
          trend={isLoading || isError ? "down" : Number(unrealizedGains) > 0 ? "up" : "down"}

        />
        <DashboardCard
          title="Unrealised Gains"
          icon={<HiInbox />}
          value={isLoading ? "Loading..." : isError ? "N/A" : unrealizedGains}
          currency="₹"
          trend={isLoading || isError ? "down" : Number(unrealizedGains) > 0 ? "up" : "down"}
        />
        <DashboardCard
          title="Revenue"
          icon={<HiBanknotes />}
          value={isLoading ? "Loading..." : isError ? "N/A" : revenue}
          currency="₹"
          trend={isLoading || isError ? "down" : Number(revenue) > 0 ? "up" : "down"}
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
