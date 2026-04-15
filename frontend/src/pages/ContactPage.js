// frontend/src/pages/ContactPage.jsx

import { useState, useEffect } from "react";
import "../App.css";
import API from "../api/axios";

export default function ContactPage() {

  /* ============================= */
  /*      FORM STATE               */
  /* ============================= */
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });

  const [contactStatus, setContactStatus] = useState("");
  const [loading, setLoading] = useState(false);

  /* ============================= */
  /*      THEME IMAGE SWITCHING     */
  /* ============================= */
  useEffect(() => {
    const applyTheme = () => {
      const savedTheme = localStorage.getItem("user-theme");
      document.body.classList.toggle("dark-mode", savedTheme === "dark");

      document.querySelectorAll(".theme-img").forEach(img => {
        if (savedTheme === "dark" && img.dataset.dark) img.src = img.dataset.dark;
        if (savedTheme === "light" && img.dataset.light) img.src = img.dataset.light;
      });
    };

    applyTheme();
    window.addEventListener("storage", applyTheme);
    return () => window.removeEventListener("storage", applyTheme);
  }, []);

  /* ============================= */
  /*      INPUT CHANGE              */
  /* ============================= */
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  /* ============================= */
  /*      FORM SUBMIT               */
  /* ============================= */
  const handleContactSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.message) {
      setContactStatus("⚠️ Please fill in all fields");
      return;
    }
    if (!formData.email.includes("@")) {
      setContactStatus("⚠️ Please enter a valid email");
      return;
    }
    if (formData.message.length < 10) {
      setContactStatus("⚠️ Message must be at least 10 characters");
      return;
    }

    try {
      setLoading(true);
      await API.post('/messages', formData);
      setContactStatus("✅ Message sent successfully!");
      setFormData({ name: "", email: "", message: "" });
    } catch (err) {
      setContactStatus(err.response?.data?.message || "❌ Failed to send message");
    } finally {
      setLoading(false);
    }

    setTimeout(() => setContactStatus(""), 3000);
  };

  /* ============================= */
  /*      UI RENDER                */
  /* ============================= */
  return (
    <>
      <main className="content-wrapper">

        {/* CONTACT FORM SECTION */}
        <section className="contact-hero">

          <div className="contact-form-container highlights">
            <h2>Get In Touch!</h2>

            <form noValidate onSubmit={handleContactSubmit}>

              <div className="input-group">
                <label>Name:</label>
                <input
                  name="name"
                  type="text"
                  placeholder="Enter your full name..."
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>

              <div className="input-group">
                <label>Email:</label>
                <input
                  name="email"
                  type="email"
                  placeholder="user@email.com"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div className="input-group">
                <label>Message:</label>
                <textarea
                  name="message"
                  placeholder="Write your message here..."
                  value={formData.message}
                  onChange={handleChange}
                />
              </div>

              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? "Sending..." : "Submit"}
              </button>

              {contactStatus && (
                <div className="status-message">{contactStatus}</div>
              )}

            </form>
          </div>

          {/* CONTACT INFO CARD */}
          <div className="contact-info-card highlights">
            <img
              src="/pictures/light-mode-pic.png"
              alt="Contact Profile"
              className="info-card-img theme-img"
              data-light="/pictures/light-mode-pic.png"
              data-dark="/pictures/dark-mode-pic.png"
            />

            <div className="info-card-text">
              <h3>Contact Me & Art Resources</h3>
              <p>Let's connect and create! Send a message to share ideas, ask questions, or find art and craft inspiration.</p>
              <div className="contact-details">
                <p>📞 0956-785-0041</p>
                <p>✉ deveraclaire00@gmail.com</p>
              </div>
            </div>
          </div>

        </section>

        {/* ART & CRAFT RESOURCES TABLE */}
        <section className="resources-section">
          <h2>Helpful Art & Craft Resources</h2>
          <table className="resource-cards art-resource-table">
            <thead>
              <tr>
                <th className="table-header">Resource Name</th>
                <th className="table-header">Description</th>
              </tr>
            </thead>
            <tbody>
              <tr className="res-row">
                <td className="res-card darkpink-bg">
                  <a href="https://www.pinterest.com" target="_blank" rel="noopener noreferrer">
                    <h4>Pinterest</h4>
                  </a>
                </td>
                <td className="res-desc darkpink-bg">
                  <p>Visual platform full of creative ideas, art inspiration, and craft tutorials.</p>
                </td>
              </tr>
              <tr className="res-row">
                <td className="res-card pink-bg">
                  <a href="https://www.deviantart.com" target="_blank" rel="noopener noreferrer">
                    <h4>DeviantArt</h4>
                  </a>
                </td>
                <td className="res-desc pink-bg">
                  <p>Online community where artists share artwork and explore different art styles.</p>
                </td>
              </tr>
              <tr className="res-row">
                <td className="res-card white-bg">
                  <a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer">
                    <h4>YouTube Tutorials</h4>
                  </a>
                </td>
                <td className="res-desc white-bg">
                  <p>Free video tutorials for drawing, painting, and various craft techniques.</p>
                </td>
              </tr>
              <tr className="res-row">
                <td className="res-card darkpink-bg">
                  <a href="https://color.adobe.com" target="_blank" rel="noopener noreferrer">
                    <h4>Adobe Color</h4>
                  </a>
                </td>
                <td className="res-desc darkpink-bg">
                  <p>Professional tool for creating color palettes and exploring color theory.</p>
                </td>
              </tr>
            </tbody>
          </table>
        </section>

        {/* MAP SECTION */}
        <section className="map-section">
          <div className="map-container">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d61345.39230049582!2d120.30582012450905!3d16.06097356181791!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x33915d56ad32b305%3A0x1b74411960f5054a!2sDagupan%20City%2C%20Pangasinan!5e0!3m2!1sen!2sph!4v1772635488159!5m2!1sen!2sph"
              style={{ width: "100%", height: "350px", border: "0", borderRadius: "20px" }}
              loading="lazy"
              title="Google Map Location"
            />
          </div>
        </section>

        {/* EXTERNAL LINKS SECTION */}
        <section className="external-links-section">
          <h2 className="section-title">Helpful Art & Craft Resources</h2>
          <div className="art-links-grid">
            <a href="https://www.metmuseum.org" target="_blank" rel="noopener noreferrer" className="art-resource-card">
              The Met Museum
              <span>Explore 5,000 years of art history</span>
            </a>

            <a href="https://www.tate.org.uk" target="_blank" rel="noopener noreferrer" className="art-resource-card">
              Tate Modern
              <span>Global contemporary & modern art</span>
            </a>

            <a href="https://news.artnet.com" target="_blank" rel="noopener noreferrer" className="art-resource-card">
              Artnet News
              <span>Latest updates from the art world</span>
            </a>
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