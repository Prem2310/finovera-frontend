import React, { useState } from "react";

const BuySellSwitch = ({isBuy, setIsBuy}) => {

  const toggleSwitch = () => setIsBuy(!isBuy);

  return (
    <div className="flex items-center">
      <span
        className={`mr-2 text-sm font-medium ${
          isBuy ? "text-green-500" : "text-slate-400"
        }`}
      >
        Buy
      </span>
      <div
        className={`relative inline-block w-10 h-6 transition duration-200 ease-in-out rounded-full cursor-pointer ${
          isBuy ? "bg-green-500" : "bg-red-500"
        }`}
        onClick={toggleSwitch}
      >
        <div
          className={`absolute left-1 top-1 w-4 h-4 transition duration-200 ease-in-out bg-white rounded-full transform ${
            isBuy ? "translate-x-0" : "translate-x-4"
          }`}
        ></div>
      </div>
      <span
        className={`ml-2 font-medium ${
          !isBuy ? "text-red-600" : "text-gray-400"
        }`}
      >
        Sell
      </span>
    </div>
  );
};

export default BuySellSwitch;
