import { HiArrowDown, HiArrowUp } from "react-icons/hi2";

export default function HoldingsTable({ holdings }) {
  // Early return with placeholder if no data
  if (!holdings || holdings.length === 0) {
    return (
      <div className="py-8 text-center text-gray-500">
        <p className="font-medium">No holdings data available</p>
        <p className="text-sm">
          Connect your account to view your portfolio details
        </p>
      </div>
    );
  }

  // Format currency values
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(value);
  };

  // Calculate total investment and current value for each holding
  const calculateValues = (holding) => {
    const investmentValue = holding.quantity * holding.averageprice;
    const currentValue = holding.quantity * holding.ltp;
    return { investmentValue, currentValue };
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3">
              Symbol
            </th>
            <th scope="col" className="px-6 py-3">
              Quantity
            </th>
            <th scope="col" className="px-6 py-3">
              Avg. Price
            </th>
            <th scope="col" className="px-6 py-3">
              LTP
            </th>
            <th scope="col" className="px-6 py-3">
              Investment
            </th>
            <th scope="col" className="px-6 py-3">
              Current Value
            </th>
            <th scope="col" className="px-6 py-3">
              P&L
            </th>
            <th scope="col" className="px-6 py-3">
              P&L %
            </th>
          </tr>
        </thead>
        <tbody>
          {holdings?.map((holding) => {
            const { investmentValue, currentValue } = calculateValues(holding);
            return (
              <tr
                key={holding.tradingsymbol}
                className="bg-white border-b hover:bg-gray-50"
              >
                <td className="px-6 py-4 font-medium text-gray-900">
                  {holding.tradingsymbol}
                </td>
                <td className="px-6 py-4">{holding.quantity}</td>
                <td className="px-6 py-4">
                  {formatCurrency(holding.averageprice)}
                </td>
                <td className="px-6 py-4">{formatCurrency(holding.ltp)}</td>
                <td className="px-6 py-4">{formatCurrency(investmentValue)}</td>
                <td className="px-6 py-4">{formatCurrency(currentValue)}</td>
                <td
                  className={`px-6 py-4 ${
                    holding.profitandloss >= 0
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  <div className="flex items-center">
                    {holding.profitandloss >= 0 ? (
                      <HiArrowUp className="mr-1 h-4 w-4" />
                    ) : (
                      <HiArrowDown className="mr-1 h-4 w-4" />
                    )}
                    {formatCurrency(holding.profitandloss)}
                  </div>
                </td>
                <td
                  className={`px-6 py-4 ${
                    holding.pnlpercentage >= 0
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  <div className="flex items-center">
                    {holding.pnlpercentage >= 0 ? (
                      <HiArrowUp className="mr-1 h-4 w-4" />
                    ) : (
                      <HiArrowDown className="mr-1 h-4 w-4" />
                    )}
                    {holding.pnlpercentage.toFixed(2)}%
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
