import Header from "../components/Header";
import { Link, Outlet } from "react-router-dom";

export default function Dashboard() {
  return (
    <>
      <Header />
      <div className="p-6">
        <nav className="flex gap-6 mb-6">
          <Link to="scheduled">Scheduled</Link>
          <Link to="sent">Sent</Link>
        </nav>
        <Outlet />
      </div>
    </>
  );
}