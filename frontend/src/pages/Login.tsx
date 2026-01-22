import { useState } from "react";
import { useAuth } from "../auth/AuthProvider";

export default function Login() {
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setLoading(true);
      await login();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm rounded-lg border bg-white p-8 shadow-sm">
        {/* Brand */}
        <h1 className="text-2xl font-semibold text-center mb-2">
          ReachInbox
        </h1>
        <p className="text-sm text-gray-500 text-center mb-6">
          Sign in to manage scheduled and sent emails
        </p>

        {/* Login Button */}
        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 rounded-md bg-black py-3 text-sm font-medium text-white hover:bg-gray-900 disabled:opacity-60"
        >
          {loading ? "Signing in…" : "Continue with Google"}
        </button>

        {/* Footer hint */}
        <p className="mt-6 text-xs text-gray-400 text-center">
          Secure Google authentication
        </p>
      </div>
    </div>
  );
}