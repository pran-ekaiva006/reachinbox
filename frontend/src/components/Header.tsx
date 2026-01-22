import { useAuth } from "../auth/AuthProvider";

export default function Header() {
  const { user, logout } = useAuth();

  if (!user) {
    return (
      <header className="flex justify-between items-center px-6 py-4 border-b">
        <h1 className="text-xl font-semibold">ReachInbox</h1>
      </header>
    );
  }

  return (
    <header className="flex justify-between items-center px-6 py-4 border-b">
      <h1 className="text-xl font-semibold">ReachInbox</h1>

      <div className="flex items-center gap-3">
        {user.photoURL && (
          <img
            src={user.photoURL}
            alt="avatar"
            className="w-8 h-8 rounded-full"
          />
        )}

        <span className="text-sm text-gray-700">{user.email}</span>

        <button
          onClick={logout}
          className="text-sm text-red-500 hover:underline"
        >
          Logout
        </button>
      </div>
    </header>
  );
}