import React from "react";
import RecommendedStockCard from "../components/ui/RecommendedStockCard";
import PageHeading from "../components/ui/PageHeading";
import StockChart from "../components/StockChart";
function Watchlist() {
  return (
    <div>
      <div>
        <PageHeading>Watchlist and recommendation</PageHeading>
        <div>
          <h2 className="mb-2 text-slate-900">
            Personalised recommendations</h2>
        </div>
        <div className="flex gap-4">
          <RecommendedStockCard
            stockName="Reliance India"
            stockSymbol="RIL"
            price="1459.3"
            percentageChange="2.1%"
          />
          <RecommendedStockCard
            stockName="Reliance India"
            stockSymbol="RIL"
            price="1459.3"
            percentageChange="2.1%"
          />
          <RecommendedStockCard
            stockName="Reliance India"
            stockSymbol="RIL"
            price="1459.3"
            percentageChange="2.1%"
          />
          <RecommendedStockCard
            stockName="Reliance India"
            stockSymbol="RIL"
            price="1459.3"
            percentageChange="2.1%"
          />
        </div>
        <div className="grid grid-cols-12 gap-4 mt-4">
          <div className="col-span-12 md:col-span-4 p-4 border border-slate-300 rounded-md">
            Your watchlist
          </div>
          <div className="col-span-12 md:col-span-8 p-4 border border-slate-300 rounded-md">
            <StockChart
              key={1}
              instrumentKey={"INE009A01021"}
              stockName={"TCS"}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Watchlist;
