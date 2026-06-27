import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "../Pages/Auth/login";
import Signup from "../Pages/Auth/sign-up";
import Dashboard from "../Pages/Dashboard/dashboard";

import AuthLayout from "../Layout/auth-layout";
import AppLayout from "../Layout/app-layout";
import ProtectedRoute from "../Layout/protected-route";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes with brand + form layout */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Route>

        {/* Protected routes with sidebar layout */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>
        </Route>

        {/* Default redirect */}
        <Route path="*" element={<Navigate to="/signup" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
