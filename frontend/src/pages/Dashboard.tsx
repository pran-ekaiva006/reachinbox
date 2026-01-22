import { NavLink, Outlet } from "react-router-dom";
import Header from "../components/Header";
import PageContainer from "../components/PageContainer";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navbar */}
      <Header />

      {/* Tabs */}
      <div className="border-b bg-white">
        <PageContainer>
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
        </PageContainer>
      </div>

      {/* Page Content */}
      <main className="py-6">
        <PageContainer>
          <Outlet />
        </PageContainer>
      </main>
    </div>
  );
}