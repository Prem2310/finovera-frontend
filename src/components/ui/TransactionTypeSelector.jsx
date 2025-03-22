import React, { useState } from "react";

const TransactionTypeSelector = ({transactionType, setTransactionType}) => {

  return (
    <div className="flex space-x-4 w-full">
      <button
        className={`px-2 py-1 rounded-md focus:outline-none text-sm font-medium transition-colors ease-in ${
          transactionType === "delivery"
            ? "bg-slate-200 text-slate-800 border border-slate-300"
            : "border bg-gray-100 text-gray-500"
        }`}
        onClick={() => setTransactionType("delivery")}
      >
        Delivery
      </button>
      <button
        className={`px-2 py-1 rounded-md focus:outline-none text-sm font-medium transition-colors ease-in ${
          transactionType === "intraday"
            ? "bg-slate-200 text-slate-800 border border-slate-300"
            : "border bg-gray-100 text-gray-500"
        }`}
        onClick={() => setTransactionType("intraday")}
      >
        Intraday
      </button>
    </div>
  );
};

export default TransactionTypeSelector;
