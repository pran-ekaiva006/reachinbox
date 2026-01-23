import { NavLink, Outlet } from "react-router-dom";
import Header from "../components/Header";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <nav className="border-b bg-white px-8">
        <div className="flex gap-8">
          <NavLink
            to="scheduled"
            className={({ isActive }) =>
              `py-4 text-sm font-medium transition ${
                isActive
                  ? "border-b-2 border-indigo-600 text-indigo-600"
                  : "text-gray-600 hover:text-gray-900"
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
                  ? "border-b-2 border-indigo-600 text-indigo-600"
                  : "text-gray-600 hover:text-gray-900"
              }`
            }
          >
            Sent
          </NavLink>
        </div>
      </nav>

      <main className="p-8">
        <Outlet />
      </main>
    </div>
  );
}