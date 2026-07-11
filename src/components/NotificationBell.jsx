import { useEffect, useState, useRef } from 'react';
import api from '../services/api';

function NotificationBell() {
  const [count, setCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const fetchCount = async () => {
    try {
      const { data } = await api.get('/notifications/unread-count');
      setCount(data.data?.count || 0);
    } catch { /* empty */ }
  };

  const fetchNotifications = async () => {
    try {
      const { data } = await api.get('/notifications?limit=15');
      setNotifications(data.data || []);
    } catch { /* empty */ }
  };

  useEffect(() => { fetchCount(); const t = setInterval(fetchCount, 60000); return () => clearInterval(t); }, []);

  useEffect(() => {
    const handleClick = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const toggleOpen = () => {
    const next = !open;
    setOpen(next);
    if (next) fetchNotifications();
  };

  const markRead = async (id) => {
    try { await api.patch(`/notifications/${id}/read`); setCount((c) => Math.max(0, c - 1)); fetchNotifications(); }
    catch { /* empty */ }
  };

  const markAllRead = async () => {
    try { await api.patch('/notifications/read-all'); setCount(0); fetchNotifications(); }
    catch { /* empty */ }
  };

  const typeIcons = {
    SESSION_REMINDER: 'alarm-outline', SESSION_MISSED: 'alert-circle-outline',
    HOMEWORK_PENDING: 'document-text-outline', HOMEWORK_OVERDUE: 'warning-outline',
    BIRTHDAY: 'gift-outline', FEE_DUE: 'wallet-outline',
    SESSION_CONFLICT: 'repeat-outline', GOAL_DEADLINE: 'flag-outline',
    SUMMARY_EMAIL_FAILED: 'mail-outline', STUDENT_MILESTONE: 'trophy-outline',
  };

  const formatDate = (d) => {
    if (!d) return '';
    const date = new Date(d);
    const now = new Date();
    const diff = (now - date) / 1000;
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="notif-bell-wrapper" ref={ref}>
      <button className="notif-bell-btn" onClick={toggleOpen}>
        <ion-icon name="notifications-outline"></ion-icon>
        {count > 0 && <span className="notif-badge">{count > 9 ? '9+' : count}</span>}
      </button>

      {open && (
        <div className="notif-dropdown">
          <div className="notif-dropdown-header">
            <h3>Notifications</h3>
            {count > 0 && <button className="notif-mark-all" onClick={markAllRead}>Mark all read</button>}
          </div>
          <div className="notif-list">
            {notifications.length === 0 ? (
              <p className="notif-empty">No notifications</p>
            ) : (
              notifications.map((n) => (
                <div key={n._id} className={`notif-item${n.isRead ? '' : ' unread'}`} onClick={() => !n.isRead && markRead(n._id)}>
                  <div className="notif-icon">
                    <ion-icon name={typeIcons[n.type] || 'notifications-outline'}></ion-icon>
                  </div>
                  <div className="notif-content">
                    <span className="notif-title">{n.title}</span>
                    <span className="notif-message">{n.message}</span>
                    <span className="notif-time">{formatDate(n.createdAt)}</span>
                  </div>
                  {!n.isRead && <div className="notif-dot" />}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default NotificationBell;
