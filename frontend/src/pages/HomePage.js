// frontend/src/pages/HomePage.js

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../App.css";
import Nav from "../components/Nav";
import API, { getUploadURL } from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function HomePage() {

  const [darkMode, setDarkMode] = useState(false);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ FIX: user is now defined
  const { user } = useAuth();

  /* =============================
     LOAD SAVED THEME ON PAGE OPEN
  ============================= */
  useEffect(() => {
    const savedTheme = localStorage.getItem("user-theme");

    if (savedTheme === "dark") {
      document.body.classList.add("dark-mode");
      setDarkMode(true);
    } else {
      document.body.classList.remove("dark-mode");
      setDarkMode(false);
    }
  }, []);

  /* =============================
     FETCH POSTS FROM BACKEND
  ============================= */
  useEffect(() => {
    API.get("/posts")
      .then(res => setPosts(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  /* =============================
     THEME TOGGLE HANDLER
  ============================= */
  const toggleTheme = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);

    if (newMode) {
      document.body.classList.add("dark-mode");
      localStorage.setItem("user-theme", "dark");
    } else {
      document.body.classList.remove("dark-mode");
      localStorage.setItem("user-theme", "light");
    }
  };

  return (
    <>

      <main className="content-wrapper">

        {/* HERO SECTION */}
        <section className="hero">

          <div className="image-container">

            <a
              href="/pictures/light-mode-pic.png"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="/pictures/light-mode-pic.png"
                className="light-img theme-img"
                alt="Profile Light"
              />

              <img
                src="/pictures/dark-mode-pic.png"
                className="dark-img theme-img"
                alt="Profile Dark"
              />
            </a>

          </div>

          <div className="intro">
            <h2>HELLO, I'M CLAIRE</h2>

            <p>
              Welcome to my art portfolio! I love designing creative pieces and
              making crafts that express emotions, ideas, and imagination.
            </p>

            <div className="highlights">
              <h3>Key Highlights</h3>

              <ul>
                <li>Passion for creative design and handmade crafts</li>
                <li>Experience with drawing, DIY, and decorative art</li>
                <li>Enjoys experimenting with colors and textures</li>
                <li>Inspired by imagination and everyday life</li>
              </ul>

            </div>
          </div>
        </section>

        {/* CARDS SECTION */}
        <section className="cards">

          <div className="card">
            <h3>About My Art:</h3>
            <p>Learn more about my artistic journey and inspirations.</p>
          </div>

          <div className="card">
            <h3>Creative Process:</h3>
            <p>How I turn ideas into meaningful artworks.</p>
          </div>

          <div className="card">
            <h3>Join My Art Journey:</h3>
            <p>Sign up for updates and inspiration.</p>
          </div>

        </section>

        {/* POSTS SECTION */}
        <section className="posts-section">

          <h2>Latest Posts</h2>

          {loading && <p>Loading posts...</p>}

          {!loading && posts.length === 0 && (
            <p>No posts yet. Be the first to write one!</p>
          )}

          <div className="posts-grid">

            {posts.map(post => {

              const role = user?.role?.toLowerCase?.() || "";
              const isAdmin = role === "admin";
              const isOwner = user?._id === post?.author?._id;

              const canEdit = isAdmin || isOwner;

              return (
                <div key={post._id} className="post-card">

                  {/* IMAGE → OPEN POST */}
                  {post.image && (
                    <Link to={`/posts/${post._id}`}>
                      <img
                        src={getUploadURL(post.image)}
                        alt={post.title}
                      />
                    </Link>
                  )}

                  {/* TITLE → OPEN POST */}
                  <h3>
                    <Link to={`/posts/${post._id}`}>
                      {post.title}
                    </Link>
                  </h3>

                  <p>{post.body.substring(0, 120)}...</p>

                  <small>
                    By {post.author?.name} ·{" "}
                    {new Date(post.createdAt).toLocaleDateString()}
                  </small>

                  {/* ACTIONS */}
                  {/* ACTIONS */}
<div className="post-actions">

  <Link
    to={`/posts/${post._id}`}
    className="action-btn view-btn"
  >
    💬 View & Comment
  </Link>

  {canEdit && (
    <Link
      to={`/edit-post/${post._id}`}
      className="action-btn edit-btn"
    >
      ✏️ Edit Post
    </Link>
  )}

</div>

                </div>
              );
            })}

          </div>

        </section>

      </main>

      {/* FOOTER */}
      <footer>

        <div className="footer-content">
          <span>📧 email: deveraclaire00@gmail.com</span>
          <span>© 2026 Claire Denise De Vera - Student Portfolio Project</span>
        </div>

      </footer>
    </>
  );
}