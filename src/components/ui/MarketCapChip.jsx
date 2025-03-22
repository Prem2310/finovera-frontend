function MarketCapChip({ type, industry }) {
  const size = {
    "Small Cap": "🏬 Small Cap",
    "Mid Cap": " 🏢 Mid Cap",
    "Large Cap": " 🏭 Large Cap",
  };
  return (
    <div className="inline-flex p-1 border rounded uppercase font-medium h-fit border-gray-300 text-gray-500 text-xs">
      {size[industry]}
    </div>
  );
}

export default MarketCapChip;
