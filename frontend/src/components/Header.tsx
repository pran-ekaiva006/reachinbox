import { NavLink, Outlet } from "react-router-dom";
import Header from "../components/Header";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navbar */}
      <Header />

      {/* Tabs */}
      <div className="border-b bg-white px-6">
        <nav className="flex gap-8">
          <NavLink
            end
            to=""
            className={({ isActive }) =>
              `py-4 text-sm font-medium transition ${
                isActive
                  ? "border-b-2 border-black text-black"
                  : "text-gray-500 hover:text-black"
              }`
            }
          >
            Scheduled
          </NavLink>

          <NavLink
            to="sent"
            className={({ isActive }) =>
              `py-4 text-sm font-medium transition ${
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

      {/* Page Content */}
      <main className="p-6 max-w-6xl mx-auto">
        <Outlet />
      </main>
    </div>
  );
}