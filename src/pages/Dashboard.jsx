import React from "react";
import DashboardCard from "../components/ui/DashboardCard";
import {
  HiBanknotes,
  HiInbox,
  HiPaperAirplane,
  HiSparkles,
} from "react-icons/hi2";
import { HiTrendingUp } from "react-icons/hi";
import PageHeading from "../components/ui/PageHeading";
import Button from "../components/Button";
import RecommendedStockCard from "../components/ui/RecommendedStockCard";
function Dashboard() {
  return (
    <div>
      <div className="flex justify-between">
        <PageHeading>Dashboard</PageHeading>
        <div className="flex gap-4">
          <Button
            icon={<HiSparkles />}
            type="primary"
            className=" tracking-wide"
          >
            Portfolio insights
          </Button>
        </div>
      </div>
      {/* dashboard card */}
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
      <RecommendedStockCard
        stockName="Apple Inc."
        stockSymbol="AAPL"
        price="178.72"
        currency="$"
        icon={<HiPaperAirplane />}
        percentageChange="2.43"
        trend="up"
        recommendation="buy"
      />
    </div>
  );
}

export default Dashboard;
