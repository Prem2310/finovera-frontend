import React, { useEffect, useRef, useState } from "react";
import { createChart, AreaSeries, CandlestickSeries } from "lightweight-charts";
import Button from "./Button";

const StockChart = ({ instrumentKey, stockName }) => {
  const chartContainerRef = useRef(null);
  const chartRef = useRef(null);
  const seriesRef = useRef(null);
  const [chartType, setChartType] = useState("candle"); // area or candle

  const fetchData = async () => {
    try {
      // Get today's date in YYYY-MM-DD format
      const today = new Date();
      const toDate = today.toISOString().split("T")[0];

      // Get date 30 days ago for historical data
      const fromDate = new Date();
      fromDate.setDate(today.getDate() - 3000);
      const fromDateFormatted = fromDate.toISOString().split("T")[0];

      console.log(
        `Fetching data for ${stockName} from ${fromDateFormatted} to ${toDate}`
      );

      // Note the reversed order: toDate is first, then fromDate
      const response = await fetch(
        `https://api.upstox.com/v2/historical-candle/NSE_EQ|${instrumentKey}/1minute/${toDate}/${fromDateFormatted}`
      );
      const result = await response.json();

      if (result.status === "success") {
        if (chartType === "candle") {
          // Format data for candlestick chart
          const chartData = result.data.candles.map((candle) => {
            const [timestamp, open, high, low, close] = candle;
            const time = new Date(timestamp).getTime() / 1000;
            return { time, open, high, low, close };
          });
          chartData.sort((a, b) => a.time - b.time);
          console.log(
            `Candlestick data fetched for ${stockName || instrumentKey}:`,
            chartData
          );
          return chartData;
        } else {
          // Format data for area chart
          const chartData = result.data.candles.map((candle) => {
            const [timestamp, open, high, low, close] = candle;
            const time = new Date(timestamp).getTime() / 1000;
            return { time, value: close };
          });
          chartData.sort((a, b) => a.time - b.time);
          console.log(
            `Area chart data fetched for ${stockName || instrumentKey}:`,
            chartData
          );
          return chartData;
        }
      } else {
        throw new Error(
          `API returned unsuccessful status: ${
            result.errors?.[0]?.message || "Unknown error"
          }`
        );
      }
    } catch (error) {
      console.error(
        `Error fetching data for ${stockName || instrumentKey}:`,
        error
      );
      return [];
    }
  };

  const initChart = async () => {
    if (!chartContainerRef.current) {
      console.error(
        `Chart container not ready for ${stockName || instrumentKey}`
      );
      return;
    }

    // Clear previous chart if it exists
    if (chartRef.current) {
      chartRef.current.remove();
      chartRef.current = null;
      seriesRef.current = null;
    }

    console.log(`Creating chart for ${stockName || instrumentKey}...`);
    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 400,
      layout: {
        textColor: "black",
        background: { type: "solid", color: "white" },
      },
      grid: {
        vertLines: { color: "#f0f0f0" },
        horzLines: { color: "#f0f0f0" },
      },
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
      },
    });
    chartRef.current = chart;

    // Add series based on chart type
    if (chartType === "candle") {
      seriesRef.current = chart.addSeries(CandlestickSeries, {
        upColor: "#26a69a",
        downColor: "#ef5350",
        borderVisible: false,
        wickUpColor: "#26a69a",
        wickDownColor: "#ef5350",
      });
    } else {
      seriesRef.current = chart.addSeries(AreaSeries, {
        lineColor: "#2962FF",
        topColor: "#2962FF",
        bottomColor: "rgba(41, 98, 255, 0.28)",
        lineWidth: 2,
      });
    }

    const data = await fetchData();
    if (data.length > 0) {
      seriesRef.current.setData(data);
      chart.timeScale().fitContent();
      console.log(
        `Data set and chart fitted for ${stockName || instrumentKey}`
      );
    } else {
      // Fallback static data
      if (chartType === "candle") {
        const fallbackData = [
          { time: 1642425322, open: 10, high: 12, low: 9, close: 11 },
          { time: 1642511722, open: 11, high: 14, low: 10, close: 13 },
          { time: 1642598122, open: 13, high: 15, low: 12, close: 14 },
          { time: 1642684522, open: 14, high: 16, low: 13, close: 15 },
        ];
        seriesRef.current.setData(fallbackData);
      } else {
        const fallbackData = [
          { time: 1642425322, value: 0 },
          { time: 1642511722, value: 8 },
          { time: 1642598122, value: 10 },
          { time: 1642684522, value: 20 },
        ];
        seriesRef.current.setData(fallbackData);
      }
      chart.timeScale().fitContent();
      console.log(`Fallback data set for ${stockName || instrumentKey}`);
    }
  };

  useEffect(() => {
    let mounted = true;

    initChart();

    // Handle window resize
    const handleResize = () => {
      if (chartRef.current && chartContainerRef.current) {
        chartRef.current.applyOptions({
          width: chartContainerRef.current.clientWidth,
        });
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      mounted = false;
      window.removeEventListener("resize", handleResize);
      if (chartRef.current) {
        console.log(`Cleaning up chart for ${stockName || instrumentKey}...`);
        chartRef.current.remove();
        chartRef.current = null;
        seriesRef.current = null;
      }
    };
  }, [instrumentKey, stockName, chartType]); // Re-run if instrumentKey, stockName, or chartType changes

  const handleChartTypeChange = (type) => {
    setChartType(type);
  };

  return (
    <div className="stock-chart-container" style={{ marginBottom: "20px" }}>
      <div
        className="chart-header"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "10px",
        }}
      >
        <h2>{stockName || "Stock"} Price Chart</h2>
        <div className="chart-controls flex gap-2">
          <Button
            onClick={() => handleChartTypeChange("area")}
            className={`chart-type-btn ${
              chartType === "area" ? "active bg-slate-900 text-white" : "border"
            }`}
            style={{
              padding: "6px 12px",
              marginRight: "8px",
              backgroundColor: chartType === "area" ? "#2962FF" : "#f0f0f0",
              color: chartType === "area" ? "white" : "black",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Area
          </Button>
          <Button
            onClick={() => handleChartTypeChange("candle")}
            className={`chart-type-btn ${
              chartType === "candle"
                ? "active bg-slate-900 text-white"
                : "border"
            }`}
            style={{
              padding: "6px 12px",
              backgroundColor: chartType === "candle" ? "#2962FF" : "#f0f0f0",
              color: chartType === "candle" ? "white" : "black",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Candlestick
          </Button>
        </div>
      </div>
      <div
        ref={chartContainerRef}
        className="chart-container"
        style={{ width: "100%", height: "400px" }}
      />
    </div>
  );
};

// Example usage with multiple stocks
// const MultiStockCharts = () => {
//   const stocks = [
//     { instrumentKey: "NSE_EQ|INE009A01021", name: "Infosys" },
//     { instrumentKey: "NSE_EQ|INE467B01029", name: "TCS" },
//     { instrumentKey: "NSE_EQ|INE030A01027", name: "Reliance" },
//     { instrumentKey: "NSE_EQ|INE040A01034", name: "HDFC Bank" },
//   ];

//   return (
//     <div style={{ padding: "20px" }}>
//       {stocks.map((stock) => (
//         <StockChart
//           key={stock.instrumentKey}
//           instrumentKey={stock.instrumentKey}
//           stockName={stock.name}
//         />
//       ))}
//     </div>
//   );
// };

export default StockChart;
