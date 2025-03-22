function ColorValueIndicator({ value, isPercentage = false }) {
  const formattedValue = isPercentage ? `(${value}%)` : value;
  const sign = value >= 0 ? "+" : "";

  return (
    <span
      className={`text-sm font-mono font-medium ${
        value < 0 ? "text-red-600" : "text-green-700"
      }`}
    >
      {!isPercentage && sign}
      {formattedValue}
    </span>
  );
}

export default ColorValueIndicator;
