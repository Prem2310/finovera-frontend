import React from "react";
import PageHeading from "../components/ui/PageHeading";
import TransactionBar from "../components/TransactionBar ";
function Transaction() {
  return (
    <div>
      <PageHeading>Transaction history</PageHeading>
      <TransactionBar
        transaction={{
          type: "buy",
          symbol: "AAPL",
          companyName: "Apple Inc.",
          shares: 10,
          price: 178.92,
          timestamp: "2025-03-22T14:30:00",
        }}
      />
    </div>
  );
}

export default Transaction;
