import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import API, { BACKEND_URL } from '../api/axios';

const ProfilePage = () => {
  const { user, setUser } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [username, setUsername] = useState(user?.username || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [pic, setPic] = useState(null);
  const [preview, setPreview] = useState(null);
  const [curPw, setCurPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [toast, setToast] = useState({ msg: '', type: '' });

  // 👇 1. Force re-render when the theme toggle is clicked (matches your LoginPage logic)
  const [themeTrigger, setThemeTrigger] = useState(false);

  useEffect(() => {
    const handleThemeChange = () => setThemeTrigger(prev => !prev);
    
    // Listen for storage changes (cross-tab)
    window.addEventListener("storage", handleThemeChange);
    
    // Listen for class changes on document.body (same tab)
    const observer = new MutationObserver(handleThemeChange);
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });

    return () => {
      window.removeEventListener("storage", handleThemeChange);
      observer.disconnect();
    };
  }, []);

  // 👇 2. Detect dark mode from document.body
  const isDark = document.body.classList.contains("dark-mode");

  /* ================= TOAST AUTO HIDE ================= */
  useEffect(() => {
    if (!toast.msg) return;
    const timer = setTimeout(() => setToast({ msg: '', type: '' }), 3000);
    return () => clearTimeout(timer);
  }, [toast]);

  /* ================= PROFILE UPDATE ================= */
  const handleProfile = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append('name', name);
    fd.append('bio', bio);
    fd.append('username', username);
    if (pic) fd.append('profilePic', pic);

    try {
      const { data } = await API.put('/auth/profile', fd);
      setUser(data);
      setToast({ msg: 'Profile updated successfully!', type: 'success' });
    } catch (err) {
      setToast({ msg: err.response?.data?.message || 'Error updating profile', type: 'error' });
    }
  };

  /* ================= PASSWORD UPDATE ================= */
  const handlePassword = async (e) => {
    e.preventDefault();
    try {
      await API.put('/auth/change-password', {
        currentPassword: curPw,
        newPassword: newPw,
      });
      setToast({ msg: 'Password changed successfully!', type: 'success' });
      setCurPw('');
      setNewPw('');
    } catch (err) {
      setToast({ msg: err.response?.data?.message || 'Error changing password', type: 'error' });
    }
  };

  /* ================= IMAGE PREVIEW ================= */
  const handleFileChange = (file) => {
    setPic(file);
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const getImageUrl = (image) => {
    if (!image) return '';
    if (image.startsWith('http://') || image.startsWith('https://')) return image;
    const normalized = image.replace(/\\/g, '/');
    const fileName = normalized.replace(/^\/?uploads\//, '');
    return `${BACKEND_URL}/uploads/${fileName}`;
  };

  const picSrc = preview
    ? preview
    : user?.profilePic
    ? getImageUrl(user.profilePic)
    : '/default-avatar.png';

  /* ================= STYLES (TheFolio Theme) ================= */
  const styles = {
    page: {
      backgroundColor: isDark ? '#560032' : '#FAE8ED',
      minHeight: '100vh',
      padding: '40px 20px',
      display: 'flex',
      justifyContent: 'center',
      fontFamily: 'Georgia, serif',
      color: isDark ? '#f5f5f5' : 'rgb(12, 75, 52)',
      transition: 'all 0.3s ease',
    },
    container: {
      width: '100%',
      maxWidth: '600px',
      display: 'flex',
      flexDirection: 'column',
      gap: '25px',
    },
    card: {
      backgroundColor: isDark ? '#2e091e' : '#f7c6d9',
      padding: '30px',
      borderRadius: '20px',
      boxShadow: isDark ? '0 10px 30px rgba(0,0,0,0.6)' : '0 10px 30px rgba(0,0,0,0.1)',
      textAlign: 'left',
    },
    header: {
      textAlign: 'center',
      marginBottom: '10px',
    },
    profilePic: {
      width: '120px',
      height: '120px',
      borderRadius: '50%',
      objectFit: 'cover',
      border: `3px solid ${isDark ? '#eca8b5' : 'rgb(12, 75, 52)'}`,
      marginBottom: '15px',
    },
    input: {
      width: '100%',
      padding: '15px 20px',
      borderRadius: '50px',
      border: '2px solid transparent',
      fontSize: '15px',
      marginBottom: '15px',
      outline: 'none',
      backgroundColor: isDark ? '#3d1028' : '#fff',
      color: isDark ? '#ffffff' : 'rgb(12, 75, 52)',
      fontFamily: 'Georgia, serif',
      boxSizing: 'border-box',
    },
    textarea: {
      width: '100%',
      padding: '15px 20px',
      borderRadius: '20px',
      border: '2px solid transparent',
      fontSize: '15px',
      marginBottom: '15px',
      outline: 'none',
      backgroundColor: isDark ? '#3d1028' : '#fff',
      color: isDark ? '#ffffff' : 'rgb(12, 75, 52)',
      fontFamily: 'Georgia, serif',
      boxSizing: 'border-box',
      resize: 'none',
    },
    button: {
      width: '100%',
      padding: '14px',
      borderRadius: '50px',
      border: 'none',
      fontWeight: 'bold',
      fontSize: '16px',
      cursor: 'pointer',
      backgroundColor: isDark ? '#eca8b5' : 'rgb(12, 75, 52)',
      color: isDark ? '#560032' : '#f7c6d9',
      transition: 'all 0.3s ease',
      marginTop: '10px'
    },
    label: {
      display: 'block',
      marginBottom: '8px',
      marginLeft: '15px',
      fontSize: '14px',
      fontWeight: 'bold',
      opacity: 0.8,
    },
    toast: {
      position: 'fixed',
      top: '30px',
      right: '30px',
      padding: '16px 24px',
      borderRadius: '50px',
      color: '#fff',
      backgroundColor: toast.type === 'success' ? '#10b981' : '#ef4444',
      zIndex: 1000,
      boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
    }
  };

  return (
    <div style={styles.page}>
      {toast.msg && <div style={styles.toast}>{toast.msg}</div>}

      <div style={styles.container}>
        {/* PROFILE CARD */}
        <div style={styles.card}>
          <div style={styles.header}>
            <img src={picSrc} alt="Profile" style={styles.profilePic} />
            <h2 style={{ margin: '0', fontSize: '24px' }}>@{user?.username}</h2>
            <p style={{ fontStyle: 'italic', opacity: 0.8 }}>{user?.bio || "No bio yet."}</p>
          </div>
        </div>

        {/* EDIT PROFILE */}
        <form style={styles.card} onSubmit={handleProfile}>
          <h3 style={{ marginTop: 0, marginBottom: '20px' }}>Edit Information</h3>
          
          <label style={styles.label}>Full Name</label>
          <input
            style={styles.input}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
          />

          {/* 👇 ADDED EMAIL FIELD HERE */}
          <label style={styles.label}>Email Address (Permanent)</label>
          <input
            style={{ ...styles.input, opacity: 0.6, cursor: 'not-allowed' }}
            value={user?.email || ""}
            disabled
            placeholder="Email"
          />

          <label style={styles.label}>Username</label>
          <input
            style={styles.input}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
          />

          <label style={styles.label}>Bio</label>
          <textarea
            style={styles.textarea}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={3}
            placeholder="Tell us about yourself..."
          />

          <label style={styles.label}>Profile Picture</label>
          <div style={{ ...styles.input, borderRadius: '20px', display: 'flex', alignItems: 'center' }}>
            <input
              type="file"
              onChange={(e) => handleFileChange(e.target.files[0])}
            />
          </div>

          <button type="submit" style={styles.button}>Save Profile</button>
        </form>

        {/* SECURITY */}
        <form style={styles.card} onSubmit={handlePassword}>
          <h3 style={{ marginTop: 0, marginBottom: '20px' }}>Security</h3>
          
          <div style={{ position: 'relative' }}>
            <input
              type={showPw ? "text" : "password"}
              placeholder="Current Password"
              value={curPw}
              onChange={(e) => setCurPw(e.target.value)}
              style={styles.input}
            />
            <span 
              onClick={() => setShowPw(!showPw)}
              style={{
                position: 'absolute', right: '20px', top: '15px', 
                cursor: 'pointer', fontSize: '12px', fontWeight: 'bold',
                color: isDark ? '#eca8b5' : 'rgb(12, 75, 52)'
              }}
            >
              {showPw ? "HIDE" : "SHOW"}
            </span>
          </div>

          <input
            type={showPw ? "text" : "password"}
            placeholder="New Password"
            value={newPw}
            onChange={(e) => setNewPw(e.target.value)}
            style={styles.input}
          />

          <button type="submit" style={styles.button}>Update Password</button>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;