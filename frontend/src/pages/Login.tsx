import { useAuth } from "../auth/AuthProvider";

export default function Login() {
  const { login } = useAuth();
  return (
    <div className="h-screen flex items-center justify-center">
      <button onClick={login} className="px-6 py-3 bg-black text-white rounded">
        Sign in with Google
      </button>
    </div>
  );
}