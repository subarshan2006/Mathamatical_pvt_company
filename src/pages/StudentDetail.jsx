import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

function StudentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sessionsLoading, setSessionsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get(`/students/${id}`);
        setStudent(data.data);
      } catch {
        navigate('/students');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, navigate]);

  useEffect(() => {
    if (!student) return;
    const loadSessions = async () => {
      try {
        const { data } = await api.get(`/sessions/student/${id}?limit=20`);
        setSessions(data.data || []);
      } catch {
        // empty
      } finally {
        setSessionsLoading(false);
      }
    };
    loadSessions();
  }, [student, id]);

  const formatDate = (d) => {
    if (!d) return '';
    return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatTime = (t) => {
    if (!t) return '';
    const [h, m] = t.split(':');
    const hr = parseInt(h, 10);
    return `${hr > 12 ? hr - 12 : hr || 12}:${m} ${hr >= 12 ? 'PM' : 'AM'}`;
  };

  const statusColors = { ACTIVE: 'status-active', PAUSED: 'status-paused', GRADUATED: 'status-graduated', DROPPED: 'status-dropped' };

  if (loading) {
    return <div className="page-loading"><div className="auth-spinner" /><p>Loading student...</p></div>;
  }

  if (!student) return null;

  return (
    <div className="page-container">
      <button className="back-btn" onClick={() => navigate('/students')}>
        <ion-icon name="arrow-back-outline"></ion-icon> Back to Students
      </button>

      <div className="student-detail-header">
        <div className="student-detail-avatar">{student.name?.charAt(0).toUpperCase()}</div>
        <div className="student-detail-info">
          <h1>{student.name}</h1>
          <div className="student-detail-meta">
            <span className={`status-tag ${statusColors[student.status] || ''}`}>{student.status}</span>
            {student.grade && <span className="meta-pill">{student.grade}</span>}
            {student.age && <span className="meta-pill">Age {student.age}</span>}
            {student.school && <span className="meta-pill">{student.school}</span>}
          </div>
        </div>
      </div>

      {/* Info Cards */}
      <div className="student-detail-grid">
        <div className="detail-card">
          <h3><ion-icon name="call-outline"></ion-icon> Parent Contact</h3>
          <div className="detail-card-body">
            <p><strong>{student.parentName}</strong></p>
            <p>{student.parentMobile}</p>
            <p>{student.parentEmail}</p>
          </div>
        </div>
        {student.studentEmail && (
          <div className="detail-card">
            <h3><ion-icon name="mail-outline"></ion-icon> Student Email</h3>
            <div className="detail-card-body">
              <p>{student.studentEmail}</p>
            </div>
          </div>
        )}
        {student.monthlyFee > 0 && (
          <div className="detail-card">
            <h3><ion-icon name="wallet-outline"></ion-icon> Monthly Fee</h3>
            <div className="detail-card-body">
              <p className="fee-amount">${student.monthlyFee}</p>
            </div>
          </div>
        )}
        {student.joiningDate && (
          <div className="detail-card">
            <h3><ion-icon name="calendar-outline"></ion-icon> Joining Date</h3>
            <div className="detail-card-body">
              <p>{formatDate(student.joiningDate)}</p>
            </div>
          </div>
        )}
      </div>

      {student.notes && (
        <div className="detail-card detail-card-full">
          <h3><ion-icon name="document-text-outline"></ion-icon> Notes</h3>
          <div className="detail-card-body">
            <p>{student.notes}</p>
          </div>
        </div>
      )}

      {/* Session History */}
      <div className="detail-section">
        <h2 className="detail-section-title">
          <ion-icon name="time-outline"></ion-icon> Session History
        </h2>
        {sessionsLoading ? (
          <div className="page-loading"><div className="auth-spinner" /></div>
        ) : sessions.length === 0 ? (
          <p className="dashboard-no-data">No sessions recorded</p>
        ) : (
          <div className="dashboard-table-wrapper">
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Topic</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {sessions.map((s) => (
                  <tr key={s._id}>
                    <td>{formatDate(s.date)}</td>
                    <td>{formatTime(s.startTime)} - {formatTime(s.endTime)}</td>
                    <td>{s.topicPlanned || '—'}</td>
                    <td><span className={`session-status status-${s.status?.toLowerCase()}`}>{s.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default StudentDetail;
