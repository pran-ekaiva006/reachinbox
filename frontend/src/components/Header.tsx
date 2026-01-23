import { useAuth } from "../auth/AuthProvider";

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="border-b border-gray-200 bg-white px-8 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600">
            <span className="text-lg font-bold text-white">R</span>
          </div>
          <h1 className="text-xl font-bold text-gray-900">ReachInbox</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100">
              <span className="text-sm font-medium text-indigo-600">
                {user?.email?.[0]?.toUpperCase()}
              </span>
            </div>
            <span className="text-sm font-medium text-gray-700">{user?.email}</span>
          </div>
          <button
            onClick={logout}
            className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 transition focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}