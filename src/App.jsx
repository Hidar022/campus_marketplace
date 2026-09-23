import { Navigate, Route, Routes } from "react-router-dom";

import Landing from "./pages/Landing";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

import Marketplace from "./pages/marketplace/Marketplace";
import ProductDetails from "./pages/marketplace/ProductDetails";

import EditProduct from "./pages/user/EditProduct";
import MyProducts from "./pages/user/MyProducts";
import Profile from "./pages/user/Profile";

import ProtectedRoute from "./components/common/ProtectedRoute";
import MarketplaceLayout from "./layouts/MarketplaceLayout";

import AdminRoute from "./components/common/AdminRoute";
import AdminLayout from "./layouts/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminUserDetails from "./pages/admin/AdminUserDetails";
import AdminProductDetails from "./pages/admin/AdminProductDetails";

export default function App() {
  return (
    <Routes>
      {/* Public pages */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected marketplace pages */}
      <Route element={<ProtectedRoute />}>
        <Route path="/marketplace" element={<Marketplace />} />

        <Route path="/marketplace/products/:id" element={<ProductDetails />} />

        <Route path="/marketplace/my-products" element={<MyProducts />} />

        <Route
          path="/marketplace/my-products/:id/edit"
          element={<EditProduct />}
        />

        <Route
          path="/marketplace/profile"
          element={
            <MarketplaceLayout>
              <Profile />
            </MarketplaceLayout>
          }
        />
      </Route>

      <Route element={<AdminRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/users/:id" element={<AdminUserDetails />} />
          <Route path="/admin/products/:id" element={<AdminProductDetails />} />
          <Route path="/admin/products" element={<AdminProducts />} />
        </Route>
      </Route>

      {/* Unknown routes */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
