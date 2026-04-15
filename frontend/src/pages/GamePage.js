import React, { useState, useEffect, useCallback } from 'react';
/* Import Link if you are using React Router */
import { Link } from 'react-router-dom'; 

const GamePage = () => {
  const [moves, setMoves] = useState(0);
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedCards, setMatchedCards] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);

  // --- Theme Toggle Logic ---
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.remove('dark-mode');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const cardArray = [
    { name: '1', img: './pictures/art1.png' }, { name: '1', img: './pictures/art1.png' },
    { name: '2', img: './pictures/art2.png' }, { name: '2', img: './pictures/art2.png' },
    { name: '3', img: './pictures/art3.png' }, { name: '3', img: './pictures/art3.png' },
    { name: '4', img: './pictures/art4.png' }, { name: '4', img: './pictures/art4.png' },
    { name: '5', img: './pictures/paint2.png' }, { name: '5', img: './pictures/paint2.png' },
    { name: '6', img: './pictures/paint3.png' }, { name: '6', img: './pictures/paint3.png' },
    { name: '7', img: './pictures/paint4.png' }, { name: '7', img: './pictures/paint4.png' },
    { name: '8', img: './pictures/paint5.png' }, { name: '8', img: './pictures/paint5.png' }
  ];

  const resetGame = useCallback(() => {
    const shuffled = [...cardArray].sort(() => 0.5 - Math.random());
    setCards(shuffled);
    setMatchedCards([]);
    setFlippedCards([]);
    setMoves(0);
    setIsProcessing(false);
  }, []);

  useEffect(() => {
    resetGame();
  }, [resetGame]);

  const handleCardClick = (index) => {
    if (isProcessing || flippedCards.includes(index) || matchedCards.includes(index)) return;
    const newFlipped = [...flippedCards, index];
    setFlippedCards(newFlipped);
    
    if (newFlipped.length === 2) {
      setIsProcessing(true);
      setMoves(prev => prev + 1);
      if (cards[newFlipped[0]].name === cards[newFlipped[1]].name) {
        setMatchedCards(prev => [...prev, newFlipped[0], newFlipped[1]]);
        setFlippedCards([]);
        setIsProcessing(false);
      } else {
        setTimeout(() => {
          setFlippedCards([]);
          setIsProcessing(false);
        }, 800);
      }
    }
  };

  return (
    <>
      <style>{`
        :root {
          --bg-color: #f1c8e0;
          --leaf-green: #7fa474;
          --accent-pink: #f06292;
          --dark-blue: #4b627d;
          --gingham-line: rgba(240, 98, 146, 0.25); 
          --card-bg: white;
          --header-bg: white;
        }

        body.dark-mode {
          --bg-color: #3d0024;
          --leaf-green: #89b47a;
          --accent-pink: #f48fb1;
          --dark-blue: #e1e3de;
          --gingham-line: rgba(244, 143, 177, 0.15);
          --card-bg: #252a24;
          --header-bg: rgba(30, 35, 29, 0.8);
        }

        body {
          background-color: var(--bg-color);
          margin: 0;
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          font-family: 'Segoe UI', sans-serif;
          transition: background-color 0.4s ease;
        }

        .theme-toggle {
          position: fixed;
          top: 20px;
          right: 20px;
          background: var(--card-bg);
          border: 2px solid var(--leaf-green);
          border-radius: 50%;
          width: 45px;
          height: 45px;
          cursor: pointer;
          font-size: 1.2rem;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 10px rgba(0,0,0,0.1);
          z-index: 1000;
          transition: all 0.3s ease;
        }

        .game-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 20px;
        }

        .header-box {
          background: var(--header-bg);
          backdrop-filter: blur(8px);
          border: 3px solid var(--leaf-green);
          border-radius: 35px;
          padding: 15px 40px;
          width: 300px;
          margin-bottom: 20px;
          box-shadow: 0 4px 10px rgba(0,0,0,0.05);
          text-align: center;
          transition: background 0.4s ease;
        }

        .header-box h1 {
          margin: 0;
          color: var(--leaf-green);
          font-size: 1.6rem;
          text-transform: uppercase;
        }

        .moves-text {
          color: var(--accent-pink);
          font-weight: bold;
          margin: 5px 0 10px 0;
        }

        .btn-row {
          display: flex;
          gap: 12px;
          justify-content: center;
        }

        .btn {
          border: none;
          border-radius: 20px;
          padding: 8px 18px;
          color: white;
          font-weight: bold;
          cursor: pointer;
          font-size: 0.8rem;
          transition: transform 0.2s;
          text-decoration: none;
          display: inline-block;
        }
        
        .btn:active { transform: scale(0.95); }
        .btn-restart { background-color: var(--leaf-green); }
        .btn-home { background-color: var(--dark-blue); color: var(--bg-color); }

        .white-line {
          width: 340px;
          height: 8px;
          background: white;
          border-radius: 10px;
          margin-bottom: 25px;
        }

        .card-grid {
          display: grid;
          grid-template-columns: repeat(4, 85px);
          gap: 15px;
          perspective: 1000px;
        }

        .card-item {
          width: 85px;
          height: 85px;
          position: relative;
          cursor: pointer;
          transform-style: preserve-3d;
          transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .card-item.flipped {
          transform: rotateY(180deg);
        }

        .card-face {
          position: absolute;
          width: 100%;
          height: 100%;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
          border-radius: 15px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
          border: 3px solid var(--card-bg);
          transition: border 0.4s ease;
        }

        .gingham-pattern {
          background-color: var(--card-bg);
          background-image: 
            linear-gradient(90deg, var(--gingham-line) 50%, transparent 50%),
            linear-gradient(var(--gingham-line) 50%, transparent 50%);
          background-size: 20px 20px;
          transition: background-color 0.4s ease;
        }

        .card-back {
          z-index: 2;
          transform: rotateY(0deg);
        }

        .card-front {
          transform: rotateY(180deg);
          z-index: 1;
          background: white; /* Keep art background white for visibility */
        }

        .card-front img {
          width: 80%;
          height: 80%;
          object-fit: contain;
          filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));
          position: relative;
          z-index: 3;
        }
      `}</style>

      {/* Theme Toggle Button */}
      <button 
        className="theme-toggle" 
        onClick={() => setIsDarkMode(!isDarkMode)}
        title="Toggle Dark/Light Mode"
      >
        {isDarkMode ? '☀️' : '🌙'}
      </button>

      <div className="game-wrapper">
        <div className="header-box">
          <h1>Memory Match</h1>
          <p className="moves-text">Moves: {moves}</p>
          <div className="btn-row">
            <button className="btn btn-restart" onClick={resetGame}>RESTART</button>
            
            <Link to="/about" style={{ textDecoration: 'none' }}>
              <button className="btn btn-home">BACK TO HOME</button>
            </Link>
          </div>
        </div>

        <div className="white-line"></div>

        <div className="card-grid">
          {cards.map((card, index) => {
            const isFlipped = flippedCards.includes(index) || matchedCards.includes(index);
            return (
              <div 
                key={index} 
                className={`card-item ${isFlipped ? 'flipped' : ''}`} 
                onClick={() => handleCardClick(index)}
              >
                <div className="card-face card-back gingham-pattern"></div>
                <div className="card-face card-front">
                   <img src={card.img} alt="art" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default GamePage;