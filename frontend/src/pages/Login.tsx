import { useAuth } from "../auth/AuthProvider";
import "../styles/login.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const { login, user, loading } = useAuth();
  const [signingIn, setSigningIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      navigate("/scheduled", { replace: true });
    }
  }, [user, loading, navigate]);

  const handleLogin = async () => {
    setSigningIn(true);
    try {
      await login();
      // Navigation will happen automatically via the useEffect above
    } catch (e) {
      console.error("Login error:", e);
      alert("Login failed. Please try again.");
      setSigningIn(false);
    }
  };

  if (loading) {
    return (
      <div className="login-page">
        <div className="login-card">Loading…</div>
      </div>
    );
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-title">ReachInbox</div>
        <div className="login-subtitle">
          Sign in to manage and schedule your email campaigns
        </div>
        <button className="google-btn" onClick={handleLogin} disabled={signingIn}>
          <svg width="20" height="20" viewBox="0 0 48 48">
            <g>
              <path fill="#4285F4" d="M44.5 20H24v8.5h11.7C34.1 33.1 29.7 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.5 6.5 29.5 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c11 0 19.7-8 19.7-20 0-1.3-.1-2.7-.2-4z"/>
              <path fill="#34A853" d="M6.3 14.7l7 5.1C15.6 16.1 19.5 13 24 13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.5 6.5 29.5 4 24 4c-7.1 0-13.1 4.1-16.2 10.7z"/>
              <path fill="#FBBC05" d="M24 44c5.5 0 10.5-1.8 14.4-4.9l-6.7-5.5C29.8 35.9 27 37 24 37c-5.7 0-10.1-2.9-11.7-7.5l-7 5.4C7 39.9 14.2 44 24 44z"/>
              <path fill="#EA4335" d="M44.5 20H24v8.5h11.7c-1.1 3.1-4.1 5.5-7.7 5.5-5.7 0-10.1-2.9-11.7-7.5l-7 5.4C7 39.9 14.2 44 24 44c11 0 19.7-8 19.7-20 0-1.3-.1-2.7-.2-4z"/>
            </g>
          </svg>
          {signingIn ? "Signing in..." : "Continue with Google"}
        </button>
        <div className="login-footer">
          By continuing, you agree to our Terms and Privacy Policy.
        </div>
      </div>
    </div>
  );
}