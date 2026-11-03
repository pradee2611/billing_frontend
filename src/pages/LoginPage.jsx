import { useState } from "react";
import { login } from "../api/client.js";
import BrandLogo, { BrandName } from "../components/BrandLogo.jsx";

export default function LoginPage({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await login(username.trim(), password);
      onLogin();
    } catch (err) {
      setError(err.message === "Failed to fetch" ? "Could not reach the server. Is the backend running?" : err.message);
      setBusy(false);
    }
  };

  return (
    <div className="login-wrap">
      <form className="app-card login-card" onSubmit={submit}>
        <div className="text-center mb-4">
          <BrandLogo size={56} />
          <div className="mt-2"><BrandName className="brand-name-lg" /></div>
          <div className="text-secondary small mt-1">Sign in to start billing</div>
        </div>

        <label className="form-label small fw-semibold" htmlFor="login-user">Username</label>
        <input
          id="login-user"
          className="form-control form-control-lg mb-3"
          autoFocus
          autoComplete="username"
          autoCapitalize="none"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <label className="form-label small fw-semibold" htmlFor="login-pass">Password</label>
        <input
          id="login-pass"
          type="password"
          className="form-control form-control-lg mb-3"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <div className="alert alert-danger py-2 small" role="alert">{error}</div>}

        <button className="btn btn-primary btn-lg w-100" disabled={busy || !username || !password}>
          {busy ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}
