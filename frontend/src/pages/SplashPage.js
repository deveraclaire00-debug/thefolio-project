import { useEffect } from "react";

function SplashPage() {

  useEffect(() => {
    const timer = setTimeout(() => {
      window.location.href = "/home";
    }, 8000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div>

      <style>{`
        :root {
            --light-pink: #ff80ab;
            --dark-pink: #e91e63;
            --dark-green: #1b5e20;
            --sage-green: #4caf50;
            --cream-bg: #fffdfa;
            --gold: #ffb300;
            --glass: rgba(255, 255, 255, 0.9);
        }

        body::after {
            content: "";
            position: fixed;
            top: 0; left: 0;
            width: 100%; height: 100%;
            background-image: url("https://www.transparenttextures.com/patterns/natural-paper.png");
            opacity: 0.3;
            pointer-events: none;
            z-index: 200;
        }

        html, body {
            margin: 0;
            padding: 0;
            width: 100%;
            height: 100%;
            background-color: var(--cream-bg);
            animation:
                bgColorShift 5.5s ease-in-out forwards,
                pageExit 1.2s 5.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;

            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;

            font-family: 'Fredoka', sans-serif;
            overflow: hidden;
        }

        @keyframes bgColorShift {
            0% { background-color: var(--cream-bg); }
            25% { background-color: #f2f7f2; }
            55% { background-color: #fff0f3; }
            85% { background-color: #fff9ea; }
            100% { background-color: var(--cream-bg); }
        }

        .dust {
            position: absolute;
            background: var(--gold);
            border-radius: 50%;
            opacity: 0.4;
            pointer-events: none;
            z-index: 2;
            animation: driftUp 8s infinite linear;
            box-shadow: 0 0 5px var(--gold);
        }

        @keyframes driftUp {
            0% { transform: translateY(100vh) scale(0); opacity: 0; }
            50% { opacity: 0.6; }
            100% { transform: translateY(-10vh) scale(1.2); opacity: 0; }
        }

        .botanical {
            position: absolute;
            fill: none;
            stroke-width: 1.5;
            stroke: #eee;
            opacity: 0.4;
            z-index: 1;
            transition: transform 0.5s cubic-bezier(0.175,0.885,0.32,1.275);
        }

        .b-1 {
            top: 10%;
            left: 5%;
            width: 150px;
            animation:
                drift 20s infinite alternate ease-in-out,
                bloomColor 6s linear forwards,
                brushImpact 0.6s 1.2s ease-in-out;
        }

        .b-2 {
            bottom: 8%;
            right: 8%;
            width: 180px;
            animation:
                drift 18s infinite alternate-reverse ease-in-out,
                bloomColor 6s linear forwards,
                brushImpact 0.6s 1.8s ease-in-out;
        }

        @keyframes brushImpact {
            0% { transform: scale(1) rotate(0deg); }
            30% { transform: scale(1.1) rotate(15deg); filter: brightness(1.2); }
            100% { transform: scale(1) rotate(0deg); }
        }

        @keyframes bloomColor {
            0% { stroke: #eee; transform: scale(0.9); }
            100% { stroke: var(--dark-green); transform: scale(1.05); opacity: 0.6; }
        }

        @keyframes drift {
            from { transform: rotate(-5deg); }
            to { transform: rotate(5deg); }
        }

        .swipe-layer {
            position: absolute;
            width: 250%;
            height: 100vh;
            pointer-events: none;
            z-index: 50;
            display: flex;
            flex-direction: column;
            justify-content: center;
            transform: rotate(-6deg);
        }

        .brush {
            width: 100%;
            height: 320px;
            filter: drop-shadow(0 15px 30px rgba(0,0,0,0.12));
            mix-blend-mode: multiply;
            mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
        }

        .brush-1 {
            fill: var(--dark-green);
            transform: translateX(-110%);
            animation: swipe 3.4s cubic-bezier(0.4,0,0.2,1) forwards;
        }

        .brush-2 {
            fill: var(--dark-pink);
            margin-top: -150px;
            transform: translateX(-110%);
            animation: swipe 3.2s 0.2s cubic-bezier(0.4,0,0.2,1) forwards;
        }

        @keyframes swipe {
            0% { transform: translateX(-110%) scaleX(0.8); }
            100% { transform: translateX(110%) scaleX(1); }
        }

        .brand-container {
            text-align: center;
            z-index: 100;
            opacity: 0;
            animation: fadeIn 1.5s 1.8s forwards;
            position: relative;
        }

        .handmade, .denise {
            font-size: clamp(70px,14vw,140px);
            margin: 0;
            display: flex;
            gap: 12px;
            line-height: 0.6;
            filter:
                drop-shadow(0 0 15px white)
                drop-shadow(2px 2px 2px rgba(0,0,0,0.05));
        }

        .handmade span,
        .denise span {
            display: inline-block;
            opacity: 0;
            transform: translateY(60px) scale(0.5);
            animation: letterDrop 0.8s cubic-bezier(0.175,0.885,0.32,1.275) forwards;
        }

        @keyframes letterDrop {
            to { opacity: 1; transform: translateY(0) scale(1); }
        }

        .handmade span:nth-child(odd),
        .denise span:nth-child(even) { color: var(--dark-green); }

        .handmade span:nth-child(even),
        .denise span:nth-child(odd) { color: var(--dark-pink); }

        .by-text {
            font-family: 'Yellowtail', cursive;
            font-size: clamp(50px,9vw,90px);
            color: var(--gold);
            margin-right: 25px;
            transform: rotate(-15deg);
            opacity: 0;
            animation: fadeIn 1s 2.8s forwards;
            text-shadow: 0 0 10px white;
        }

        .loading-container {
            position: absolute;
            bottom: 60px;
            z-index: 110;
        }

        .capsule {
            background: var(--glass);
            backdrop-filter: blur(20px);
            padding: 14px 35px;
            border-radius: 100px;
            border: 2px solid var(--gold);
            display: flex;
            align-items: center;
            gap: 20px;
            box-shadow: 0 15px 35px rgba(0,0,0,0.1);
        }

        .progress-line-fill {
            height: 4px;
            width: 0%;
            background: linear-gradient(
                to right,
                var(--dark-green),
                var(--gold),
                var(--dark-pink)
            );
            animation: fillProgress 5.8s linear forwards;
            border-radius: 10px;
        }

        @keyframes fillProgress { to { width: 140px; } }
        @keyframes fadeIn { to { opacity: 1; } }
        @keyframes pageExit {
            to {
                opacity: 0;
                filter: blur(40px);
                transform: scale(1.1);
            }
        }
      `}</style>

      {/* Dust particles */}
      <div className="dust" style={{ width:4, height:4, left:"10%", animationDelay:"1s" }} />
      <div className="dust" style={{ width:6, height:6, left:"45%", animationDelay:"3s" }} />
      <div className="dust" style={{ width:3, height:3, left:"85%", animationDelay:"0s" }} />

      {/* Botanicals */}
      <svg className="botanical b-1" viewBox="0 0 100 100">
        <path d="M50 90 Q60 50 90 40 M50 90 Q40 50 10 40 M50 90 L50 10" />
      </svg>

      <svg className="botanical b-2" viewBox="0 0 100 100">
        <path d="M10 90 Q40 80 50 10 M50 10 Q60 80 90 90" />
      </svg>

      {/* Swipe layer */}
      <div className="swipe-layer">
        <svg className="brush brush-1" viewBox="0 0 1000 120" preserveAspectRatio="none">
          <path d="M-20,45 C80,25 220,95 360,55 C510,15 720,105 870,45 C970,15 1020,45 1020,45 L1020,115 C920,125 720,85 520,115 C320,145 80,85 -20,115 Z" />
        </svg>

        <svg className="brush brush-2" viewBox="0 0 1000 120" preserveAspectRatio="none">
          <path d="M-20,55 C130,105 330,25 480,65 C630,105 830,35 1020,55 L1020,105 C820,95 620,125 420,95 C220,65 -20,105 -20,105 Z" />
        </svg>
      </div>

      {/* Branding */}
      <div className="brand-container">
        <span style={{
          fontSize:"11px",
          letterSpacing:"12px",
          color:"#111",
          marginBottom:"45px",
          display:"block",
          fontWeight:700
        }}>
          ARTS AND CRAFTS
        </span>

        <h1 className="handmade">
          {"Handmade".split("").map((char,i)=>(
            <span key={i} style={{ animationDelay:`2.${i}s` }}>
              {char}
            </span>
          ))}
        </h1>

        <div style={{ display:"flex", justifyContent:"center", alignItems:"center", marginTop:"30px" }}>
          <span className="by-text">by</span>

          <h1 className="denise">
            {"Denise".split("").map((char,i)=>(
              <span key={i} style={{ animationDelay:`3.${2+i}s` }}>
                {char}
              </span>
            ))}
          </h1>
        </div>
      </div>

      {/* Loading capsule */}
      <div className="loading-container">
        <div className="capsule">
          <div style={{
            width:"140px",
            height:"4px",
            background:"rgba(0,0,0,0.06)",
            borderRadius:"10px",
            overflow:"hidden"
          }}>
            <div className="progress-line-fill" />
          </div>

          <span style={{
            fontSize:"9px",
            letterSpacing:"3px",
            color:"#111",
            fontWeight:700
          }}>
            PREPARING WEBSITE
          </span>
        </div>
      </div>

    </div>
  );
}

export default SplashPage;