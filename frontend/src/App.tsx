import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Scheduled from "./pages/Scheduled";
import Sent from "./pages/Sent";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/scheduled" element={<Scheduled />} />
        <Route path="/sent" element={<Sent />} />
      </Routes>
    </BrowserRouter>
  );
}
