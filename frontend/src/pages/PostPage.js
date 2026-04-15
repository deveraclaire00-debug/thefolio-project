import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../api/axios";

const PostPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newComment, setNewComment] = useState("");

  // ✅ LIKE SYSTEM
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);

  // ✅ PAGINATION
  const [currentPage, setCurrentPage] = useState(1);
  const commentsPerPage = 5;

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await API.get(`/posts/${id}`);
        setPost(res.data);

        // ✅ SET LIKES
        setLikes(res.data.likes?.length || 0);
        if (user && res.data.likes) {
          setLiked(res.data.likes.includes(user._id));
        }

        const commentsRes = await API.get(`/comments/${id}`);
        setComments(commentsRes.data);
      } catch (err) {
        setError("Post not found or error loading post");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id, user]);

  /* ================= DELETE HANDLER ================= */
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      await API.delete(`/posts/${id}`);
      alert("Post deleted successfully");
      navigate("/home");
    } catch (err) {
      setError("Failed to delete post. You might not have permission.");
    }
  };

  /* ================= LIKE HANDLER ================= */
  const handleLike = async () => {
    try {
      const { data } = await API.put(`/posts/${id}/like`);
      setLikes(data.likes.length);
      setLiked(data.likes.includes(user?._id));
    } catch (err) {
      console.log("Like failed");
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const res = await API.post(`/comments/${id}`, {
        body: newComment,
      });

      setComments(prev => [res.data, ...prev]); // ✅ FIXED SAFE UPDATE
      setNewComment("");
    } catch (err) {
      setError("Failed to add comment");
    }
  };

  if (loading) return <div style={{ textAlign: "center", padding: "40px" }}>Loading post...</div>;
  if (error) return <div style={{ textAlign: "center", padding: "40px", color: "red" }}>{error}</div>;
  if (!post) return <div>No post found</div>;

  const canEditOrDelete = user && (user._id === post.author?._id || user.role === "admin");

  // ✅ PAGINATION LOGIC
  const indexOfLast = currentPage * commentsPerPage;
  const indexOfFirst = indexOfLast - commentsPerPage;
  const currentComments = comments.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(comments.length / commentsPerPage);

  return (
    <div style={{ maxWidth: "900px", margin: "40px auto", padding: "20px" }}>
      
      {/* HEADER BUTTONS */}
      <div style={{ marginBottom: "20px" }}>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          
          <Link to="/home" style={btnStyle("#f7c6d9", "rgb(12, 75, 52)")}>⬅ Back Home</Link>
          <Link to="/create-post" style={btnStyle("#f7c6d9", "rgb(12, 75, 52)")}>➕ New Post</Link>

          {canEditOrDelete && (
            <>
              <Link to={`/edit-post/${id}`} style={btnStyle("#1a4120", "white")}>✏️ Edit</Link>
              
              <button 
                onClick={handleDelete} 
                style={{ ...btnStyle("#ff4d6d", "white"), border: "none", cursor: "pointer" }}
              >
                🗑 Delete
              </button>
            </>
          )}
        </div>
      </div>

      {/* POST CARD */}
      <div style={{ background: "#fff", borderRadius: "20px", padding: "20px", boxShadow: "0 8px 20px rgba(0,0,0,0.1)", marginBottom: "30px" }}>
        <h2>{post.title}</h2>

        {post.image && (
          <img 
            src={`${process.env.REACT_APP_BACKEND_URL}/uploads/${post.image}`}
            alt="post" 
            style={{ width: "100%", borderRadius: "15px", margin: "15px 0" }} 
          />
        )}

        <p style={{ fontSize: "16px", lineHeight: "1.6" }}>{post.body}</p>

        <small style={{ fontSize: "12px", color: "gray" }}>
          By {post.author?.name} · {new Date(post.createdAt).toLocaleDateString()}
        </small>

        {/* ❤️ LIKE SYSTEM */}
        <div style={{ marginTop: "15px", display: "flex", alignItems: "center", gap: "10px" }}>
          <button
            onClick={handleLike}
            style={{
              ...btnStyle(liked ? "#ff4d6d" : "#f7c6d9", liked ? "white" : "rgb(12, 75, 52)"),
              border: "none",
              cursor: "pointer"
            }}
          >
            {liked ? "❤️ Liked" : "🤍 Like"}
          </button>

          <span style={{ fontWeight: "bold" }}>{likes} likes</span>
        </div>
      </div>

      {/* COMMENTS */}
      <div style={{ marginTop: "30px" }}>
        <h3>💬 Comments ({comments.length})</h3>

        {user && (
          <form onSubmit={handleAddComment} style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>
            <input
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              style={{ flex: 1, padding: "10px", borderRadius: "20px", border: "1px solid rgb(12, 75, 52)" }}
            />
            <button type="submit" style={btnStyle("rgb(12, 75, 52)", "white")}>Post</button>
          </form>
        )}

        {/* PAGINATED COMMENTS */}
        {currentComments.map((c) => (
          <div key={c._id} style={{ background: "#f7c6d9", padding: "10px", borderRadius: "12px", marginBottom: "10px" }}>
            <strong>{c.author?.name || "User"}</strong>
            <p style={{ margin: 0 }}>{c.body}</p>
          </div>
        ))}

        {/* PAGINATION CONTROLS */}
        {totalPages > 1 && (
          <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginTop: "15px" }}>
            <button
              onClick={() => setCurrentPage(prev => prev - 1)}
              disabled={currentPage === 1}
              style={btnStyle("#ddd", "#333")}
            >
              ⬅ Prev
            </button>

            <span style={{ alignSelf: "center" }}>
              Page {currentPage} of {totalPages}
            </span>

            <button
              onClick={() => setCurrentPage(prev => prev + 1)}
              disabled={currentPage === totalPages}
              style={btnStyle("#ddd", "#333")}
            >
              Next ➡
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// Helper style
const btnStyle = (bg, color) => ({
  padding: "10px 14px",
  borderRadius: "25px",
  textDecoration: "none",
  fontSize: "14px",
  fontWeight: "bold",
  background: bg,
  color: color,
  border: "1px solid rgb(12, 75, 52)",
});

export default PostPage;