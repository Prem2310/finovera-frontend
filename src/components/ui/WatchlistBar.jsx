import React from 'react' 
function WatchlistBar({companyName, price, percentageChange}) {
  return (
    <div className="flex justify-between items-center px-2 py-4 bg-white  rounded border border-gray-200 mb-2">
      <div className="flex items-center">
        <p className="text-gray-800">{companyName}</p>
      </div>

      <div className="flex gap-2 items-end">
        <p className="text-sm text-gray-900">{price}</p>
        <p
          className={`text-sm font-medium ${
            parseFloat(percentageChange) >= 0
              ? "text-green-600"
              : "text-red-600"
          }`}
        >
          {parseFloat(percentageChange) >= 0 ? "+" : ""}
          {percentageChange}%
        </p>
      </div>
    </div>
  );
}

export default WatchlistBar
