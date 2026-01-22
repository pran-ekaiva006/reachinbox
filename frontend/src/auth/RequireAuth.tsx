import { ReactNode } from "react";
import { useAuth } from "./AuthProvider";

export default function RequireAuth({
  children,
}: {
  children: ReactNode;
}) {
  const auth = useAuth();

  if (!auth) {
    throw new Error("RequireAuth must be used inside AuthProvider");
  }

  const { user, loading, login } = auth;

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-gray-500">Checking authentication…</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-semibold">ReachInbox</h1>
        <p className="text-gray-600">Sign in to continue</p>
        <button
          onClick={login}
          className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Sign in with Google
        </button>
      </div>
    );
  }

  return <>{children}</>;
}