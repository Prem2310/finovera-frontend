import {  HiOutlineSparkles } from "react-icons/hi2";
import OrderTypeChip from "./OrderTypeChip";

function RecommendedStockCard({
  stockName,
  stockSymbol,
  price,
  currency = "₹",
  icon,
  percentageChange,
  trend = "up",
  recommendation = "BUY",
  showOptions = true,
}) {
  return (
    <div className="border border-slate-300 bg-white rounded-md shadow-sm p-4 w-64">
      <div className="flex items-center gap-2 justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xl text-slate-500 p-2 border border-slate-300 rounded-md inline-block">
            {icon}
          </span>
          <div>
            <p className="font-medium tracking-tight text-slate-800">
              {stockName}
            </p>
            <p className="text-xs text-slate-500">{stockSymbol}</p>
          </div>
        </div>
        {showOptions && (
          <div className="border border-slate-300 rounded-md p-1">
            <HiOutlineSparkles className="cursor-pointer text-slate-600 text-lg" />
          </div>
        )}
      </div>
      <div className="flex flex-col">
        <div className="flex justify-between items-center">
          <p className="text-lg font-semibold tracking-tight">
            <span className="text-slate-400 font-medium">{currency}</span>{" "}
            {price}
          </p>
         <OrderTypeChip type={recommendation} />
        </div>
        {percentageChange && (
          <p className="text-xs text-slate-400 font-medium mt-2">
            <span
              className={`${
                trend === "up"
                  ? "text-emerald-600 bg-emerald-50"
                  : "text-red-600 bg-red-50"
              } p-1 rounded mr-0.5`}
            >
              {trend === "up" ? "+" : "-"}
              {percentageChange}%
            </span>
            today
          </p>
        )}
      </div>
    </div>
  );
}

export default RecommendedStockCard;
