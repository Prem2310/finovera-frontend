function PercentageChangeChip({ percentageChange, dayChange }) {
  return (
    <span
      className={`text-sm font-medium ${
        dayChange < 0 ? "text-red-600" : "text-green-700"
      }`}
    >
      {dayChange < 0 ? "" : "+"}
      {dayChange} ({percentageChange}%) <span className="text-gray-500">1D</span>
    </span>
  );
}

export default PercentageChangeChip;
