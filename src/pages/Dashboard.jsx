import React from "react";
import DashboardCard from "../components/ui/DashboardCard";
import { HiBanknotes, HiInbox } from "react-icons/hi2";
import { HiTrendingUp } from "react-icons/hi";
import PageHeading from "../components/ui/PageHeading";
import Button from "../components/Button";
function Dashboard() {
  return (
    <div>
      <div className="flex">
        <PageHeading>Dashboard</PageHeading>
        <div className="flex gap-4">
          <Button ></Button>
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
    </div>
  );
}

export default Dashboard;
