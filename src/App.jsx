import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import AppLayout from "./pages/AppLayout";
import PageNotFound from "./pages/PageNotFound";
import React, { useEffect } from "react";

import Signup from "./pages/Signup";
import Signin from "./pages/Signin";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import PreferenceForm from "./components/PreferenceForm";
import Analytics from "./pages/Analytics";
import Portfolio from "./pages/Portfolio";
import Watchlist from "./pages/Watchlist";
import Transaction from "./pages/Transaction";
import Chat from "./pages/Chat";
import Support from "./pages/Support";
import ProtectedRoute from "./components/ProtectedRoute";
import { setNavigate } from "./api/axiosInstance";
import { Toaster } from "react-hot-toast";


const query = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
    },
  },
});

// Create a wrapper component to set up the navigate function for axios
const AppWithNavigation = () => {
  const navigate = useNavigate();

  useEffect(() => {
    setNavigate(navigate);
  }, [navigate]);

  return (
    <Routes>
      <Route path="/signup" element={<Signup />} />
      <Route path="/signin" element={<Signin />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="/taxes" element={<Analytics />} />
        <Route path="/watchlist" element={<Watchlist />} />
        <Route path="/portfolios" element={<Portfolio />} />
        <Route path="/transactions" element={<Transaction />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/preference-form" element={<PreferenceForm />} />
        <Route path="/profile" element={<Profile />} />
      </Route>
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

function App() {
  return (
    <QueryClientProvider client={query}>
      <BrowserRouter>
        <AppWithNavigation />
      </BrowserRouter>
      <Toaster
        position="top-center"
        reverseOrder={false}
        gutter={8}
        toastOptions={{
          // Define default options
          className: "",
          duration: 5000,
          style: {
            background: "#fff",
            color: "#071928",
          },

          // Default options for specific types
          success: {
            duration: 5000,
            theme: {
              primary: "green",
              secondary: "black",
            },
          },
        }}
      />
    </QueryClientProvider>
  );
}

export default App;
