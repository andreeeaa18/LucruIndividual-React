import { NavLink, useNavigate } from "react-router";
import { useAuth } from "../../context/AuthContext";
import "./Nav.css";

export default function Nav() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <nav className="nav">
      <NavLink to="/" className="nav-logo">
        Should I know this?
      </NavLink>
      <div className="nav-links">
        {user ? (
          <>
            <NavLink
              to="/"
              className={({ isActive }) => (isActive ? "nav-active" : "")}
            >
              Home
            </NavLink>
            <NavLink
              to="/profile"
              className={({ isActive }) => (isActive ? "nav-active" : "")}
            >
              My Posts
            </NavLink>
            <NavLink
              to="/games"
              className={({ isActive }) => (isActive ? "nav-active" : "")}
            >
              Games
            </NavLink>
            <button onClick={handleLogout}>Logout</button>
            <span className="nav-hi-text">Hi, {user.name}!</span>
          </>
        ) : (
          <NavLink to="/login">Login</NavLink>
        )}
      </div>
    </nav>
  );
}
