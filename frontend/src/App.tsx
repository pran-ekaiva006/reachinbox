import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Scheduled from "./pages/Scheduled";
import Sent from "./pages/Sent";
import RequireAuth from "./auth/RequireAuth";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route
        path="/"
        element={
          <RequireAuth>
            <Dashboard />
          </RequireAuth>
        }
      >
        <Route index element={<Navigate to="scheduled" replace />} />
        <Route path="scheduled" element={<Scheduled />} />
        <Route path="sent" element={<Sent />} />
      </Route>
    </Routes>
  );
}