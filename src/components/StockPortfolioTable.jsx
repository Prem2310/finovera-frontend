import React, { useState } from "react";
import { HiOutlineEllipsisHorizontal } from "react-icons/hi2";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi2";
import { useGetUserTrnasMutation } from "../hooks/mutations/useGetUserTrnasMutation";

const StockPortfolioTable = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [anchorEl, setAnchorEl] = useState(null);
  const [activeRow, setActiveRow] = useState(null);
  const pageSize = 8;
  const { transactionData, isLoading } = useGetUserTrnasMutation();
  console.log(transactionData);

  const rows = [
    {
      id: 1,
      company: "Rail Vikas Nigma",
      buyDate: "Mar 3, 2024",
      buyPrice: "₹145.20",
      quantity: "300",
      status: "holding",
      returns: "32.12%",
    },
    {
      id: 2,
      company: "Tata Motors Ltd",
      buyDate: "Feb 15, 2024",
      buyPrice: "₹789.50",
      quantity: "100",
      status: "sold",
      returns: "18.75%",
    },
    {
      id: 3,
      company: "Infosys Technologies",
      buyDate: "Jan 7, 2024",
      buyPrice: "₹1560.30",
      quantity: "50",
      status: "holding",
      returns: "5.23%",
    },
    {
      id: 4,
      company: "Reliance Industries",
      buyDate: "Dec 20, 2023",
      buyPrice: "₹2456.75",
      quantity: "25",
      status: "holding",
      returns: "9.87%",
    },
    {
      id: 5,
      company: "HDFC Bank",
      buyDate: "Nov 5, 2023",
      buyPrice: "₹1678.40",
      quantity: "75",
      status: "sold",
      returns: "22.31%",
    },
    {
      id: 6,
      company: "Bharti Airtel",
      buyDate: "Oct 12, 2023",
      buyPrice: "₹876.25",
      quantity: "150",
      status: "holding",
      returns: "15.64%",
    },
    {
      id: 7,
      company: "ITC Limited",
      buyDate: "Sep 8, 2023",
      buyPrice: "₹356.80",
      quantity: "500",
      status: "holding",
      returns: "7.92%",
    },
    {
      id: 8,
      company: "Wipro Ltd",
      buyDate: "Aug 22, 2023",
      buyPrice: "₹567.90",
      quantity: "200",
      status: "sold",
      returns: "-3.45%",
    },
    {
      id: 9,
      company: "State Bank of India",
      buyDate: "Jul 17, 2023",
      buyPrice: "₹543.60",
      quantity: "250",
      status: "holding",
      returns: "28.76%",
    },
    {
      id: 10,
      company: "Mahindra & Mahindra",
      buyDate: "Jun 5, 2023",
      buyPrice: "₹987.30",
      quantity: "80",
      status: "holding",
      returns: "11.23%",
    },
  ];

  // Pagination
  const totalPages = Math.ceil(rows.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const displayedRows = rows.slice(startIndex, startIndex + pageSize);

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Menu functions
  const handleClick = (event, row) => {
    setAnchorEl(event.currentTarget);
    setActiveRow(row);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setActiveRow(null);
  };

  const handleMoreDetails = () => {
    console.log("More Details for row:", activeRow);
    handleClose();
  };

  // Helper function to get initials
  const getInitials = (name) => {
    const words = name.split(" ");
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    } else {
      return name.slice(0, 2).toUpperCase();
    }
  };

  // Component for Status Chip
  const StatusChip = ({ value, returns }) => {
    let baseClasses = "px-3 py-1 rounded-md text-xs font-medium uppercase";
    let colorClasses;
    let label = value;

    if (value === "holding") {
      colorClasses = "bg-blue-100 text-blue-800";
    } else if (value === "sold") {
      const returnsValue = parseFloat(returns);
      if (returnsValue >= 0) {
        colorClasses = "bg-teal-100 text-teal-800";
      } else {
        colorClasses = "bg-red-100 text-red-800";
      }
      label = "Sold";
    }

    return <span className={`${baseClasses} ${colorClasses}`}>{label}</span>;
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
                Returns
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
            {displayedRows.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-8 w-8 bg-[#020117] text-white rounded-full flex items-center justify-center text-sm font-medium">
                      {getInitials(row.company)}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {row.company}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {row.buyDate}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {row.buyPrice}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {row.quantity}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <StatusChip value={row.status} returns={row.returns} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {row.returns}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex items-center space-x-2">
                    <button className="text-blue-600 hover:text-blue-800">
                      More Details
                    </button>
                    <div className="relative">
                      <button
                        className="text-gray-500 hover:bg-gray-100 p-1 rounded-full"
                        onClick={(e) => handleClick(e, row)}
                      >
                        <HiOutlineEllipsisHorizontal className="h-5 w-5" />
                      </button>
                      {anchorEl && activeRow?.id === row.id && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                          <div className="py-1">
                            <button
                              onClick={handleMoreDetails}
                              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              Option 1
                            </button>
                            <button
                              onClick={handleClose}
                              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              Option 2
                            </button>
                            <button
                              onClick={handleClose}
                              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              Option 3
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4 px-4">
        <div className="text-sm text-gray-700">
          Showing <span className="font-medium">{startIndex + 1}</span> to{" "}
          <span className="font-medium">
            {Math.min(startIndex + pageSize, rows.length)}
          </span>{" "}
          of <span className="font-medium">{rows.length}</span> results
        </div>
        <div>
          <nav
            className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
            aria-label="Pagination"
          >
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                currentPage === 1
                  ? "text-gray-300"
                  : "text-gray-500 hover:bg-gray-50"
              }`}
            >
              <span className="sr-only">Previous</span>
              <HiChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                currentPage === totalPages
                  ? "text-gray-300"
                  : "text-gray-500 hover:bg-gray-50"
              }`}
            >
              <span className="sr-only">Next</span>
              <HiChevronRight className="h-5 w-5" />
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default StockPortfolioTable;
