import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import AppLayout from "./pages/AppLayout";
import PageNotFound from "./pages/PageNotFound";
import React from 'react'
// import Setting from "./pages/Setting";
// import Portfolios from "./pages/Portfolios";
// import Analytics from "./pages/Analytics";
// import Support from "./pages/Support";
// import Transaction from "./pages/Transaction";
import Signup from "./pages/Signup";
import Signin from "./pages/Signin";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import SearchStocks from "./components/SearchStocks";
// import StockAnalytics from "./components/StockAnalytics";

const query = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={query}>
      <BrowserRouter>
        <Routes>
          <Route path="signup" element={<Signup />} />
          {/* <Route path="searchStocks" element={<SearchStocks />} /> */}
          <Route path="signin" element={<Signin />} />
          <Route path="/" element={<AppLayout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            {/* <Route path="dashboard/stocks" element={<StockAnalytics />} />
            <Route path="portfolios" element={<Portfolios />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="support" element={<Support />} />
            <Route path="transactions" element={<Transaction />} />
            <Route path="settings" element={<Setting />} /> */}
          </Route>
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
