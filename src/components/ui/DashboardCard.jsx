import { HiOutlineEllipsisHorizontal } from "react-icons/hi2";

function DashboardCard({
  title,
  icon,
  value,
  currency = "₹",
  percentage = null,
  trend = "up",
  comparisonText = "from last month",
  showOptions = true,
}) {
  return (
    <div className="border border-slate-300 bg-white rounded-md shadow-sm p-4 w-full sm:w-full">
      <div className="flex items-center gap-2 justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-xl text-slate-500 p-2 border border-slate-300 rounded-md inline-block">
            {icon}
          </span>
          <p className="font-medium tracking-tight text-slate-800">{title}</p>
        </div>
        {showOptions && (
          <div className="border border-slate-300 rounded-md p-1">
            <HiOutlineEllipsisHorizontal className="cursor-pointer text-slate-600 text-lg" />
          </div>
        )}
      </div>
      <div className="flex flex-col">
        <p className="text-lg font-semibold tracking-tight mb-1 font-mono">
          {currency && (
            <span className="text-slate-400 font-medium">{currency}</span>
          )}{" "}
          {value}
        </p>
        {percentage && (
          <p className="text-xs text-slate-400 font-medium mt-1 font-mono">
            <span
              className={`${
                trend === "up"
                  ? "text-emerald-600 bg-emerald-50"
                  : "text-red-600 bg-red-50"
              } p-1 rounded mr-0.5`}
            >
              {trend === "up" ? "+" : "-"}
              {percentage}%
            </span>
            {comparisonText}
          </p>
        )}
      </div>
    </div>
  );
}

export default DashboardCard;
