import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Scheduled from "./pages/Scheduled";
import Sent from "./pages/Sent";
import RequireAuth from "./auth/RequireAuth";

export default function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <RequireAuth>
            <Dashboard />
          </RequireAuth>
        }
      >
        {/* Default route */}
        <Route index element={<Navigate to="scheduled" replace />} />

        {/* Tabs */}
        <Route path="scheduled" element={<Scheduled />} />
        <Route path="sent" element={<Sent />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}