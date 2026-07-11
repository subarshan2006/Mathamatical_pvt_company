import { useEffect, useState, useCallback } from 'react';
import api from '../services/api';

function Sessions() {
  const [sessions, setSessions] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('list');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });

  const [showModal, setShowModal] = useState(false);
  const [editSession, setEditSession] = useState(null);
  const [form, setForm] = useState({
    studentId: '', date: '', startTime: '', endTime: '',
    duration: '60', topicPlanned: '', personalNotes: '',
  });
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchStudents = async () => {
    try {
      const { data } = await api.get('/students?limit=100&status=ACTIVE');
      setStudents(data.data || []);
    } catch { /* empty */ }
  };

  const fetchSessions = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const params = { page, limit: 15 };
      if (statusFilter) params.status = statusFilter;
      if (dateRange.start) params.startDate = dateRange.start;
      if (dateRange.end) params.endDate = dateRange.end;
      const { data } = await api.get('/sessions', { params });
      setSessions(data.data || []);
      setPagination({
        page: data.meta?.page || 1,
        totalPages: data.meta?.totalPages || 1,
        total: data.meta?.total || 0,
      });
    } catch { /* empty */ }
    finally { setLoading(false); }
  }, [statusFilter, dateRange]);

  useEffect(() => { fetchStudents(); }, []);
  useEffect(() => { fetchSessions(1); }, [fetchSessions]);

  const resetForm = () => {
    setForm({ studentId: '', date: '', startTime: '', endTime: '', duration: '60', topicPlanned: '', personalNotes: '' });
    setFormError('');
    setEditSession(null);
  };

  const openCreate = () => { resetForm(); setShowModal(true); };
  const openEdit = (s) => {
    setEditSession(s);
    setForm({
      studentId: s.studentId?._id || '',
      date: s.date ? new Date(s.date).toISOString().split('T')[0] : '',
      startTime: s.startTime || '',
      endTime: s.endTime || '',
      duration: s.duration?.toString() || '60',
      topicPlanned: s.topicPlanned || '',
      personalNotes: s.personalNotes || '',
    });
    setShowModal(true);
  };

  const calcDuration = (start, end) => {
    if (!start || !end) return;
    const [sh, sm] = start.split(':').map(Number);
    const [eh, em] = end.split(':').map(Number);
    const diff = (eh * 60 + em) - (sh * 60 + sm);
    if (diff > 0) setForm((f) => ({ ...f, duration: diff.toString() }));
  };

  const handleTimeChange = (field, val) => {
    const next = { ...form, [field]: val };
    if (field === 'startTime') calcDuration(val, form.endTime);
    if (field === 'endTime') calcDuration(form.startTime, val);
    setForm(next);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setSubmitting(true);
    try {
      const body = {
        studentId: form.studentId,
        date: form.date,
        startTime: form.startTime,
        endTime: form.endTime,
        duration: parseInt(form.duration, 10) || 60,
        topicPlanned: form.topicPlanned || undefined,
        personalNotes: form.personalNotes || undefined,
      };
      if (editSession) {
        await api.put(`/sessions/${editSession._id}`, body);
      } else {
        await api.post('/sessions', body);
      }
      setShowModal(false);
      resetForm();
      fetchSessions(pagination.page);
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to save session');
    } finally { setSubmitting(false); }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await api.patch(`/sessions/${id}/status`, { status });
      fetchSessions(pagination.page);
    } catch { /* empty */ }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this session?')) return;
    try {
      await api.delete(`/sessions/${id}`);
      fetchSessions(pagination.page);
    } catch { /* empty */ }
  };

  const formatDate = (d) => {
    if (!d) return '';
    return new Date(d).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  const formatTime = (t) => {
    if (!t) return '';
    const [h, m] = t.split(':');
    const hr = parseInt(h, 10);
    return `${hr > 12 ? hr - 12 : hr || 12}:${m} ${hr >= 12 ? 'PM' : 'AM'}`;
  };

  const groupedByDate = {};
  sessions.forEach((s) => {
    const key = new Date(s.date).toISOString().split('T')[0];
    if (!groupedByDate[key]) groupedByDate[key] = [];
    groupedByDate[key].push(s);
  });

  return (
    <div className="page-container">
      <header className="page-header">
        <div>
          <h1 className="page-title">Sessions</h1>
          <p className="page-subtitle">{pagination.total} total sessions</p>
        </div>
        <div className="page-header-actions">
          <div className="view-toggle">
            <button className={`view-btn${view === 'list' ? ' active' : ''}`} onClick={() => setView('list')}>
              <ion-icon name="list-outline"></ion-icon>
            </button>
            <button className={`view-btn${view === 'calendar' ? ' active' : ''}`} onClick={() => setView('calendar')}>
              <ion-icon name="calendar-outline"></ion-icon>
            </button>
          </div>
          <button className="page-action-btn" onClick={openCreate}>
            <ion-icon name="add-outline"></ion-icon>
            <span>New Session</span>
          </button>
        </div>
      </header>

      {/* Filters */}
      <div className="page-filters">
        <div className="page-filter-btns">
          {['', 'SCHEDULED', 'COMPLETED', 'CANCELLED', 'MISSED'].map((s) => (
            <button key={s} className={`filter-btn${statusFilter === s ? ' active' : ''}`} onClick={() => setStatusFilter(s)}>
              {s || 'All'}
            </button>
          ))}
        </div>
        <div className="date-range-filter">
          <input type="date" value={dateRange.start} onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })} />
          <span className="date-range-sep">to</span>
          <input type="date" value={dateRange.end} onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })} />
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="page-loading"><div className="auth-spinner" /><p>Loading sessions...</p></div>
      ) : sessions.length === 0 ? (
        <div className="page-empty">
          <ion-icon name="calendar-outline"></ion-icon>
          <h3>No sessions found</h3>
          <p>Schedule your first session to get started.</p>
        </div>
      ) : view === 'list' ? (
        <>
          <div className="dashboard-table-wrapper">
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Student</th>
                  <th>Topic</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {sessions.map((s) => (
                  <tr key={s._id}>
                    <td>{formatDate(s.date)}</td>
                    <td>{formatTime(s.startTime)} - {formatTime(s.endTime)}</td>
                    <td>{s.studentId?.name || 'Unknown'}</td>
                    <td>{s.topicPlanned || '—'}</td>
                    <td><span className={`session-status status-${s.status?.toLowerCase()}`}>{s.status}</span></td>
                    <td className="table-actions">
                      <button className="table-action-btn" onClick={() => openEdit(s)} title="Edit">
                        <ion-icon name="create-outline"></ion-icon>
                      </button>
                      {s.status === 'SCHEDULED' && (
                        <>
                          <button className="table-action-btn table-action-success" onClick={() => handleStatusChange(s._id, 'COMPLETED')} title="Complete">
                            <ion-icon name="checkmark-circle-outline"></ion-icon>
                          </button>
                          <button className="table-action-btn table-action-danger" onClick={() => handleStatusChange(s._id, 'CANCELLED')} title="Cancel">
                            <ion-icon name="close-circle-outline"></ion-icon>
                          </button>
                        </>
                      )}
                      <button className="table-action-btn table-action-danger" onClick={() => handleDelete(s._id)} title="Delete">
                        <ion-icon name="trash-outline"></ion-icon>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {pagination.totalPages > 1 && (
            <div className="page-pagination">
              <button disabled={pagination.page <= 1} onClick={() => fetchSessions(pagination.page - 1)}>
                <ion-icon name="chevron-back-outline"></ion-icon> Prev
              </button>
              <span>Page {pagination.page} of {pagination.totalPages}</span>
              <button disabled={pagination.page >= pagination.totalPages} onClick={() => fetchSessions(pagination.page + 1)}>
                Next <ion-icon name="chevron-forward-outline"></ion-icon>
              </button>
            </div>
          )}
        </>
      ) : (
        /* Calendar View */
        <div className="calendar-view">
          {Object.keys(groupedByDate).sort().map((dateKey) => (
            <div key={dateKey} className="calendar-day-group">
              <h3 className="calendar-day-title">{formatDate(dateKey)}</h3>
              <div className="calendar-day-sessions">
                {groupedByDate[dateKey].map((s) => (
                  <div key={s._id} className={`calendar-session-card status-bg-${s.status?.toLowerCase()}`} onClick={() => openEdit(s)}>
                    <div className="calendar-session-time">
                      {formatTime(s.startTime)} - {formatTime(s.endTime)}
                    </div>
                    <div className="calendar-session-info">
                      <span className="calendar-session-student">{s.studentId?.name || 'Unknown'}</span>
                      <span className="calendar-session-topic">{s.topicPlanned || 'No topic'}</span>
                    </div>
                    <span className={`session-status status-${s.status?.toLowerCase()}`}>{s.status}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Session Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editSession ? 'Edit Session' : 'New Session'}</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                <ion-icon name="close-outline"></ion-icon>
              </button>
            </div>
            {formError && <div className="form-error"><ion-icon name="alert-circle-outline"></ion-icon>{formError}</div>}
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group">
                <label>Student *</label>
                <select value={form.studentId} onChange={(e) => setForm({ ...form, studentId: e.target.value })} required>
                  <option value="">Select student</option>
                  {students.map((s) => (
                    <option key={s._id} value={s._id}>{s.name} {s.grade ? `(${s.grade})` : ''}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Date *</label>
                <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Start Time *</label>
                  <input type="time" value={form.startTime} onChange={(e) => handleTimeChange('startTime', e.target.value)} required />
                </div>
                <div className="form-group">
                  <label>End Time *</label>
                  <input type="time" value={form.endTime} onChange={(e) => handleTimeChange('endTime', e.target.value)} required />
                </div>
                <div className="form-group">
                  <label>Duration (min)</label>
                  <input type="number" min="15" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} />
                </div>
              </div>
              <div className="form-group">
                <label>Topic Planned</label>
                <input type="text" value={form.topicPlanned} onChange={(e) => setForm({ ...form, topicPlanned: e.target.value })} placeholder="e.g. Quadratic Equations" />
              </div>
              <div className="form-group">
                <label>Notes</label>
                <textarea rows="3" value={form.personalNotes} onChange={(e) => setForm({ ...form, personalNotes: e.target.value })} />
              </div>
              <div className="modal-actions">
                <button type="button" className="modal-btn-cancel" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="modal-btn-submit" disabled={submitting}>
                  {submitting ? 'Saving...' : editSession ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Sessions;
