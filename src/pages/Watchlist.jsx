import React, { useState, useEffect, useRef } from "react";
import RecommendedStockCard from "../components/ui/RecommendedStockCard";
import PageHeading from "../components/ui/PageHeading";
import StockChart from "../components/StockChart";
import WatchlistBar from "../components/ui/WatchlistBar";
import toast from "react-hot-toast";

const recommendationCache = {
  data: null,
  timestamp: null,
  cacheExpiry: 5 * 60 * 1000,
};

function Watchlist() {
  const [recommendationData, setRecommendationData] = useState(null);
  const [recommendationError, setRecommendationError] = useState(null);
  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(false);
  const [hasAttemptedFetch, setHasAttemptedFetch] = useState(false);

  const [watchlistData, setWatchlistData] = useState([]);
  const [watchlistError, setWatchlistError] = useState(null);
  const [isLoadingWatchlist, setIsLoadingWatchlist] = useState(false);
  const [currentWatchlistName, setCurrentWatchlistName] = useState("Default");
  const [allWatchlists, setAllWatchlists] = useState([]);

  const [stockPrices, setStockPrices] = useState(new Map());
  const [recommendedStockPrices, setRecommendedStockPrices] = useState(new Map());

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const searchTimeoutRef = useRef(null);

  const [selectedStock, setSelectedStock] = useState({
    instrumentKey: "INE467B01029",
    stockName: "TCS",
  });

  const [showCreateWatchlist, setShowCreateWatchlist] = useState(false);
  const [newWatchlistName, setNewWatchlistName] = useState("");

  const apiBaseUrl = import.meta.env.VITE_REACT_APP_API_BASE_URL;

  useEffect(() => {
    if (!hasAttemptedFetch) {
      fetchRecommendations();
      fetchUserWatchlists();
      setHasAttemptedFetch(true);
    }
  }, [hasAttemptedFetch]);

  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (searchQuery.trim().length >= 2) {
      searchTimeoutRef.current = setTimeout(() => {
        handleSearchStocks();
      }, 300);
    } else {
      setSearchResults([]);
      setShowSearchResults(false);
    }

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery]);

  const fetchAndStoreLastPrice = async (isin, symbol) => {
    const localKey = `price_${isin}`;
    const today = new Date().toISOString().split("T")[0];
    const cached = JSON.parse(localStorage.getItem(localKey));
    if (cached && cached.date === today) {
      return cached.priceData;
    }

    try {
      const res = await fetch(`${apiBaseUrl}userCRUD/get_last_price`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isin }),
      });

      if (!res.ok) throw new Error("Failed to fetch from backend");

      const json = await res.json();
      const { open, close } = json.data;

      const priceData = {
        price: close,
        changePercent: (((close - open) / open) * 100).toFixed(2),
      };

      localStorage.setItem(localKey, JSON.stringify({ date: today, priceData }));
      return priceData;
    } catch (err) {
      console.error("Error fetching last price:", err);
      return { price: "N/A", changePercent: "0.0" };
    }
  };

  const isCacheValid = () => {
    if (!recommendationCache.data || !recommendationCache.timestamp) return false;
    const now = new Date().getTime();
    return now - recommendationCache.timestamp < recommendationCache.cacheExpiry;
  };

  const fetchRecommendations = async () => {
    if (isCacheValid()) {
      setRecommendationData(recommendationCache.data);
      console.log(recommendationCache.data)
      const stocks = recommendationCache.data.recommendations?.stocks || []
      const newPriceMap = new Map();
      for (const stock of stocks) {
        const price = await fetchAndStoreLastPrice(stock.isin, stock.symbol);
        newPriceMap.set(stock.symbol, price);
      }
      setRecommendedStockPrices(newPriceMap);
      console.log(recommendationCache.priceMap)
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

    try {
      const response = await fetch(`${apiBaseUrl}recommend/recommend_stocks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ access_token: accessToken }),
      });

      if (!response.ok) throw new Error(`Error: ${response.status}`);

      const data = await response.json();
      if (data?.recommendations?.length > 0) {
        const newPriceMap = new Map();
        for (const stock of data.recommendations) {
          if (stock.isin && stock.symbol !== "N/A") {
            const priceData = await fetchAndStoreLastPrice(stock.isin, stock.symbol);
            newPriceMap.set(stock.symbol, priceData);
          } else {
            newPriceMap.set(stock.symbol, { price: "N/A", changePercent: "0.0" });
          }
        }
        setRecommendedStockPrices(newPriceMap);
        setRecommendationData(data);
        recommendationCache.data = data;
        recommendationCache.priceMap = newPriceMap;
        recommendationCache.timestamp = new Date().getTime();
      } else {
        setRecommendationData(null);
        setRecommendedStockPrices(new Map());
      }
    } catch (error) {
      console.error("Error fetching recommendations:", error);
      setRecommendationError(error.message);
    } finally {
      setIsLoadingRecommendations(false);
    }
  };

  const fetchUserWatchlists = async () => {
    setIsLoadingWatchlist(true);
    setWatchlistError(null);

    const accessToken = localStorage.getItem("access_token");
    if (!accessToken) {
      setWatchlistError("Authentication required");
      setIsLoadingWatchlist(false);
      return;
    }

    try {
      const response = await fetch(`${apiBaseUrl}watchlist/get_watchlists`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ access_token: accessToken }),
      });

      if (!response.ok) throw new Error(`Error: ${response.status}`);

      const data = await response.json();
      setAllWatchlists(data.watchlists || []);
      await fetchSpecificWatchlist("Default");
    } catch (error) {
      console.error("Error fetching watchlists:", error);
      setWatchlistError(error.message);
    } finally {
      setIsLoadingWatchlist(false);
    }
  };

  const fetchSpecificWatchlist = async (watchlistName) => {
    const accessToken = localStorage.getItem("access_token");
    if (!accessToken) return;

    try {
      const response = await fetch(`${apiBaseUrl}watchlist/get_watchlist?watchlist_name=${watchlistName}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ access_token: accessToken }),
      });

      if (!response.ok) throw new Error(`Error: ${response.status}`);

      const data = await response.json();
      const stocks = data.watchlist?.stocks || [];
      setWatchlistData(stocks);
      setCurrentWatchlistName(watchlistName);

      const newPriceMap = new Map();
      for (const stock of stocks) {
        const price = await fetchAndStoreLastPrice(stock.isin, stock.symbol);
        newPriceMap.set(stock.symbol, price);
      }
      setStockPrices(newPriceMap);
    } catch (error) {
      console.error("Error fetching specific watchlist:", error);
      setWatchlistError(error.message);
    }
  };

  const handleSearchStocks = async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      const response = await fetch(`${apiBaseUrl}watchlist/search_stocks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: searchQuery, limit: 10 }),
      });

      if (!response.ok) throw new Error(`Error: ${response.status}`);

      const data = await response.json();
      setSearchResults(data.results || []);
      setShowSearchResults(true);
    } catch (error) {
      console.error("Error searching stocks:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleAddToWatchlist = async (stock) => {
    const accessToken = localStorage.getItem("access_token");
    if (!accessToken) return;

    try {
      const response = await fetch(`${apiBaseUrl}watchlist/add_to_watchlist`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          access_token: accessToken,
          watchlist_name: currentWatchlistName,
          stocks: [stock],
        }),
      });

      if (!response.ok) throw new Error(`Error: ${response.status}`);

      await fetchSpecificWatchlist(currentWatchlistName);
      setSearchQuery("");
      setShowSearchResults(false);
      setSearchResults([]);
      toast.success(`${stock.name_of_company} added to watchlist successfully!`);
    } catch (error) {
      console.error("Error adding to watchlist:", error);
      toast.error("Failed to add stock to watchlist");
    }
  };

  const handleRemoveFromWatchlist = async (isin) => {
    const accessToken = localStorage.getItem("access_token");
    if (!accessToken) return;

    if (!confirm("Are you sure you want to remove this stock from your watchlist?")) return;

    try {
      const response = await fetch(`${apiBaseUrl}watchlist/remove_from_watchlist`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          access_token: accessToken,
          watchlist_name: currentWatchlistName,
          isin,
        }),
      });

      if (!response.ok) throw new Error(`Error: ${response.status}`);

      await fetchSpecificWatchlist(currentWatchlistName);
      toast.success("Stock removed from watchlist successfully!");
    } catch (error) {
      console.error("Error removing from watchlist:", error);
      toast.error("Failed to remove stock from watchlist");
    }
  };

  const handleCreateWatchlist = async () => {
    if (!newWatchlistName.trim()) {
      alert("Please enter a watchlist name");
      return;
    }

    const accessToken = localStorage.getItem("access_token");
    if (!accessToken) return;

    try {
      const response = await fetch(`${apiBaseUrl}watchlist/create_watchlist`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          access_token: accessToken,
          watchlist_name: newWatchlistName,
          stocks: [],
        }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      await fetchUserWatchlists();
      setNewWatchlistName("");
      setShowCreateWatchlist(false);
      alert("Watchlist created successfully!");
    } catch (error) {
      console.error("Error creating watchlist:", error);
      alert("Failed to create watchlist. It may already exist.");
    }
  };

  const handleWatchlistItemClick = (item) => {
    setSelectedStock({
      instrumentKey: item.isin,
      stockName: item.name_of_company,
    });
  };

  const renderRecommendedStocks = () => {
    if (isLoadingRecommendations) {
      return <div className="text-gray-500 py-4">Loading recommendations...</div>;
    }

    if (recommendationError) {
      return (
        <div className="text-red-500 py-4">
          Failed to load recommendations: {recommendationError}
        </div>
      );
    }

    if (!recommendationData?.recommendations?.length) {
      return <div className="text-gray-500 py-4">No stock recommendations available.</div>;
    }

    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
        {recommendationData.recommendations.map((stock, index) =>
        
          stock.stockname ? (
            <RecommendedStockCard
              key={index}
              stockName={stock.stockname}
              stockSymbol={stock.symbol !== "N/A" ? stock.symbol : null}
              sector={stock.sector}
            />
          ) : null
        )}
      </div>
    );
  };

  return (
    <div>
      <div>
        <PageHeading>Watchlist and Recommendations</PageHeading>

        {/* Recommendations Section */}
        <div>
          <h2 className="mb-2 text-slate-900">Personalised recommendations</h2>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-2">
          {renderRecommendedStocks()}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-12 gap-4 mt-4">
          {/* Watchlist Section */}
          <div className="col-span-12 md:col-span-4 p-2 border border-slate-300 rounded-md flex flex-col">
            {/* Watchlist Header */}
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <select
                  value={currentWatchlistName}
                  onChange={(e) => fetchSpecificWatchlist(e.target.value)}
                  className="font-medium border rounded px-2 py-1"
                >
                  {allWatchlists.map((watchlist) => (
                    <option key={watchlist.watchlist_name} value={watchlist.watchlist_name}>
                      {watchlist.watchlist_name}
                    </option>
                  ))}
                </select>
              </div>
              <button
                onClick={() => setShowCreateWatchlist(!showCreateWatchlist)}
                className="text-blue-500 text-sm hover:underline"
              >
                + New
              </button>
            </div>

            {/* Create New Watchlist */}
            {showCreateWatchlist && (
              <div className="mb-4 p-2 border rounded bg-gray-50">
                <input
                  type="text"
                  placeholder="Watchlist name"
                  value={newWatchlistName}
                  onChange={(e) => setNewWatchlistName(e.target.value)}
                  className="w-full p-2 border rounded mb-2"
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleCreateWatchlist}
                    className="px-3 py-1 bg-blue-500 text-white rounded text-sm"
                  >
                    Create
                  </button>
                  <button
                    onClick={() => {
                      setShowCreateWatchlist(false);
                      setNewWatchlistName("");
                    }}
                    className="px-3 py-1 bg-gray-300 rounded text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Search Box */}
            <div className="mb-4 relative">
              <input
                type="text"
                placeholder="Search stocks by name or symbol..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              />
              {isSearching && (
                <div className="absolute right-2 top-2">
                  <div className="animate-spin h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                </div>
              )}

              {/* Search Results Dropdown */}
              {showSearchResults && searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-b shadow-lg max-h-60 overflow-y-auto z-10">
                  {searchResults.map((stock, index) => (
                    <div
                      key={index}
                      className="p-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100 flex justify-between items-center"
                      onClick={() => handleAddToWatchlist(stock)}
                    >
                      <div>
                        <div className="font-medium text-sm">{stock.symbol}</div>
                        <div className="text-xs text-gray-600 truncate">{stock.name_of_company}</div>
                      </div>
                      <button className="text-blue-500 text-xs px-2 py-1 border border-blue-500 rounded hover:bg-blue-50">
                        Add
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Watchlist Items */}
            <div className="overflow-y-auto flex-grow h-96">
              {isLoadingWatchlist ? (
                <div className="text-gray-500 py-4 text-center">Loading watchlist...</div>
              ) : watchlistError ? (
                <div className="text-red-500 py-4 text-center">{watchlistError}</div>
              ) : watchlistData.length === 0 ? (
                <div className="text-gray-500 py-4 text-center">
                  Your watchlist is empty. Search and add stocks above.
                </div>
              ) : (
                watchlistData.map((item, index) => {
                  const priceData = stockPrices.get(item.symbol) || { price: "N/A", changePercent: "0.0" };
                  return (
                    <div
                      key={index}
                      className="cursor-pointer hover:bg-slate-50 transition-colors group relative"
                      onClick={() => handleWatchlistItemClick(item)}
                    >
                      <WatchlistBar
                        companyName={item.name_of_company}
                        price={priceData.price}
                        percentageChange={priceData.changePercent}
                        symbol={item.symbol}
                      />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveFromWatchlist(item.isin);
                        }}
                        className="absolute right-1 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 text-sm"
                      >
                        ✕
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Chart Section */}
          <div className="col-span-12 md:col-span-8 p-4 border h-fit border-slate-300 rounded-md">
            <StockChart
              key={selectedStock.instrumentKey}
              instrumentKey={selectedStock.instrumentKey}
              stockName={selectedStock.stockName}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Watchlist;
