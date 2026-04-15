import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API, { getUploadURL } from "../api/axios";

const EditPostPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  
  // State for the confirmation toast
  const [showSuccess, setShowSuccess] = useState(false);

  /* ================= THEME LOAD ================= */
  useEffect(() => {
    const saved = localStorage.getItem("user-theme");
    setDarkMode(saved === "dark");
  }, []);

  /* ================= LISTEN NAV THEME CHANGE ================= */
  useEffect(() => {
    const handleThemeChange = () => {
      const saved = localStorage.getItem("user-theme");
      setDarkMode(saved === "dark");
    };

    window.addEventListener("storage", handleThemeChange);
    return () => window.removeEventListener("storage", handleThemeChange);
  }, []);

  /* ================= FETCH POST ================= */
  useEffect(() => {
    let isMounted = true;

    const fetchPost = async () => {
      try {
        const res = await API.get(`/posts/${id}`);
        if (!isMounted) return;

        setTitle(res.data.title);
        setBody(res.data.body);
        setPreview(
          res.data.image
            ? getUploadURL(res.data.image)
            : ""
        );
      } catch {
        if (isMounted) setError("Failed to load post.");
      } finally {
        if (isMounted) setFetching(false);
      }
    };

    fetchPost();
    return () => { isMounted = false; };
  }, [id]);

  /* ================= IMAGE HANDLER ================= */
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);

    if (file) {
      const tempUrl = URL.createObjectURL(file);
      setPreview(tempUrl);
    }
  };

  /* ================= CLEANUP PREVIEW URL ================= */
  useEffect(() => {
    return () => {
      if (preview && preview.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  /* ================= UPDATE POST ================= */
  const handleUpdate = async (e) => {
    e.preventDefault();
    setError("");

    if (!title.trim() || !body.trim()) {
      setError("Title and body cannot be empty.");
      return;
    }

    setSaving(true);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("body", body);
      if (image) formData.append("image", image);

      await API.put(`/posts/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Show success toast instead of navigating
      setShowSuccess(true);
      
      // Hide the toast after 3 seconds
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);

    } catch (err) {
      setError("Failed to update post.");
    } finally {
      // Allow the user to click the button again
      setSaving(false);
    }
  };

  /* ================= STYLES ================= */
  const theme = {
    page: {
      minHeight: "100vh",
      padding: "40px 15px",
      display: "flex",
      justifyContent: "center",
      background: darkMode ? "#560032" : "#FAE8ED",
      position: "relative",
      overflow: "hidden",
    },

    successToast: {
      position: "fixed",
      top: "20px",
      right: "20px",
      backgroundColor: darkMode ? "#eca8b5" : "rgb(12, 75, 52)",
      color: darkMode ? "#560032" : "#f7c6d9",
      padding: "16px 30px",
      borderRadius: "50px",
      boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
      fontWeight: "bold",
      fontSize: "16px",
      zIndex: 2000,
      display: "flex",
      alignItems: "center",
      gap: "10px",
      opacity: showSuccess ? 1 : 0,
      transform: showSuccess ? "translateY(0)" : "translateY(-20px)",
      pointerEvents: "none",
      transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
    },

    container: {
      width: "100%",
      maxWidth: "850px",
    },

    header: {
      display: "flex",
      gap: "10px",
      marginBottom: "18px",
    },

    backBtn: {
      padding: "10px 14px",
      borderRadius: "20px",
      textDecoration: "none",
      fontSize: "14px",
      fontWeight: "bold",
      background: "#f7c6d9",
      color: "rgb(12, 75, 52)",
      border: "1px solid rgb(12, 75, 52)",
    },

    title: {
      textAlign: "center",
      marginBottom: "25px",
      fontSize: "25px",
      fontWeight: "700",
      color: darkMode ? "#fff" : "#000",
    },

    card: {
      background: darkMode ? "#2e091e" : "#f7c6d9",
      borderRadius: "18px",
      padding: "30px",
      boxSizing: "border-box",
      width: "100%",
      maxWidth: "850px",
      margin: "0 auto",
      boxShadow: darkMode
        ? "0 0 18px rgba(0,0,0,0.6)"
        : "0 10px 25px rgba(0,0,0,0.1)",
    },

    input: {
      width: "100%",
      padding: "12px",
      marginBottom: "14px",
      borderRadius: "10px",
      border: "none",
      background: darkMode ? "#f3c1df" : "#fff",
      color: "#000",
      outline: "none",
      boxSizing: "border-box",
      display: "block",
    },

    textarea: {
      width: "100%",
      height: "160px",
      padding: "12px",
      marginBottom: "14px",
      borderRadius: "10px",
      border: "none",
      background: darkMode ? "#f3c1df" : "#fff",
      color: "#000",
      resize: "none",
      outline: "none",
      boxSizing: "border-box",
      display: "block",
    },

    fileBox: {
      display: "flex",
      alignItems: "center",
      gap: "10px",
      marginBottom: "14px",
    },

    fileLabel: {
      padding: "10px 16px",
      borderRadius: "20px",
      background: darkMode ? "#f3c1df" : "#5e1c3b",
      color: darkMode ? "#000" : "#fff",
      cursor: "pointer",
      fontWeight: "bold",
      display: "inline-block",
    },

    previewBox: {
      marginTop: "10px",
      borderRadius: "14px",
      overflow: "hidden",
      border: "1px solid #eee",
    },

    preview: {
      width: "100%",
      maxHeight: "320px",
      objectFit: "cover",
      display: "block",
    },

    button: {
      width: "100%",
      padding: "13px",
      marginTop: "18px",
      borderRadius: "22px",
      border: "none",
      background: saving ? "#aaa" : (darkMode ? "#eca8b5" : "#8d0253"),
      color: darkMode ? "#560032" : "#fff",
      fontWeight: "bold",
      cursor: saving ? "not-allowed" : "pointer",
      transition: "0.3s",
    },

    error: {
      background: "#ff4d6d",
      color: "#fff",
      padding: "10px",
      borderRadius: "10px",
      marginBottom: "15px",
      textAlign: "center",
    },
  };

  if (loading || fetching) {
    return <div style={{ textAlign: "center", padding: "50px" }}>Loading...</div>;
  }

  if (!user) {
    return (
      <div style={{ textAlign: "center", padding: "50px", color: "red" }}>
        Unauthorized access
      </div>
    );
  }

  return (
    <div style={theme.page}>
      {/* SUCCESS TOAST */}
      <div style={theme.successToast}>
        <span></span> Changes saved successfully!
      </div>

      <div style={theme.container}>
        <div style={theme.header}>
          <Link to="/home" style={theme.backBtn}>⬅ Back Home</Link>
        </div>

        <div style={theme.card}>
          <div style={theme.title}>Edit Post</div>

          {error && <div style={theme.error}>{error}</div>}

          <form onSubmit={handleUpdate}>
            <input
              type="text"
              placeholder="Post title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={theme.input}
              required
            />

            <textarea
              placeholder="Write your post..."
              value={body}
              onChange={(e) => setBody(e.target.value)}
              style={theme.textarea}
              required
            />

            <div style={theme.fileBox}>
              <label htmlFor="fileUpload" style={theme.fileLabel}>
                Change Image
              </label>

              <input
                id="fileUpload"
                type="file"
                onChange={handleImageChange}
                style={{ display: "none" }}
              />
            </div>

            {preview && (
              <div style={theme.previewBox}>
                <img src={preview} alt="preview" style={theme.preview} />
              </div>
            )}

            <button type="submit" disabled={saving} style={theme.button}>
              {saving ? "Updating..." : "Update Post"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditPostPage;