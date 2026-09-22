import { Navigate, Route, Routes } from "react-router-dom";

import Landing from "./pages/Landing";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ProtectedRoute from "./components/common/ProtectedRoute";
import AuthenticatedHeader from "./components/common/AuthenticatedHeader";

function MarketplacePlaceholder() {
  return (
    <div className="min-h-screen bg-slate-50">
      <AuthenticatedHeader />

      <main className="flex min-h-[calc(100vh-73px)] items-center justify-center px-5">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-slate-900">Marketplace</h1>

          <p className="mt-2 text-slate-600">
            Marketplace features are coming in Batch 3.
          </p>
        </div>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />

      <Route path="/login" element={<Login />} />

      <Route path="/register" element={<Register />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/marketplace" element={<MarketplacePlaceholder />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
