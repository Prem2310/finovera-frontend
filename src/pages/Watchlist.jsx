import React, { useState } from "react";
import RecommendedStockCard from "../components/ui/RecommendedStockCard";
import PageHeading from "../components/ui/PageHeading";
import StockChart from "../components/StockChart";
import WatchlistBar from "../components/ui/WatchlistBar";

function Watchlist() {
  // State to track the currently selected stock for the chart
  const [selectedStock, setSelectedStock] = useState({
    instrumentKey: "INE467B01029",
    stockName: "TCS",
  });

  // Watchlist data - could be fetched from an API in a real application
  const watchlistData = [
    {
      companyName: "Reliance Industries",
      price: "2895.50",
      percentageChange: "1.2",
      instrumentKey: "INE002A01018",
    },
    {
      companyName: "Tata Consultancy Services",
      price: "3978.10",
      percentageChange: "-0.4",
      instrumentKey: "INE467B01029",
    },
    {
      companyName: "Infosys",
      price: "1610.75",
      percentageChange: "0.9",
      instrumentKey: "INE009A01021",
    },
    {
      companyName: "HDFC Bank",
      price: "1625.90",
      percentageChange: "1.1",
      instrumentKey: "INE040A01034",
    },
    {
      companyName: "ICICI Bank",
      price: "1110.20",
      percentageChange: "-0.3",
      instrumentKey: "INE090A01021",
    },
    {
      companyName: "Larsen & Toubro",
      price: "3598.45",
      percentageChange: "0.7",
      instrumentKey: "INE018A01030",
    },
    {
      companyName: "Kotak Mahindra Bank",
      price: "1695.30",
      percentageChange: "0.5",
      instrumentKey: "INE237A01028",
    },
    {
      companyName: "Bajaj Finance",
      price: "7235.00",
      percentageChange: "-1.0",
      instrumentKey: "INE296A01024",
    },
    {
      companyName: "Maruti Suzuki",
      price: "11245.75",
      percentageChange: "2.3",
      instrumentKey: "INE585B01010",
    },
    {
      companyName: "Axis Bank",
      price: "1025.60",
      percentageChange: "1.6",
      instrumentKey: "INE238A01034",
    },
    {
      companyName: "ITC",
      price: "421.25",
      percentageChange: "-0.2",
      instrumentKey: "INE154A01025",
    },
    {
      companyName: "Sun Pharma",
      price: "1455.85",
      percentageChange: "0.8",
      instrumentKey: "INE044A01036",
    },
  ];


  // Handler for when a watchlist item is clicked
  const handleWatchlistItemClick = (item) => {
    setSelectedStock({
      instrumentKey: item.instrumentKey,
      stockName: item.companyName,
    });
  };

  return (
    <div>
      <div>
        <PageHeading>Watchlist and recommendation</PageHeading>
        <div>
          <h2 className="mb-2 text-slate-900">Personalised recommendations</h2>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-2">
          <RecommendedStockCard
            stockName="Reliance India"
            stockSymbol="RIL"
            price="1459.3"
            percentageChange="2.1%"
          />
          <RecommendedStockCard
            stockName="Infosys"
            stockSymbol="INFY"
            price="1780.5"
            percentageChange="1.5%"
          />
          <RecommendedStockCard
            stockName="HDFC Bank"
            stockSymbol="HDFCBANK"
            price="1642.5"
            percentageChange="1.3%"
          />
          <RecommendedStockCard
            stockName="TCS"
            stockSymbol="TCS"
            price="3895.6"
            percentageChange="-0.8%"
          />
        </div>
        <div className="grid grid-cols-12 gap-4 mt-4">
          <div className="col-span-12 md:col-span-4 p-2 border border-slate-300 rounded-md  flex flex-col">
            <p className="mb-4 font-medium">Your watchlist</p>
            <div className="overflow-y-auto flex-grow h-96">
              {watchlistData.map((item, index) => (
                <div
                  key={index}
                  onClick={() => handleWatchlistItemClick(item)}
                  className="cursor-pointer hover:bg-slate-50 transition-colors"
                >
                  <WatchlistBar
                    companyName={item.companyName}
                    price={item.price}
                    percentageChange={item.percentageChange}
                  />
                </div>
              ))}
            </div>
          </div>
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
