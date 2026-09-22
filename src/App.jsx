import { Navigate, Route, Routes } from "react-router-dom";

import Landing from "./pages/Landing";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Marketplace from "./pages/marketplace/Marketplace";
import ProductDetails from "./pages/marketplace/ProductDetails";
import ProtectedRoute from "./components/common/ProtectedRoute";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />

      <Route path="/login" element={<Login />} />

      <Route path="/register" element={<Register />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/marketplace" element={<Marketplace />} />
        <Route path="/marketplace/products/:id" element={<ProductDetails />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
