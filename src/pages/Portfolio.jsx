import React, { useState } from "react";
import PageHeading from "../components/ui/PageHeading";
import Button from "../components/Button";
import ConnectAngelModal from "../components/ConnectAngelModal";
import { useConnectAngelMutation } from "../hooks/mutations/useConnectAngelMutation";
import FullScreenLoader from "../components/ui/FullScreenLoader";
import { HiLink } from "react-icons/hi";
import toast from "react-hot-toast";
import angel from "../assets/angel.svg";
import { HiArrowDown, HiArrowUp, HiBars3, HiChartPie } from "react-icons/hi2";
import HoldingsChart from "../components/HoldingsChart";
import PieChartComponent from "../components/PieChartComponent";
import HoldingsTable from "../components/HoldingsTable";
import TransactionsChart from "../components/TransactionsChart";
import { useGetUserTrnasMutation } from "../hooks/mutations/useGetUserTrnasMutation";

const mockData = {
  status: true,
  message: "SUCCESS",
  data: {
    holdings: [
      {
        tradingsymbol: "HUDCO-EQ",
        exchange: "NSE",
        isin: "INE031A01017",
        t1quantity: 0,
        realisedquantity: 108,
        quantity: 108,
        authorisedquantity: 0,
        product: "DELIVERY",
        collateralquantity: null,
        collateraltype: null,
        haircut: 0,
        averageprice: 289.72,
        ltp: 202.8,
        symboltoken: "20825",
        close: 202.8,
        profitandloss: -9387,
        pnlpercentage: -30,
      },
      {
        tradingsymbol: "NYKAA-EQ",
        exchange: "NSE",
        isin: "INE388Y01029",
        t1quantity: 0,
        realisedquantity: 540,
        quantity: 540,
        authorisedquantity: 0,
        product: "DELIVERY",
        collateralquantity: null,
        collateraltype: null,
        haircut: 0,
        averageprice: 203.36,
        ltp: 172.52,
        symboltoken: "6545",
        close: 172.52,
        profitandloss: -16651,
        pnlpercentage: -15.16,
      },
      {
        tradingsymbol: "JIOFIN-EQ",
        exchange: "NSE",
        isin: "INE758E01017",
        t1quantity: 0,
        realisedquantity: 99,
        quantity: 99,
        authorisedquantity: 0,
        product: "DELIVERY",
        collateralquantity: null,
        collateraltype: null,
        haircut: 0,
        averageprice: 329.48,
        ltp: 229.12,
        symboltoken: "18143",
        close: 229.12,
        profitandloss: -9935,
        pnlpercentage: -30.46,
      },
      {
        tradingsymbol: "RELIANCE-EQ",
        exchange: "NSE",
        isin: "INE002A01018",
        t1quantity: 0,
        realisedquantity: 70,
        quantity: 70,
        authorisedquantity: 0,
        product: "DELIVERY",
        collateralquantity: null,
        collateraltype: null,
        haircut: 0,
        averageprice: 1511.63,
        ltp: 1276.35,
        symboltoken: "2885",
        close: 1276.35,
        profitandloss: -16470,
        pnlpercentage: -15.56,
      },
    ],
    totalholding: {
      totalholdingvalue: 227090.58,
      totalinvvalue: 279536.78,
      totalprofitandloss: -52443,
      totalpnlpercentage: -18.76,
    },
  },
};

// CSV transaction data
const csvTransactionData = [
  {
    ISIN: "INE129A01019",
    buy_date: "2024-03-14",
    buy_price: 174,
    buy_value: 1740,
    created_at: "2025-03-23T04:10:27.388123+00:00",
    current_value: 0,
    id: 1231,
    quantity: 10,
    realized_unrealized_pnl: 380,
    sell_date: "2024-04-18",
    sell_price: 212,
    sell_value: 2120,
    stock_name: "GAIL (INDIA) LTD",
    taxed_amount: 76,
    username: "fe",
  },
];

