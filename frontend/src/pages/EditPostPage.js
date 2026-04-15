import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../api/axios";

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

  const getPostImageUrl = (image) => {
    if (!image) return '';
    if (image.startsWith('http://') || image.startsWith('https://')) return image;
    const fileName = image.startsWith('uploads/') ? image.slice(8) : image;
    return `${process.env.REACT_APP_BACKEND_URL}/uploads/${fileName}`;
  };

  const [showSuccess, setShowSuccess] = useState(false);

  /* ================= THEME LOAD ================= */
  useEffect(() => {
    const saved = localStorage.getItem("user-theme");
    setDarkMode(saved === "dark");
  }, []);

  /* ================= THEME LISTENER ================= */
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
            ? getPostImageUrl(res.data.image)
            : ""
        );
      } catch {
        if (isMounted) setError("Failed to load post.");
      } finally {
        if (isMounted) setFetching(false);
      }
    };

    fetchPost();
    return () => {
      isMounted = false;
    };
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

  /* ================= CLEANUP ================= */
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

      setShowSuccess(true);

      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    } catch (err) {
      setError("Failed to update post.");
    } finally {
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
    },

    successToast: {
      position: "fixed",
      top: "20px",
      right: "20px",
      backgroundColor: darkMode ? "#eca8b5" : "rgb(12, 75, 52)",
      color: darkMode ? "#560032" : "#f7c6d9",
      padding: "16px 30px",
      borderRadius: "50px",
      fontWeight: "bold",
      opacity: showSuccess ? 1 : 0,
      transform: showSuccess ? "translateY(0)" : "translateY(-20px)",
      transition: "0.4s",
      zIndex: 2000,
    },

    container: {
      width: "100%",
      maxWidth: "850px",
    },

    backBtn: {
      padding: "10px 14px",
      borderRadius: "20px",
      textDecoration: "none",
      fontSize: "14px",
      fontWeight: "bold",
      background: "#f7c6d9",
      color: "rgb(12, 75, 52)",
    },

    card: {
      background: darkMode ? "#2e091e" : "#f7c6d9",
      borderRadius: "18px",
      padding: "30px",
    },

    input: {
      width: "100%",
      padding: "12px",
      marginBottom: "14px",
    },

    textarea: {
      width: "100%",
      height: "160px",
      padding: "12px",
      marginBottom: "14px",
    },

    fileLabel: {
      padding: "10px 16px",
      borderRadius: "20px",
      background: darkMode ? "#f3c1df" : "#5e1c3b",
      color: darkMode ? "#000" : "#fff",
      cursor: "pointer",
      fontWeight: "bold",
    },

    preview: {
      width: "100%",
      maxHeight: "320px",
      objectFit: "cover",
    },

    button: {
      width: "100%",
      padding: "13px",
      marginTop: "18px",
      borderRadius: "22px",
      background: darkMode ? "#eca8b5" : "#8d0253",
      color: "#fff",
      fontWeight: "bold",
    },

    error: {
      background: "#ff4d6d",
      color: "#fff",
      padding: "10px",
      borderRadius: "10px",
      marginBottom: "15px",
    },
  };

  if (loading || fetching) return <div>Loading...</div>;

  if (!user) return <div>Unauthorized access</div>;

  return (
    <div style={theme.page}>
      {/* SUCCESS */}
      <div style={theme.successToast}>Changes saved successfully!</div>

      <div style={theme.container}>
        <Link to="/home" style={theme.backBtn}>⬅ Back Home</Link>

        <div style={theme.card}>
          {error && <div style={theme.error}>{error}</div>}

          <form onSubmit={handleUpdate}>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={theme.input}
            />

            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              style={theme.textarea}
            />

            {/* ✅ ONLY SHOW IF IMAGE EXISTS */}
            {preview && (
              <div style={{ marginBottom: "14px" }}>
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
            )}

            {preview && (
              <img src={preview} alt="preview" style={theme.preview} />
            )}

            <button type="submit" style={theme.button} disabled={saving}>
              {saving ? "Updating..." : "Update Post"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditPostPage;