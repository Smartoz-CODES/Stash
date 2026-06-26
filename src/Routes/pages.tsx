import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "../Pages/Auth/login";
import Signup from "../Pages/Auth/sign-up";

import Dashboard from "../Pages/Dashboard/dashboard";
import ResourceDetail from "../Pages/Resource-detail/resource-detail";

import Layout from "../Layout/layout";
import ProtectedRoute from "../Layout/protected-route";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
      
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

     
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/resource/:id" element={<ResourceDetail />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
