import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom"; 
import API from '../api/axios';
import "../App.css";

/* ==========================================================
   NAVIGATION COMPONENT
   ========================================================== */
function Nav() {
  const location = useLocation();

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
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (savedTheme === "dark") applyTheme("dark");
    else if (savedTheme === "light") applyTheme("light");
    else applyTheme(systemPrefersDark ? "dark" : "light");
  }, []);

  const toggleTheme = () => {
    const isDark = document.body.classList.contains("dark-mode");
    applyTheme(isDark ? "light" : "dark");
  };

  const isActive = (path) => location.pathname === path ? "active" : "";
}

/* ==========================================================
   REGISTER PAGE COMPONENT
   ========================================================== */
function RegisterPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    terms: false
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const validateForm = () => {
    let newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!formData.username.trim()) newErrors.username = "Username is required";
    if (!formData.email.includes("@")) newErrors.email = "Valid email is required";
    if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters";
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match";
    if (!formData.terms) newErrors.terms = "You must agree to terms";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        await API.post('/auth/register', {
          name: formData.fullName,
          username: formData.username,
          email: formData.email,
          password: formData.password,
          role: 'member'
        });
        setSuccessMessage("Registration successful! You can now login.");
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
        setFormData({
          fullName: "", username: "", email: "",
          password: "", confirmPassword: "", terms: false
        });
        setErrors({});
      } catch (err) {
        setErrors({ submit: err.response?.data?.message || 'Registration failed' });
      }
    }
  };

  const alignedLabel = {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    cursor: "pointer",
    fontWeight: "normal",
    fontSize: "15px"
  };

  return (
    <>
      <Nav />
      <main className="content-wrapper">
        <div className="register-intro">
          <h2>Join My Art & Crafts Community</h2>
          <p>Let’s connect and create! Send a message to share ideas, ask questions, or find art and craft inspiration.</p>
        </div>

        <section className="register-layout">
          <div className="why-signup-box">
            <h3>Why Sign Up?</h3>
            <p>By signing up, you will receive updates about creative art ideas, craft tutorials, design inspiration, and helpful tips.</p>
            <img src="/pictures/paint5.png" alt="Art inspiration" className="decorative-img" />
          </div>

          <div className="form-container">
            <form className="register-form" onSubmit={handleSubmit}>
              
{(successMessage || errors.submit) && (
                <div style={{ 
                  backgroundColor: successMessage ? "#d4edda" : "#f8d7da", 
                  color: successMessage ? "#155724" : "#721c24", 
                  padding: "15px", 
                  borderRadius: "8px", 
                  border: `1px solid ${successMessage ? "#c3e6cb" : "#f5c6cb"}`, 
                  textAlign: "center", 
                  marginBottom: "20px", 
                  fontWeight: "bold" 
                }}>
                  {successMessage || errors.submit}
                </div>
              )}

              <div className="form-group">
                <label>Full Name</label>
                <input name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Enter full name" />
                <span className="error-message">{errors.fullName}</span>
              </div>

              <div className="form-group">
                <label>Username</label>
                <input name="username" value={formData.username} onChange={handleChange} placeholder="Enter username" />
                <span className="error-message">{errors.username}</span>
              </div>

              <div className="form-group">
                <label>Email</label>
                <input name="email" value={formData.email} onChange={handleChange} placeholder="example@mail.com" />
                <span className="error-message">{errors.email}</span>
              </div>

              <div className="form-group password-wrapper">
                <label>Password</label>
                <input type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleChange} />
                <button type="button" className="toggle-icon" onClick={() => setShowPassword(!showPassword)}></button>
                <span className="error-message">{errors.password}</span>
              </div>

              <div className="form-group password-wrapper">
                <label>Confirm Password</label>
                <input type={showConfirmPassword ? "text" : "password"} name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} />
                <button type="button" className="toggle-icon" onClick={() => setShowConfirmPassword(!showConfirmPassword)}></button>
                <span className="error-message">{errors.confirmPassword}</span>
              </div>

              <div className="form-group checkbox-group" style={{ marginTop: "10px" }}>
                <label style={alignedLabel}>
                  <input type="checkbox" name="terms" checked={formData.terms} onChange={handleChange} style={{ width: "auto" }} />
                  Terms and Agreement: I agree to the terms and conditions.
                </label>
                <span className="error-message">{errors.terms}</span>
              </div>

              <div className="button-wrapper">
                <button type="submit" className="register-submit">Submit</button>
              </div>

              <div className="login-prompt" style={{ marginTop: "15px", textAlign: "center" }}>
                <p>
                  Already have an account?{" "}
                  <Link to="/login" style={{ color: "#007bff", textDecoration: "underline" }}>
                    Login here
                  </Link>
                </p>
              </div>

            </form>
          </div>
        </section>
      </main>

      <footer>
        <div className="footer-content">
          <span>📧 email: deveraclaire00@gmail.com</span>
          <span>© 2026 Claire Denise De Vera - Student Portfolio Project</span>
        </div>
      </footer>
    </>
  );
}

export default RegisterPage;