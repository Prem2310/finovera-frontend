import { useSearchParams } from "react-router-dom";
import useCurrentCompanyData from "../hooks/useCurrentCompanyData";
import useRealTimeStockData from "../hooks/useRealTimeStockData";
import ColorValueIndicator from "../ui/ColorValueIndicator";
import TransactionTypeSelector from "../ui/TransactionTypeSelector";
import BuySellSwitch from "../ui/BuySellSwitch";
import { useState } from "react";

function StockTransactionAdder() {
  const [searchParams] = useSearchParams();
  const [isBuy, setIsBuy] = useState(true);
  const [transactionType, setTransactionType] = useState("delivery");

  const ISIN = searchParams.get("ISIN");
  const companySymbol = searchParams.get("symbol");

  const { companyData, isSearching } = useCurrentCompanyData({ companySymbol });
  const {
    stockData,
    isLoading: isLoadingStockData,
    error: stockDataError,
  } = useRealTimeStockData(ISIN);

  const companyInfo =
    Array.isArray(companyData) && companyData.length > 0 ? companyData[0] : {};

  const { nameofcompany, isinnumber, series, symbol, marketvalue, marketcap } =
    companyInfo;

  console.log("company data", companyData);
  console.log("stock data", stockData);

  return (
    <div className="flex flex-col w-full border rounded-md h-fit top-0 sticky">
      <div className="border-b w-full p-3">
        <div className="flex justify-between">
          <div>
            <p className="text-md font-medium">{nameofcompany}</p>
            <span className="leading-none">
              {" "}
              <ColorValueIndicator value={stockData.dayChange} />
              <ColorValueIndicator
                value={stockData.percentageChange}
                isPercentage={true}
              />{" "}
            </span>
          </div>
          <p className="text-xs text-gray-600">{isinnumber}</p>
        </div>
      </div>
      <div className="px-3 pt-6 pb-3">
        <div className="flex">
          <TransactionTypeSelector
            transactionType={transactionType}
            setTransactionType={setTransactionType}
          />
          <BuySellSwitch isBuy={isBuy} setIsBuy={setIsBuy} />
        </div>
        <form className="mt-6">
          <div className="w-full flex justify-between">
            <label className="text-sm text-gray-600" htmlFor="quantity">
              Quantity
            </label>
            <div>
              <input
                id="quantity"
                type="number"
                className="border bg-transparent rounded-md max-w-32 p-1 outline-none text-sm text-right textInput text-slate-800 font-medium"
              />
              <p className="no-spinners text-xs mt-1 text-right text-gray-600">
                Qty availabe{" "}
                <span className="font-medium text-gray-600">50</span>
              </p>
            </div>
          </div>
          <div className="w-full flex justify-between mt-8">
            <label className="text-sm text-gray-600" htmlFor="price">
              Price
            </label>
            <div>
              <input
                id="price"
                type="number"
                className="border bg-transparent rounded-md max-w-32 p-1 outline-none text-sm text-right textInput text-slate-800 font-medium"
              />
            </div>
          </div>
          <button
            className={`w-full py-2 mt-16 rounded-md items-center border transition-all ease-in font-medium uppercase ${
              isBuy
                ? "bg-green-600 text-white hover:bg-green-700"
                : "text-red-500 hover:bg-slate-100"
            }`}
          >
            {isBuy ? "Buy" : "Sell"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default StockTransactionAdder;
