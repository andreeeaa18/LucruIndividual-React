import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../../context/AuthContext";
import "./Login.css";

export default function Login() {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState("login");
  const [error, setError] = useState("");

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPass, setLoginPass] = useState("");

  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPass, setSignupPass] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await login(loginEmail.trim(), loginPass);
      navigate("/");
    } catch (err) {
      setError(err.message || "Login failed");
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await register(signupName.trim(), signupEmail.trim(), signupPass);
      navigate("/");
    } catch (err) {
      setError(err.message || "Signup failed");
    }
  };

  return (
    <div className="auth-wrap">
      <div className="auth-box">
        <h1>Blog</h1>
        <div className="auth-tabs">
          <button
            type="button"
            className={`auth-tab${tab === "login" ? " active" : ""}`}
            onClick={() => {
              setTab("login");
              setError("");
            }}
          >
            Login
          </button>
          <button
            type="button"
            className={`auth-tab${tab === "signup" ? " active" : ""}`}
            onClick={() => {
              setTab("signup");
              setError("");
            }}
          >
            Sign Up
          </button>
        </div>

        {error && <div className="auth-error">{error}</div>}

        {tab === "login" ? (
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="email@example.com"
                required
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                value={loginPass}
                onChange={(e) => setLoginPass(e.target.value)}
                placeholder="Password"
                required
              />
            </div>
            <button type="submit" className="btn" style={{ width: "100%" }}>
              Login
            </button>
          </form>
        ) : (
          <form onSubmit={handleSignup}>
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                value={signupName}
                onChange={(e) => setSignupName(e.target.value)}
                placeholder="Your name"
                required
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={signupEmail}
                onChange={(e) => setSignupEmail(e.target.value)}
                placeholder="email@example.com"
                required
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                value={signupPass}
                onChange={(e) => setSignupPass(e.target.value)}
                placeholder="******"
                required
              />
            </div>
            <button
              type="submit"
              className="btn btn-blue"
              style={{ width: "100%" }}
            >
              Create Account
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
