import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../Hooks/use-auth";

const ProtectedRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          background: "#e0daf9",
          fontSize: "14px",
          color: "#6344e3",
          fontWeight: 600,
        }}
      >
        Loading...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
