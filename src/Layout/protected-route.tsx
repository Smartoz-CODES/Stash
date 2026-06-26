import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../Types/use-auth";

const ProtectedRoute = () => {
  const { user, loading } = useAuth();

    // Wait while Supabase checks if the user has a session
  if (loading) {
    return <div>Loading...</div>;
  }

   // User is not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

   // User is authenticated
  return <Outlet />;
};

export default ProtectedRoute;

