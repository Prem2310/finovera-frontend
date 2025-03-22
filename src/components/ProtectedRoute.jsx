import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("auth_token");
  const location = useLocation();

  if (!token) {
    // Redirect to the signin page, but save the location they were
    // trying to access so you can send them there after login
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
