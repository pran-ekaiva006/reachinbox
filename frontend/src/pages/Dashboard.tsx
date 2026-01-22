import { NavLink, Outlet } from "react-router-dom";
import Header from "../components/Header";

export default function Dashboard() {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      {/* Navbar */}
      <Header />

      {/* Tabs */}
      <div className="border-b bg-white px-6">
        <nav className="flex gap-8">
          <NavLink
            to="/scheduled"
            className={({ isActive }) =>
              `py-4 text-sm font-medium ${
                isActive
                  ? "border-b-2 border-black text-black"
                  : "text-gray-500 hover:text-black"
              }`
            }
          >
            Scheduled
          </NavLink>

          <NavLink
            to="/sent"
            className={({ isActive }) =>
              `py-4 text-sm font-medium ${
                isActive
                  ? "border-b-2 border-black text-black"
                  : "text-gray-500 hover:text-black"
              }`
            }
          >
            Sent
          </NavLink>
        </nav>
      </div>

      {/* Scrollable content */}
      <main className="flex-1 overflow-y-auto p-6">
        <Outlet />
      </main>
    </div>
  );
}