import React, { useState } from "react";
import {
  HiArrowDown,
  HiArrowUp,
  HiOutlineEllipsisHorizontal,
  HiChevronLeft,
  HiChevronRight,
} from "react-icons/hi2";

export default function StockPortfolioTable({ data }) {
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Early return with placeholder if no data
  if (!data || data.length === 0) {
    return (
      <div className="py-8 text-center text-gray-500">
        <p className="font-medium">No stock data available</p>
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

  // Format date values
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Helper function to get initials
  const getInitials = (name) => {
    if (!name) return "ST";
    const words = name.split(" ");
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    } else {
      return name.slice(0, 2).toUpperCase();
    }
  };

  // Calculate PnL percentage
  const calculatePnLPercentage = (stock) => {
    if (!stock.buy_price) return 0;
    const pnl = stock.realized_unrealized_pnl;
    const investment = stock.buy_value || stock.buy_price * stock.quantity;
    return (pnl / investment) * 100;
  };

  // Calculate tax amount (fallback if taxed_amount is not provided)
  const calculateTax = (stock) => {
    if (stock.taxed_amount !== undefined) {
      return stock.taxed_amount; // Use pre-calculated tax if available
    }

    const pnl = stock.realized_unrealized_pnl;
    if (pnl <= 0) return 0; // No tax on losses

    const buyDate = new Date(stock.buy_date);
    const endDate = stock.sell_date ? new Date(stock.sell_date) : new Date();
    const holdingDays = (endDate - buyDate) / (1000 * 60 * 60 * 24);
    const taxRate = holdingDays >= 365 ? 0.125 : 0.2; // 12.5% long-term, 20% short-term

    return pnl * taxRate;
  };

  // Component for Status Chip
  const StatusChip = ({ stock }) => {
    let baseClasses = "px-3 py-1 rounded-md text-xs font-medium uppercase";
    let colorClasses;
    let status;

    if (!stock.sell_price || !stock.sell_date) {
      status = "holding";
      colorClasses = "bg-blue-100 text-blue-800";
    } else {
      status = "sold";
      const pnl = stock.realized_unrealized_pnl;
      colorClasses =
        pnl >= 0 ? "bg-teal-100 text-teal-800" : "bg-red-100 text-red-800";
    }

    return <span className={`${baseClasses} ${colorClasses}`}>{status}</span>;
  };

  // Pagination logic
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = Array.isArray(data)
    ? data.slice(indexOfFirstItem, indexOfLastItem)
    : [];

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Pagination component
  const Pagination = () => {
    return (
      <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6">
        <div className="hidden sm:flex sm:flex-1 flex-col sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Showing{" "}
              <span className="font-medium">{indexOfFirstItem + 1}</span> to{" "}
              <span className="font-medium">
                {Math.min(indexOfLastItem, data.length)}
              </span>{" "}
              of <span className="font-medium">{data.length}</span> results
            </p>
          </div>
          <div>
            <nav
              className="inline-flex -space-x-px rounded-md shadow-sm"
              aria-label="Pagination"
            >
              <button
                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className={`relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ${
                  currentPage === 1 ? "cursor-not-allowed" : "hover:bg-gray-50"
                }`}
              >
                <HiChevronLeft className="h-5 w-5" aria-hidden="true" />
              </button>

              {[...Array(totalPages).keys()].map((number) => (
                <button
                  key={number + 1}
                  onClick={() => handlePageChange(number + 1)}
                  className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                    currentPage === number + 1
                      ? "bg-blue-50 text-blue-600 z-10"
                      : "text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  {number + 1}
                </button>
              ))}

              <button
                onClick={() =>
                  handlePageChange(Math.min(totalPages, currentPage + 1))
                }
                disabled={currentPage === totalPages}
                className={`relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ${
                  currentPage === totalPages
                    ? "cursor-not-allowed"
                    : "hover:bg-gray-50"
                }`}
              >
                <HiChevronRight className="h-5 w-5" aria-hidden="true" />
              </button>
            </nav>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full">
      <div className="overflow-x-auto shadow-sm rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Company
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Buy Date
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Buy Price
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Sell Date
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Sell Price
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Quantity
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Status
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                P&L
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Tax
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentItems.length > 0 ? (
              currentItems.map((stock, index) => (
                <tr key={stock.id || index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-8 w-8 bg-[#020117] text-white rounded-full flex items-center justify-center text-sm font-medium">
                        {getInitials(stock.stock_name)}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {stock.stock_name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {stock.ISIN}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(stock.buy_date)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatCurrency(stock.buy_price)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(stock.sell_date)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {stock.sell_price ? formatCurrency(stock.sell_price) : "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {stock.quantity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusChip stock={stock} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div
                      className={`flex items-center text-sm ${
                        stock.realized_unrealized_pnl >= 0
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      {stock.realized_unrealized_pnl >= 0 ? (
                        <HiArrowUp className="mr-1 h-4 w-4" />
                      ) : (
                        <HiArrowDown className="mr-1 h-4 w-4" />
                      )}
                      <span>
                        {formatCurrency(stock.realized_unrealized_pnl)}
                      </span>
                      <span className="ml-1">
                        ({calculatePnLPercentage(stock).toFixed(2)}%)
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatCurrency(calculateTax(stock))}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center space-x-2">
                      <button className="text-blue-600 hover:text-blue-800">
                        More Details
                      </button>
                      <div className="relative">
                        <button className="text-gray-500 hover:bg-gray-100 p-1 rounded-full">
                          <HiOutlineEllipsisHorizontal className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="10" // Updated to 10 due to new Tax column
                  className="px-6 py-4 text-center text-sm text-gray-500"
                >
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
        {data.length > itemsPerPage && <Pagination />}
      </div>
    </div>
  );
}
