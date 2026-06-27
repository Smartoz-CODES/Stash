import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../Hooks/use-auth";
import "../Styles/protected-route.css";

const ProtectedRoute = () => {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading-screen"><p>Loading...</p></div>;
  if (!user) return <Navigate to="/login" replace />;
  return <Outlet />;
};

export default ProtectedRoute;