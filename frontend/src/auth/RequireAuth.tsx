import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";

export default function RequireAuth({
  children,
}: {
  children: React.ReactNode;
}) {
  const auth = useAuth();

  if (!auth) {
    throw new Error("RequireAuth must be used inside AuthProvider");
  }

  const { user, loading } = auth;

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-950">
        <p className="text-gray-400">Checking authentication…</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}