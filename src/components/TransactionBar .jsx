import React from "react";
import { HiArrowDown, HiArrowUp, HiClock } from "react-icons/hi2";

const TransactionBar = ({ transaction }) => {
  // Determine if transaction is buy or sell
  const isBuy = transaction.type === "buy";

  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(value);
  };

  // Format date and time
  const formatDateTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="flex items-center justify-between p-3 border-b bg-white rounded-md border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer">
      {/* Left section - Stock and transaction type */}
      <div className="flex items-center space-x-3">
        <div
          className={`p-2 rounded-full ${
            isBuy ? "bg-green-100" : "bg-red-100"
          }`}
        >
          {isBuy ? (
            <HiArrowDown
              className={`h-4 w-4 ${isBuy ? "text-green-600" : "text-red-600"}`}
            />
          ) : (
            <HiArrowUp
              className={`h-4 w-4 ${isBuy ? "text-green-600" : "text-red-600"}`}
            />
          )}
        </div>
        <div>
          <div className="font-medium">{transaction.symbol}</div>
          <div className="text-sm text-gray-500">{transaction.companyName}</div>
        </div>
      </div>

      {/* Middle section - Quantity and price */}
      <div className="text-center">
        <div className="font-medium">{transaction.shares} shares</div>
        <div className="text-sm text-gray-500">
          @ {formatCurrency(transaction.price)}
        </div>
      </div>

      {/* Right section - Total and timestamp */}
      <div className="text-right">
        <div
          className={`font-medium ${isBuy ? "text-green-600" : "text-red-600"}`}
        >
          {isBuy ? "+" : "-"}
          {formatCurrency(transaction.shares * transaction.price)}
        </div>
        <div className="text-xs text-gray-500 flex items-center justify-end">
          <HiClock className="h-3 w-3 mr-1" />
          {formatDateTime(transaction.timestamp)}
        </div>
      </div>
    </div>
  );
};

export default TransactionBar;
