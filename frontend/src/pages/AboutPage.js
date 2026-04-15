import { useEffect } from "react";
import { Link } from "react-router-dom";
import "../App.css";
import Nav from "../components/Nav";

function AboutPage() {

  /* ==============================
      THEME IMAGE SWITCH SYSTEM
  ============================== */

  const updateThemeImages = () => {
    const theme = localStorage.getItem("user-theme");
    document.querySelectorAll(".theme-img").forEach(img => {
      if (theme === "dark" && img.dataset.dark) {
        img.src = img.dataset.dark;
      }
      if (theme === "light" && img.dataset.light) {
        img.src = img.dataset.light;
      }
    });
  };

  /* ==============================
      LOAD THEME ON PAGE OPEN
  ============================== */

  useEffect(() => {
    const applyTheme = () => {
      const savedTheme = localStorage.getItem("user-theme");
      if (savedTheme === "dark") {
        document.body.classList.add("dark-mode");
      } else {
        document.body.classList.remove("dark-mode");
      }
      updateThemeImages();
    };

    applyTheme();
    window.addEventListener("storage", applyTheme);
    return () => window.removeEventListener("storage", applyTheme);
  }, []);

  return (
    <>
    
      <main className="content-wrapper">

        <section className="about-section">
          <h2>WHAT I LOVE ABOUT ART</h2>
          <p>Art allows me to express my thoughts and emotions freely. I enjoy designing creative pieces and making crafts because they let me explore my imagination and improve my skills. Working with art materials helps me relax and feel inspired.</p>

          <div className="card-art">
            <div className="gallery-grid">
              <img
                src="/pictures/paint2.png"
                className="theme-img"
                data-light="/pictures/paint2.png"
                data-dark="/pictures/dark_paint2.png"
                alt="Cat Artwork"
              />
              <div className="info">
                <h2>CAT</h2>
                <p>This is my first artwork. I created it out of boredom when I had nothing else to do. Through this piece, I discovered the joy of creating abstract art.</p>
              </div>
            </div>

            <div className="gallery-grid">
              <img
                src="/pictures/paint6.png"
                className="theme-img"
                data-light="/pictures/paint6.png"
                data-dark="/pictures/dark_paint6.png"
                alt="Coffee Rose Artwork"
              />
              <div className="info">
                <h2>ROSE</h2>
                <p>I created this artwork when I was in high school as part of my art project. It was challenging for me because it was my first time using coffee as a painting medium.</p>
              </div>
            </div>

            <div className="gallery-grid">
              <img
                src="/pictures/paint4.png"
                className="theme-img"
                data-light="/pictures/paint4.png"
                data-dark="/pictures/dark_paint4.png"
                alt="Flower Artwork"
              />
              <div className="info">
                <h2>FLOWERS</h2>
                <p>This was a rushed project during my high school days. I simply applied and mixed different colors so I would have a project to submit, and this is how it turned out.</p>
              </div>
            </div>

            <div className="gallery-grid">
              <img
                src="/pictures/paint7.png"
                className="theme-img"
                data-light="/pictures/paint7.png"
                data-dark="/pictures/dark_paint7.png"
                alt="Artwork"
              />
              <div className="info">
                <h2>CARTOON</h2>
                <p>This is an art project I created during my first year of college. It was inspired by my favorite film, Up.</p>
              </div>
            </div>

            <div className="gallery-grid">
              <img
                src="/pictures/paint3.png"
                className="theme-img"
                data-light="/pictures/paint3.png"
                data-dark="/pictures/dark_paint3.png"
                alt="Scribble Art"
              />
              <div className="info">
                <h2>SCRIBBLE</h2>
                <p>This is an unexpected artwork I created while randomly scribbling with marker pens.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="highlights timeline-box">
          <h3>Art Journey Timeline</h3>
          <ol>
            <li>Started drawing and coloring as a hobby</li>
            <li>Explored simple crafts and DIY projects</li>
            <li>Experimented with materials and design</li>
            <li>Improved creativity and artistic confidence</li>
          </ol>
          <blockquote className="art-quote">
            <p>"Creativity takes courage."</p>
            <cite>— Henri Matisse</cite>
          </blockquote>
        </section>

        <section className="about-section">
          <h2>My Journey with Art and Crafts</h2>
          <p>I started enjoying art at a young age by drawing and creating simple crafts. Over time, I learned to appreciate different styles and techniques. As I practiced more, I became more confident in designing unique and creative projects.</p>

          <div className="card-art">
            <div className="gallery-grid">
              <img
                className="theme-img"
                src="/pictures/art1.png"
                data-light="/pictures/art1.png"
                data-dark="/pictures/dark_art1.png"
                alt="Charms"
              />
              <div className="info">
                <h2>CHARMS</h2>
                <p>Creative phone and key charms.</p>
              </div>
            </div>

            <div className="gallery-grid">
              <img
                className="theme-img"
                src="/pictures/art2.png"
                data-light="/pictures/art2.png"
                data-dark="/pictures/dark_art2.png"
                alt="Keychains"
              />
              <div className="info">
                <h2>KEYCHAINS</h2>
                <p>Attention to craft detail.</p>
              </div>
            </div>

            <div className="gallery-grid">
              <img
                className="theme-img"
                src="/pictures/art3.png"
                data-light="/pictures/art3.png"
                data-dark="/pictures/dark_art3.png"
                alt="Crafts"
              />
              <div className="info">
                <h2>CRAFTS</h2>
                <p>Accessories turned into meaningful designs.</p>
              </div>
            </div>

            <div className="gallery-grid">
              <img
                className="theme-img"
                src="/pictures/art4.png"
                data-light="/pictures/art4.png"
                data-dark="/pictures/dark_art4.png"
                alt="Design"
              />
              <div className="info">
                <h2>DESIGN</h2>
                <p>Material experiment.</p>
              </div>
            </div>

            <div className="gallery-grid">
              <img
                className="theme-img"
                src="/pictures/paint1.png"
                data-light="/pictures/paint1.png"
                data-dark="/pictures/dark_paint1.png"
                alt="Flowers Artwork"
              />
              <div className="info">
                <h2>FLOWERS</h2>
                <p>Special artwork created with my cousin.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ================= GAME INVITE SECTION ================= */}
        <section className="game-invite-container">
          <div className="invite-card">
            <div className="invite-text">
              <h2>Ready for a Creative Break? 🎨</h2>
              <p>
                I've turned my artworks into a <strong>Memory Match Game</strong>. 
                Can you find all the pairs and beat the clock?
              </p>
              <Link to="/game" className="play-btn">
                GO TO GAME →
              </Link>
            </div>

            <div className="mini-game-preview">
              <div className="preview-card flipped">
                <img src="/pictures/paint4.png" alt="Card Preview" />
              </div>
              <div className="preview-card animate-flip">
                <div className="card-inner">
                  <div className="card-front">?</div>
                  <div className="card-back">
                    <img src="/pictures/paint3.png" alt="Artwork 3" />
                  </div>
                </div>
              </div>
              <div className="preview-card animate-flip delay">
                <div className="card-inner">
                  <div className="card-front">?</div>
                  <div className="card-back">
                    <img src="/pictures/art2.png" alt="Artwork 2" />
                  </div>
                </div>
              </div>
              <div className="preview-card flipped">
                <img src="/pictures/paint2.png" alt="Card Preview" />
              </div>
            </div>
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

export default AboutPage;