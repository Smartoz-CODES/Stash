import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "../Pages/Auth/login";
import Signup from "../Pages/Auth/sign-up";
import Dashboard from "../Pages/Dashboard/dashboard";
import Profile from "../Pages/Profile/profile";
import ResourceDetail from "../Pages/Resource-detail/resource-detail";
import Library from "../Pages/Library/library";
import AuthLayout from "../Layout/auth-layout";
import AppLayout from "../Layout/app-layout";
import ProtectedRoute from "../Layout/protected-route";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Route>

        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/resource/:id" element={<ResourceDetail />} />
            <Route path="/library" element={<Library />} />
          </Route>
        </Route>

        {/* Default redirect */}
        <Route path="*" element={<Navigate to="/signup" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
