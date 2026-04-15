import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../App.css";

export default function Nav() {
  const [darkMode, setDarkMode] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, loading } = useAuth();

  /* ==============================
      ROLE SYSTEM (FIXED)
  ============================== */
  const role = user?.role?.toLowerCase?.() || "";

  const isUser =
    user && (role === "user" || role === "member");

  const isAdmin = user && role === "admin";
  const isGuest = !user && !loading;

  /* ==============================
      THEME SYSTEM (YOUR CODE)
  ============================== */
  const applyTheme = (mode) => {
    const body = document.body;

    if (mode === "dark") {
      body.classList.add("dark-mode");
      localStorage.setItem("user-theme", "dark");
    } else {
      body.classList.remove("dark-mode");
      localStorage.setItem("user-theme", "light");
    }

    window.dispatchEvent(new Event("storage"));
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem("user-theme");
    const systemPrefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    if (savedTheme === "dark") applyTheme("dark");
    else if (savedTheme === "light") applyTheme("light");
    else applyTheme(systemPrefersDark ? "dark" : "light");
  }, []);

  const toggleTheme = () => {
    setDarkMode((prev) => !prev);

    const isDark = document.body.classList.contains("dark-mode");
    applyTheme(isDark ? "light" : "dark");
  };

  /* ==============================
      ACTIVE LINK
  ============================== */
  const isActive = (path) =>
    location.pathname === path ? "active" : "";

  /* ==============================
      LOADING
  ============================== */
  if (loading) {
    return (
      <header>
        <nav className="menu">
          <span>Loading...</span>
        </nav>
      </header>
    );
  }

  /* ==============================
      LOGOUT
  ============================== */
  const handleLogout = () => {
    logout();
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <header>
      <h1 className="title">
        Expressing Creativity Through Art and Crafts
      </h1>

      <nav className="menu">

        {/* COMMON LINKS */}
        <Link to="/home" className={isActive("/home")}>HOME</Link>
        <Link to="/about" className={isActive("/about")}>ABOUT</Link>

        {/* GUEST */}
        {isGuest && (
          <>
            <Link to="/contact" className={isActive("/contact")}>
              CONTACT
            </Link>
            <Link to="/register" className={isActive("/register")}>
              REGISTER
            </Link>
            <Link to="/login" className={isActive("/login")}>
              LOGIN
            </Link>
          </>
        )}

        {/* USER / MEMBER */}
        {isUser && (
          <>
            <Link to="/contact" className={isActive("/contact")}>
              CONTACT
            </Link>
            
            <Link
              to="/create-post"
              className={isActive("/create-post")}
            >
              CREATE POST
            </Link>

            <Link
              to="/profile"
              className={isActive("/profile")}
            >
              PROFILE
            </Link>

            <button onClick={handleLogout}>
              LOGOUT
            </button>
          </>
        )}

        {/* ADMIN */}
        {isAdmin && (
          <>

            <Link
              to="/create-post"
              className={isActive("/create-post")}
            >
              CREATE
            </Link>

            <Link
              to="/profile"
              className={isActive("/profile")}
            >
              PROFILE
            </Link>
            
            <Link to="/admin" className={isActive("/admin")}>
              ADMIN
            </Link>

            <button onClick={handleLogout}>
              LOGOUT
            </button>
          </>
        )} 

        {/* THEME TOGGLE */}
        <button className="theme-btn" onClick={toggleTheme}>
          ☀️ 🌙
        </button>

      </nav>
    </header>
  );
}