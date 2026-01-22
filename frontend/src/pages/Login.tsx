import { useAuth } from "../auth/AuthProvider";
import "../styles/login.css";

export default function Login() {
  const { login, loading } = useAuth();

  return (
    <div className="login-page">
      <div className="login-card">
        <h1 className="login-title">ReachInbox</h1>
        <p className="login-subtitle">
          Sign in to manage and schedule your email campaigns
        </p>

        <button
          className="google-btn"
          onClick={login}
          disabled={loading}
        >
          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            alt="Google"
            width="18"
            height="18"
          />
          Continue with Google
        </button>

        <button
          className="signup-btn"
          onClick={login}
          disabled={loading}
        >
          Create a new account
        </button>

        {loading && (
          <p className="login-footer">Signing you in…</p>
        )}

        <p className="login-footer">
          By continuing, you agree to our Terms & Privacy Policy.
        </p>
      </div>
    </div>
  );
}