function Portfolio() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [showTransactions, setShowTransactions] = useState(false);

  const [message, setMessage] = useState(null);
  const [responseData, setResponseData] = useState(null);
  const { transactionData, isLoading } = useGetUserTrnasMutation();
  const { mutate: useAngelMutate, isLoading: isAngelLoading } =
    useConnectAngelMutation();

  const handleConnect = (formData) => {
    const connectData = {
      client_id: formData.client_id,
      mpin: formData.mpin,
      api_key: formData.api_key,
      totp_secret: formData.totp_secret,
      access_token: localStorage.getItem("access_token"),
    };

    useAngelMutate(connectData, {
      onSuccess: (res) => {
        setResponseData(res); // <-- save response
        setMessage("Successfully connected to AngelOne!");
        toast.success("Connected to AngelOne successfully");
        setIsModalOpen(false);
      },
      onError: (err) => {
        setMessage("Failed to connect. Please try again.");
        toast.error(
          `Failed to connect to AngelOne: ${
            err?.response?.data?.detail || err.message
          }`
        );
        console.error(err);
      },
    });
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  const { holdings, totalholding } = responseData?.data || mockData.data;

  if (isAngelLoading) {
    return <FullScreenLoader />;
  }

  if(isLoading) {
     return <FullScreenLoader />;
  }

  return (
    <div>
      <div className=" justify-between">
        <PageHeading>Portfolio and Tracking</PageHeading>
        <div className="flex gap-4 items-center">
          {console.log(responseData)}
          {message ? (
            <div className="text-green-500 border px-2 rounded">
              {responseData.message}
            </div>
          ) : (
            <div className="text-red-500 border px-2 rounded">
              NOT CONNECTED
            </div>
          )}
          <Button
            onClick={() => setIsModalOpen(true)}
            type="outline"
            className="w-fit font-semibold flex items-center gap-2"
            icon={<HiLink className="text-lg" />}
          >
            <span>Connect to</span>
            <img
              src={angel}
              alt="AngelOne"
              className="h-4 w-24 object-contain"
            />
          </Button>
        </div>
        <div className="flex min-h-screen w-full flex-col bg-gray-50">
          <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                Portfolio Dashboard
              </h2>
              <div className="flex items-center space-x-2">
                <div className="bg-white rounded-lg shadow p-1">
                  <div className="flex space-x-1">
                    <button
                      onClick={() => setActiveTab("overview")}
                      className={`px-4 py-2 text-sm font-medium rounded-md ${
                        activeTab === "overview"
                          ? "bg-gray-100 text-gray-900"
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      Overview
                    </button>
                    <button
                      onClick={() => setActiveTab("analytics")}
                      className={`px-4 py-2 text-sm font-medium rounded-md ${
                        activeTab === "analytics"
                          ? "bg-gray-100 text-gray-900"
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      Analytics
                    </button>
                    <button
                      onClick={() => setActiveTab("transactions")}
                      className={`px-4 py-2 text-sm font-medium rounded-md ${
                        activeTab === "transactions"
                          ? "bg-gray-100 text-gray-900"
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      Transactions
                    </button>
                  </div>
                </div>
              </div>
            </div>
            {isAngelLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
              </div>
            ) : !responseData && activeTab !== "transactions" ? (
              <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                <div className="text-xl font-medium mb-2">
                  No Portfolio Data
                </div>
                <p className="text-sm text-center max-w-md">
                  Connect your AngelOne account to view your portfolio details
                </p>
              </div>
            ) : (
              <>
                {activeTab === "overview" && (
                  <div className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                      {/* Total Holdings Value Card */}
                      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                        <div className="p-6">
                          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <p className="text-sm font-medium text-gray-500">
                              Total Holdings Value
                            </p>
                            <HiBars3 className="h-4 w-4 text-gray-400" />
                          </div>
                          <div className="text-2xl font-bold text-gray-900">
                            {formatCurrency(totalholding?.totalholdingvalue)}
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            Current market value
                          </p>
                        </div>
                      </div>

                      {/* Total Investment Card */}
                      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                        <div className="p-6">
                          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <p className="text-sm font-medium text-gray-500">
                              Total Investment
                            </p>
                            <HiChartPie className="h-4 w-4 text-gray-400" />
                          </div>
                          <div className="text-2xl font-bold text-gray-900">
                            {formatCurrency(totalholding?.totalinvvalue)}
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            Initial investment amount
                          </p>
                        </div>
                      </div>

                      {/* Total P&L Card */}
                      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                        <div className="p-6">
                          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <p className="text-sm font-medium text-gray-500">
                              Total P&L
                            </p>
                            {totalholding?.totalprofitandloss >= 0 ? (
                              <HiArrowUp className="h-4 w-4 text-green-500" />
                            ) : (
                              <HiArrowDown className="h-4 w-4 text-red-500" />
                            )}
                          </div>
                          <div
                            className={`text-2xl font-bold ${
                              totalholding?.totalprofitandloss >= 0
                                ? "text-green-500"
                                : "text-red-500"
                            }`}
                          >
                            {formatCurrency(totalholding?.totalprofitandloss)}
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            Total profit/loss
                          </p>
                        </div>
                      </div>

                      {/* P&L Percentage Card */}
                      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                        <div className="p-6">
                          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <p className="text-sm font-medium text-gray-500">
                              P&L Percentage
                            </p>
                            {totalholding?.totalpnlpercentage >= 0 ? (
                              <HiArrowUp className="h-4 w-4 text-green-500" />
                            ) : (
                              <HiArrowDown className="h-4 w-4 text-red-500" />
                            )}
                          </div>
                          <div
                            className={`text-2xl font-bold ${
                              totalholding?.totalpnlpercentage >= 0
                                ? "text-green-500"
                                : "text-red-500"
                            }`}
                          >
                            {totalholding?.totalpnlpercentage.toFixed(2)}%
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            Return on investment
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                      {/* P&L Chart */}
                      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden col-span-4">
                        <div className="p-6">
                          <h3 className="text-lg font-semibold text-gray-900">
                            P&L by Holdings
                          </h3>
                          <p className="text-sm text-gray-500">
                            Profit and loss for each stock in your portfolio
                          </p>
                          <div className="mt-4">
                            <HoldingsChart holdings={holdings} />
                          </div>
                        </div>
                      </div>

                      {/* Portfolio Allocation Chart */}
                      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden col-span-3">
                        <div className="p-6">
                          <h3 className="text-lg font-semibold text-gray-900">
                            Portfolio Allocation
                          </h3>
                          <p className="text-sm text-gray-500">
                            Current allocation by market value
                          </p>
                          <div className="mt-4">
                            <PieChartComponent holdings={holdings} />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Holdings Table */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                      <div className="p-6">
                        <h3 className="text-lg font-semibold text-gray-900">
                          Holdings Details
                        </h3>
                        <p className="text-sm text-gray-500 mb-4">
                          Detailed view of all your stock holdings
                        </p>
                        <HoldingsTable holdings={holdings} />
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "analytics" && (
                  <div className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {/* Performance Analysis Card */}
                      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden col-span-2">
                        <div className="p-6">
                          <h3 className="text-lg font-semibold text-gray-900">
                            Performance Analysis
                          </h3>
                          <p className="text-sm text-gray-500">
                            Detailed performance metrics for your portfolio
                          </p>
                          <div className="h-[300px] flex items-center justify-center text-gray-400 mt-4">
                            Analytics view coming soon
                          </div>
                        </div>
                      </div>

                      {/* Sector Allocation Card */}
                      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                        <div className="p-6">
                          <h3 className="text-lg font-semibold text-gray-900">
                            Sector Allocation
                          </h3>
                          <p className="text-sm text-gray-500">
                            Portfolio distribution by sectors
                          </p>
                          <div className="h-[300px] flex items-center justify-center text-gray-400 mt-4">
                            Sector data not available
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "transactions" && (
                  <div className="space-y-4">
                    {/* Transactions Summary */}
                    <TransactionsChart transactions={transactionData} />
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden col-span-3">
                        <div className="p-6">
                          <h3 className="text-lg font-semibold text-gray-900">
                            CSV Transactions Summary
                          </h3>
                          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mt-4">
                            {/* Total Transactions */}
                            <div className="bg-gray-50 rounded-lg p-4">
                              <p className="text-sm font-medium text-gray-500">
                                Total Transactions
                              </p>
                              <div className="text-2xl font-bold text-gray-900">
                                {csvTransactionData.length}
                              </div>
                            </div>

                            {/* Total Investment */}
                            <div className="bg-gray-50 rounded-lg p-4">
                              <p className="text-sm font-medium text-gray-500">
                                Total Investment
                              </p>
                              <div className="text-2xl font-bold text-gray-900">
                                {formatCurrency(
                                  csvTransactionData.reduce(
                                    (sum, item) => sum + item.buy_value,
                                    0
                                  )
                                )}
                              </div>
                            </div>

                            {/* Total Returns */}
                            <div className="bg-gray-50 rounded-lg p-4">
                              <p className="text-sm font-medium text-gray-500">
                                Total Returns
                              </p>
                              <div className="text-2xl font-bold text-gray-900">
                                {formatCurrency(
                                  csvTransactionData.reduce(
                                    (sum, item) => sum + item.sell_value,
                                    0
                                  )
                                )}
                              </div>
                            </div>

                            {/* Total P&L */}
                            <div className="bg-gray-50 rounded-lg p-4">
                              <p className="text-sm font-medium text-gray-500">
                                Total P&L
                              </p>
                              <div
                                className={`text-2xl font-bold ${
                                  csvTransactionData.reduce(
                                    (sum, item) =>
                                      sum + item.realized_unrealized_pnl,
                                    0
                                  ) >= 0
                                    ? "text-green-500"
                                    : "text-red-500"
                                }`}
                              >
                                {formatCurrency(
                                  csvTransactionData.reduce(
                                    (sum, item) =>
                                      sum + item.realized_unrealized_pnl,
                                    0
                                  )
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Transaction P&L Chart */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                      <div className="p-6">
                        <h3 className="text-lg font-semibold text-gray-900">
                          Transaction P&L
                        </h3>
                        <p className="text-sm text-gray-500">
                          Profit and loss for each transaction
                        </p>
                        <div className="mt-4">
                          <HoldingsChart
                            holdings={csvTransactionData.map((transaction) => ({
                              tradingsymbol: transaction.stock_name,
                              profitandloss:
                                transaction.realized_unrealized_pnl,
                              pnlpercentage: (
                                (transaction.realized_unrealized_pnl /
                                  transaction.buy_value) *
                                100
                              ).toFixed(2),
                            }))}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Transaction Details Table */}
                    {/* <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                      <div className="p-6">
                        <h3 className="text-lg font-semibold text-gray-900">
                          Transaction Details
                        </h3>
                        <p className="text-sm text-gray-500 mb-4">
                          Details of all your CSV transactions
                        </p>
                        <div className="overflow-x-auto">
                          <table className="min-w-full bg-white border border-gray-200">
                            <thead>
                              <tr className="bg-gray-100">
                                <th className="py-2 px-4 border text-left">
                                  Stock Name
                                </th>
                                <th className="py-2 px-4 border text-left">
                                  Buy Date
                                </th>
                                <th className="py-2 px-4 border text-right">
                                  Buy Price
                                </th>
                                <th className="py-2 px-4 border text-right">
                                  Quantity
                                </th>
                                <th className="py-2 px-4 border text-left">
                                  Sell Date
                                </th>
                                <th className="py-2 px-4 border text-right">
                                  Sell Price
                                </th>
                                <th className="py-2 px-4 border text-right">
                                  P&L
                                </th>
                                <th className="py-2 px-4 border text-right">
                                  Tax
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {csvTransactionData.map((transaction, index) => (
                                <tr
                                  key={index}
                                  className={
                                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                                  }
                                >
                                  <td className="py-2 px-4 border">
                                    {transaction.stock_name}
                                  </td>
                                  <td className="py-2 px-4 border">
                                    {transaction.buy_date}
                                  </td>
                                  <td className="py-2 px-4 border text-right">
                                    ₹{transaction.buy_price}
                                  </td>
                                  <td className="py-2 px-4 border text-right">
                                    {transaction.quantity}
                                  </td>
                                  <td className="py-2 px-4 border">
                                    {transaction.sell_date}
                                  </td>
                                  <td className="py-2 px-4 border text-right">
                                    ₹{transaction.sell_price}
                                  </td>
                                  <td
                                    className={`py-2 px-4 border text-right ${
                                      transaction.realized_unrealized_pnl >= 0
                                        ? "text-green-500"
                                        : "text-red-500"
                                    }`}
                                  >
                                    ₹{transaction.realized_unrealized_pnl}
                                  </td>
                                  <td className="py-2 px-4 border text-right">
                                    ₹{transaction.taxed_amount}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div> */}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <ConnectAngelModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConnect={handleConnect}
      />
    </div>
  );
}

export default Portfolio;
