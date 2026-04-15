import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';

const CreatePostPage = () => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const [titleFocus, setTitleFocus] = useState(false);
  const [bodyFocus, setBodyFocus] = useState(false);
  const [btnHover, setBtnHover] = useState(false);
  const [btnActive, setBtnActive] = useState(false);
  const [cancelHover, setCancelHover] = useState(false);

  const [themeTrigger, setThemeTrigger] = useState(false);

  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleThemeChange = () => setThemeTrigger(prev => !prev);
    window.addEventListener("storage", handleThemeChange);

    const observer = new MutationObserver(handleThemeChange);
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });

    return () => {
      window.removeEventListener("storage", handleThemeChange);
      observer.disconnect();
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const isDark = document.body.classList.contains("dark-mode");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const fd = new FormData();
    fd.append('title', title);
    fd.append('body', body);
    if (image) fd.append('image', image);

    try {
      await API.post('/posts', fd);
      
      setTitle('');
      setBody('');
      setImage(null);
      if (preview) URL.revokeObjectURL(preview);
      setPreview(null);
      
      setShowSuccess(true);
      // Increased timeout slightly to allow for fade-out animation
      setTimeout(() => setShowSuccess(false), 3000); 
      
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to publish post');
    }
  };

  const styles = {
    page: {
      backgroundColor: isDark ? '#560032' : '#FAE8ED',
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '40px 20px',
      fontFamily: 'Georgia, serif',
      transition: 'all 0.3s ease',
      position: 'relative',
      overflow: 'hidden',
    },
    successToast: {
      position: 'fixed',
      top: '20px',
      right: '20px', 
      backgroundColor: isDark ? '#eca8b5' : 'rgb(12, 75, 52)',
      color: isDark ? '#560032' : '#f7c6d9',
      padding: '16px 30px',
      borderRadius: '50px',
      boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
      fontWeight: 'bold',
      fontSize: '16px',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      // Added opacity and transform for a smoother "pop" effect
      opacity: showSuccess ? 1 : 0,
      transform: showSuccess ? 'translateY(0)' : 'translateY(-20px)',
      pointerEvents: showSuccess ? 'auto' : 'none',
      transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    },
    container: {
      width: '100%',
      maxWidth: '750px',
      backgroundColor: isDark ? '#2e091e' : '#f7c6d9',
      padding: '40px',
      borderRadius: '30px',
      boxShadow: isDark ? '0 15px 40px rgba(0,0,0,0.6)' : '0 15px 40px rgba(0,0,0,0.1)',
    },
    heading: {
      fontSize: '32px',
      fontWeight: 'bold',
      marginBottom: '30px',
      textAlign: 'center',
      color: isDark ? '#f5f5f5' : 'rgb(12, 75, 52)',
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '24px',
    },
    inputGroup: {
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
    },
    label: {
      fontSize: '14px',
      fontWeight: 'bold',
      marginLeft: '15px',
      color: isDark ? '#eca8b5' : 'rgb(12, 75, 52)',
      opacity: 0.9,
    },
    input: {
      padding: '16px 25px',
      borderRadius: '50px',
      border: '2px solid transparent',
      fontSize: '16px',
      outline: 'none',
      backgroundColor: isDark ? '#3d1028' : '#fff',
      color: isDark ? '#fff' : 'rgb(12, 75, 52)',
      fontFamily: 'Georgia, serif',
      transition: '0.3s',
      boxSizing: 'border-box',
      width: '100%',
    },
    textarea: {
      padding: '20px 25px',
      borderRadius: '25px',
      border: '2px solid transparent',
      fontSize: '16px',
      outline: 'none',
      backgroundColor: isDark ? '#3d1028' : '#fff',
      color: isDark ? '#fff' : 'rgb(12, 75, 52)',
      fontFamily: 'Georgia, serif',
      minHeight: '300px',
      resize: 'none',
      transition: '0.3s',
      boxSizing: 'border-box',
      width: '100%',
    },
    focusBorder: {
      borderColor: isDark ? '#eca8b5' : 'rgb(12, 75, 52)',
      boxShadow: isDark ? '0 0 15px rgba(236, 168, 181, 0.2)' : '0 0 15px rgba(12, 75, 52, 0.1)',
    },
    uploadArea: {
      border: `2px dashed ${isDark ? '#eca8b5' : 'rgb(12, 75, 52)'}`,
      borderRadius: '20px',
      padding: '20px',
      textAlign: 'center',
      cursor: 'pointer',
      backgroundColor: isDark ? 'rgba(61, 16, 40, 0.5)' : 'rgba(255, 255, 255, 0.3)',
      transition: '0.3s',
    },
    preview: {
      width: '100%',
      maxHeight: '200px',
      objectFit: 'cover',
      borderRadius: '15px',
      marginBottom: '10px',
    },
    buttonRow: {
      display: 'flex',
      gap: '15px',
      marginTop: '10px'
    },
    button: {
      flex: 1,
      padding: '16px',
      borderRadius: '50px',
      border: 'none',
      fontSize: '18px',
      fontWeight: 'bold',
      cursor: 'pointer',
      backgroundColor: isDark ? '#eca8b5' : 'rgb(12, 75, 52)',
      color: isDark ? '#560032' : '#f7c6d9',
      transition: '0.3s',
    },
    cancelButton: {
      flex: 1,
      padding: '16px',
      borderRadius: '50px',
      border: `2px solid ${isDark ? '#eca8b5' : 'rgb(12, 75, 52)'}`,
      fontSize: '18px',
      fontWeight: 'bold',
      cursor: 'pointer',
      backgroundColor: 'transparent',
      color: isDark ? '#eca8b5' : 'rgb(12, 75, 52)',
      transition: '0.3s',
    },
    error: {
      backgroundColor: 'rgba(255, 77, 77, 0.1)',
      color: '#ff4d4d',
      padding: '12px',
      borderRadius: '12px',
      textAlign: 'center',
      fontSize: '14px',
      fontWeight: 'bold',
      marginBottom: '20px',
    }
  };

  const getButtonStyle = () => {
    let style = { ...styles.button };
    if (btnHover) {
      style.backgroundColor = isDark ? '#ff7aa2' : '#0a3d2b';
      style.transform = 'translateY(-2px)';
    }
    if (btnActive) style.transform = 'scale(0.98)';
    return style;
  };

  const getCancelStyle = () => {
    let style = { ...styles.cancelButton };
    if (cancelHover) {
      style.backgroundColor = isDark ? 'rgba(236, 168, 181, 0.1)' : 'rgba(12, 75, 52, 0.05)';
      style.transform = 'translateY(-2px)';
    }
    return style;
  };

  return (
    <div style={styles.page}>
      {/* SUCCESS TOAST - Now controlled by both style and state logic */}
      <div style={styles.successToast}>
        <span>✨</span> Post published successfully!
      </div>

      <div style={styles.container}>
        <h2 style={styles.heading}>Create New Post</h2>

        {error && <div style={styles.error}>{error}</div>}

        <form style={styles.form} onSubmit={handleSubmit}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter the title"
              required
              onFocus={() => setTitleFocus(true)}
              onBlur={() => setTitleFocus(false)}
              style={{
                ...styles.input,
                ...(titleFocus ? styles.focusBorder : {})
              }}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Post</label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Type post here..."
              required
              onFocus={() => setBodyFocus(true)}
              onBlur={() => setBodyFocus(false)}
              style={{
                ...styles.textarea,
                ...(bodyFocus ? styles.focusBorder : {})
              }}
            />
          </div>

          {user?.role === 'admin' && (
            <div style={styles.inputGroup}>
              <label style={styles.label}>Featured Image</label>
              <input
                type="file"
                accept="image/*"
                id="fileUpload"
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />
              <label htmlFor="fileUpload" style={styles.uploadArea}>
                {preview && <img src={preview} alt="Preview" style={styles.preview} />}
                <div style={{ fontWeight: 'bold', fontSize: '14px' }}>
                  {image ? `✓ ${image.name}` : 'Click to select cover photo'}
                </div>
              </label>
            </div>
          )}

          <div style={styles.buttonRow}>
            <button
              type="button"
              onClick={() => navigate(-1)} 
              style={getCancelStyle()}
              onMouseEnter={() => setCancelHover(true)}
              onMouseLeave={() => setCancelHover(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={getButtonStyle()}
              onMouseEnter={() => setBtnHover(true)}
              onMouseLeave={() => setBtnHover(false)}
              onMouseDown={() => setBtnActive(true)}
              onMouseUp={() => setBtnActive(false)}
            >
              Publish Post
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePostPage;