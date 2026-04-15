import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';

const AdminPage = () => {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [messages, setMessages] = useState([]);

  const [tab, setTab] = useState('users');
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  const [modal, setModal] = useState({
    show: false,
    type: '',
    id: null,
    action: null
  });

  // ================= DARK MODE (MATCH PROFILE PAGE) =================
  const [themeTrigger, setThemeTrigger] = useState(false);

  useEffect(() => {
    const handleThemeChange = () => setThemeTrigger(prev => !prev);

    window.addEventListener("storage", handleThemeChange);

    const observer = new MutationObserver(handleThemeChange);
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });

    return () => {
      window.removeEventListener("storage", handleThemeChange);
      observer.disconnect();
    };
  }, []);

  const isDark = document.body.classList.contains("dark-mode");

  // ================= COLORS =================
  const colors = {
    pinkBg: isDark ? '#560032' : '#fdecef',
    pinkCard: isDark ? '#2e091e' : '#fbd5e0',
    green: isDark ? '#f5f5f5' : '#0c4b34',
    greenLight: isDark ? '#eca8b5' : '#1f7a5c',
    white: isDark ? '#3d1028' : '#ffffff',
    border: isDark ? '#4a1a34' : '#e8a0b5',
    text: isDark ? '#ffffff' : '#0c4b34'
  };

  // ================= FETCH =================
  useEffect(() => {
    API.get('/admin/users').then(res => setUsers(res.data || []));
    API.get('/admin/posts').then(res => setPosts(res.data || []));
    API.get('/admin/comments').then(res => setComments(res.data || []));
    API.get('/admin/messages').then(res => setMessages(res.data || []));
  }, []);

  // ================= MODAL =================
  const openModal = (type, id, action = null) => {
    setModal({ show: true, type, id, action });
  };

  const closeModal = () => {
    setModal({ show: false, type: '', id: null, action: null });
  };

  const confirmAction = async () => {
    const { type, id, action } = modal;

    try {
      if (type === 'user') {
        const { data } = await API.put(`/admin/users/${id}/status`);
        setUsers(prev => prev.map(u => u._id === id ? data.user : u));
      }

      if (type === 'post') {
        await API.delete(`/posts/${id}`);
        setPosts(prev => prev.filter(p => p._id !== id));
      }

      if (type === 'comment') {
        await API.delete(`/comments/${id}`);
        setComments(prev => prev.filter(c => c._id !== id));
      }

      if (type === 'message' && action === 'delete') {
        await API.delete(`/admin/messages/${id}`);
        setMessages(prev => prev.filter(m => m._id !== id));
      }

      if (type === 'message' && action === 'read') {
        await API.put(`/admin/messages/${id}/read`);
        setMessages(prev =>
          prev.map(m =>
            m._id === id ? { ...m, status: 'read', read: true } : m
          )
        );
      }

      closeModal();
    } catch {
      alert("Action failed.");
    }
  };

  // ================= HELPERS =================
  const getMessageStatus = (m) =>
    (m.status === 'read' || m.read || m.isRead) ? 'READ' : 'NEW';

  const isMessageRead = (m) =>
    (m.status === 'read' || m.read || m.isRead);

  const getBadgeStyle = (status) => ({
    padding: '5px 10px',
    borderRadius: '10px',
    fontSize: '12px',
    color: isDark ? '#560032' : '#fff',
    background: status === 'READ'
      ? (isDark ? '#eca8b5' : '#1f7a5c')
      : '#ff8fab'
  });

  // ================= FILTER =================
  const filteredData = () => {
    const keyword = search.toLowerCase();

    let dataMap = { users, posts, comments, messages };
    let data = dataMap[tab] || [];

    data = data.filter(item =>
      JSON.stringify(item).toLowerCase().includes(keyword)
    );

    if (tab === 'users') {
      if (filter === 'active') data = data.filter(u => u.status === 'active');
      if (filter === 'inactive') data = data.filter(u => u.status !== 'active');
    }

    if (tab === 'posts') {
      if (filter === 'with-author') data = data.filter(p => p.author?.name);
      if (filter === 'no-author') data = data.filter(p => !p.author?.name);
    }

    if (tab === 'comments') {
      if (filter === 'with-text') data = data.filter(c => c.body);
      if (filter === 'empty') data = data.filter(c => !c.body);
    }

    if (tab === 'messages') {
      if (filter === 'read') data = data.filter(m => getMessageStatus(m) === 'READ');
      if (filter === 'unread') data = data.filter(m => getMessageStatus(m) === 'NEW');
    }

    return data;
  };

  // ================= STYLES =================
  const styles = {
    page: {
      background: colors.pinkBg,
      minHeight: '100vh',
      padding: '40px',
      color: colors.text,
      transition: 'all 0.3s ease'
    },
    container: {
      maxWidth: '1150px',
      margin: 'auto',
      background: colors.pinkCard,
      padding: '30px',
      borderRadius: '25px',
      boxShadow: isDark
        ? '0 10px 30px rgba(0,0,0,0.6)'
        : '0 10px 25px rgba(0,0,0,0.08)'
    },
    header: {
      textAlign: 'center',
      fontSize: '30px',
      fontWeight: '800',
      marginBottom: '20px'
    },
    tabs: {
      display: 'flex',
      justifyContent: 'center',
      gap: '10px',
      marginBottom: '15px'
    },
    tab: {
      padding: '10px 18px',
      borderRadius: '20px',
      border: `2px solid ${colors.green}`,
      background: colors.white,
      cursor: 'pointer',
      fontWeight: '600',
      color: colors.text
    },
    activeTab: {
      background: colors.greenLight,
      color: isDark ? '#560032' : '#fff'
    },
    filterBar: {
      display: 'flex',
      gap: '10px',
      marginBottom: '15px'
    },
    search: {
      flex: 1,
      padding: '10px',
      borderRadius: '10px',
      border: `1px solid ${colors.border}`,
      background: colors.white,
      color: colors.text
    },
    select: {
      padding: '10px',
      borderRadius: '10px',
      border: `1px solid ${colors.border}`,
      background: colors.white,
      color: colors.text
    },
    tableWrapper: {
      maxHeight: '450px',
      overflowY: 'auto',
      borderRadius: '15px',
      border: `2px solid ${colors.green}`
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse'
    },
    th: {
      position: 'sticky',
      top: 0,
      background: colors.greenLight,
      color: isDark ? '#560032' : '#fff',
      padding: '12px',
      textAlign: 'left'
    },
    td: {
      padding: '12px',
      borderBottom: `1px solid ${colors.border}`,
      color: colors.text,
      fontWeight: '600'
    },
    btn: {
      padding: '6px 12px',
      borderRadius: '10px',
      border: 'none',
      cursor: 'pointer',
      marginRight: '5px',
      fontWeight: '600'
    },
    modalOverlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: 'rgba(0,0,0,0.7)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    },
    modalBox: {
      background: isDark ? '#2e091e' : '#fff',
      color: colors.text,
      padding: '25px',
      borderRadius: '15px',
      textAlign: 'center',
      width: '320px'
    }
  };

  const options = {
    users: [
      { value: 'all', label: 'All Users' },
      { value: 'active', label: 'Active' },
      { value: 'inactive', label: 'Inactive' }
    ],
    posts: [
      { value: 'all', label: 'All Posts' },
      { value: 'with-author', label: 'With Author' },
      { value: 'no-author', label: 'No Author' }
    ],
    comments: [
      { value: 'all', label: 'All Comments' },
      { value: 'with-text', label: 'With Text' },
      { value: 'empty', label: 'Empty' }
    ],
    messages: [
      { value: 'all', label: 'All Messages' },
      { value: 'read', label: 'Read' },
      { value: 'unread', label: 'Unread' }
    ]
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>

        <div style={styles.header}>Admin Dashboard</div>

        <div style={styles.tabs}>
          {['users', 'posts', 'comments', 'messages'].map(t => (
            <button
              key={t}
              onClick={() => {
                setTab(t);
                setSearch('');
                setFilter('all');
              }}
              style={{
                ...styles.tab,
                ...(tab === t ? styles.activeTab : {})
              }}
            >
              {t.toUpperCase()}
            </button>
          ))}
        </div>

        <div style={styles.filterBar}>
          <input
            style={styles.search}
            placeholder={`Search ${tab}`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            style={styles.select}
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            {options[tab].map(opt => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr>
                {tab === 'users' && <>
                  <th style={styles.th}>Name</th>
                  <th style={styles.th}>Email</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Action</th>
                </>}
                {tab === 'posts' && <>
                  <th style={styles.th}>Title</th>
                  <th style={styles.th}>Author</th>
                  <th style={styles.th}>Action</th>
                </>}
                {tab === 'comments' && <>
                  <th style={styles.th}>Author</th>
                  <th style={styles.th}>Comment</th>
                  <th style={styles.th}>Action</th>
                </>}
                {tab === 'messages' && <>
                  <th style={styles.th}>Name</th>
                  <th style={styles.th}>Email</th>
                  <th style={styles.th}>Message</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Action</th>
                </>}
              </tr>
            </thead>

            <tbody>
              {tab === 'users' && filteredData().map(u => {
                const isActive = u.status === 'active';
                return (
                  <tr key={u._id}>
                    <td style={styles.td}>{u.name}</td>
                    <td style={styles.td}>{u.email}</td>
                    <td style={styles.td}>{u.status}</td>
                    <td style={styles.td}>
                      <button
                        style={{
                          ...styles.btn,
                          background: isActive ? '#d62828' : colors.greenLight,
                          color: '#fff'
                        }}
                        onClick={() => openModal('user', u._id)}
                      >
                        {isActive ? 'DEACTIVATE' : 'ACTIVATE'}
                      </button>
                    </td>
                  </tr>
                );
              })}

              {tab === 'posts' && filteredData().map(p => (
                <tr key={p._id}>
                  <td style={styles.td}>{p.title}</td>
                  <td style={styles.td}>{p.author?.name}</td>
                  <td style={styles.td}>
                    <button
                      style={{ ...styles.btn, background: colors.greenLight, color: '#fff' }}
                      onClick={() => navigate(`/posts/${p._id}`)}
                    >
                      View
                    </button>
                    <button
                      style={{ ...styles.btn, background: '#d62828', color: '#fff' }}
                      onClick={() => openModal('post', p._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}

              {tab === 'comments' && filteredData().map(c => (
                <tr key={c._id}>
                  <td style={styles.td}>{c.author?.name}</td>
                  <td style={styles.td}>{c.body}</td>
                  <td style={styles.td}>
                    <button
                      style={{ ...styles.btn, background: '#d62828', color: '#fff' }}
                      onClick={() => openModal('comment', c._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}

              {tab === 'messages' && filteredData().map(m => {
                const status = getMessageStatus(m);
                return (
                  <tr key={m._id}>
                    <td style={styles.td}>{m.name}</td>
                    <td style={styles.td}>{m.email}</td>
                    <td style={styles.td}>{m.body || m.message}</td>
                    <td style={styles.td}>
                      <span style={getBadgeStyle(status)}>{status}</span>
                    </td>
                    <td style={styles.td}>
                      {!isMessageRead(m) && (
                        <button
                          style={{ ...styles.btn, background: colors.greenLight, color: '#fff' }}
                          onClick={() => openModal('message', m._id, 'read')}
                        >
                          Mark As Read
                        </button>
                      )}
                      <button
                        style={{ ...styles.btn, background: '#d62828', color: '#fff' }}
                        onClick={() => openModal('message', m._id, 'delete')}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {modal.show && (
          <div style={styles.modalOverlay}>
            <div style={styles.modalBox}>
              <h3>Confirm Action</h3>
              <p>Are you sure you want to proceed?</p>

              <button
                style={{ ...styles.btn, background: '#d62828', color: '#fff' }}
                onClick={confirmAction}
              >
                Yes
              </button>

              <button
                style={{ ...styles.btn, background: '#ccc' }}
                onClick={closeModal}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default AdminPage;