// frontend/src/pages/LoginPage.js

import { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const [identifierFocus, setIdentifierFocus] = useState(false);
  const [passwordFocus, setPasswordFocus] = useState(false);
  const [buttonHover, setButtonHover] = useState(false);
  const [buttonActive, setButtonActive] = useState(false);

  // 👇 used to force re-render on theme change
  const [themeTrigger, setThemeTrigger] = useState(false);

  const navigate = useNavigate();
  const identifierRef = useRef(null);

  const { setUser } = useAuth();

  useEffect(() => {
    identifierRef.current?.focus();
  }, []);

  // 👇 LISTEN TO THEME CHANGE
  useEffect(() => {
    const handleThemeChange = () => {
      setThemeTrigger(prev => !prev);
    };

    window.addEventListener("storage", handleThemeChange);
    return () => window.removeEventListener("storage", handleThemeChange);
  }, []);

  // 👇 detect dark mode
  const isDark = document.body.classList.contains("dark-mode");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const { data } = await API.post('/auth/login', {
        identifier,
        password
      });

      const { user, token } = data;

      localStorage.setItem('token', token);
      setUser(user);

      const role = user?.role || 'user';
      navigate(role === 'admin' ? '/admin' : '/profile');

    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.message ||
        'Login failed. Please check your credentials.'
      );
    }
  };

  const styles = {
    page: {
      backgroundColor: isDark ? '#560032' : '#FAE8ED',
      minHeight: '90vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      fontFamily: 'Georgia, serif',
      color: isDark ? '#f5f5f5' : 'rgb(12, 75, 52)'
    },

    container: {
      backgroundColor: isDark ? '#2e091e' : '#f7c6d9',
      padding: '40px',
      borderRadius: '20px',
      boxShadow: isDark
        ? '0 10px 30px rgba(0,0,0,0.6)'
        : '0 10px 30px rgba(0,0,0,0.1)',
      maxWidth: '400px',
      width: '100%',
      textAlign: 'center'
    },

    heading: {
      fontSize: '36px',
      marginBottom: '20px',
      fontWeight: 'bold'
    },

    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '18px'
    },

    input: {
      padding: '15px 20px',
      borderRadius: '50px',
      border: '2px solid transparent',
      fontSize: '16px',
      transition: 'all 0.3s ease',
      outline: 'none',
      backgroundColor: isDark ? '#2a2a2a' : '#f7c6d9',
      color: isDark ? '#ffffff' : 'rgb(12, 75, 52)',
      fontFamily: 'Georgia, serif'
    },

    inputFocus: {
      backgroundColor: isDark ? '#333' : '#ffffff',
      borderColor: isDark ? '#f9a7c0' : 'rgb(12, 75, 52)',
      boxShadow: isDark
        ? '0 8px 20px rgba(255, 122, 162, 0.2)'
        : '0 8px 20px rgba(12, 75, 52, 0.1)'
    },

    button: {
      padding: '16px 40px',
      borderRadius: '50px',
      border: 'none',
      fontWeight: 'bold',
      fontSize: '16px',
      cursor: 'pointer',
      backgroundColor: isDark ? '#eca8b5' : 'rgb(12, 75, 52)',
      color: isDark ? '#fff' : '#f7c6d9',
      transition: 'all 0.3s ease',
      boxShadow: isDark
        ? '0 4px 15px rgba(255, 77, 109, 0.4)'
        : '0 4px 15px rgba(12, 75, 52, 0.2)'
    },

    buttonHover: {
      backgroundColor: '#ff7aa2',
      color: '#ffffff',
      transform: 'scale(1.05)'
    },

    buttonActive: {
      backgroundColor: '#ff7aa2',
      color: '#ffffff',
      transform: 'scale(0.98)'
    },

    error: {
      color: '#ff4d4d',
      fontSize: '0.9rem',
      marginBottom: '10px',
      fontWeight: '500'
    },

    link: {
      color: isDark ? '#ff7aa2' : 'rgb(12, 75, 52)',
      fontWeight: 'bold',
      textDecoration: 'none'
    }
  };

  const getButtonStyle = () => {
    if (buttonActive) return { ...styles.button, ...styles.buttonActive };
    if (buttonHover) return { ...styles.button, ...styles.buttonHover };
    return styles.button;
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h2 style={styles.heading}>Login to TheFolio</h2>

        {error && <p style={styles.error}>{error}</p>}

        <form style={styles.form} onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Email or Username"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            required
            ref={identifierRef}
            style={
              identifierFocus
                ? { ...styles.input, ...styles.inputFocus }
                : styles.input
            }
            onFocus={() => setIdentifierFocus(true)}
            onBlur={() => setIdentifierFocus(false)}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={
              passwordFocus
                ? { ...styles.input, ...styles.inputFocus }
                : styles.input
            }
            onFocus={() => setPasswordFocus(true)}
            onBlur={() => setPasswordFocus(false)}
          />

          <button
            type="submit"
            style={getButtonStyle()}
            onMouseEnter={() => setButtonHover(true)}
            onMouseLeave={() => setButtonHover(false)}
            onMouseDown={() => setButtonActive(true)}
            onMouseUp={() => setButtonActive(false)}
          >
            Login
          </button>
        </form>

        <p style={{ marginTop: '20px' }}>
          Don't have an account?{' '}
          <Link to="/register" style={styles.link}>
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;