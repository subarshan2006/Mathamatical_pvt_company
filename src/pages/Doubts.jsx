import { useEffect, useState, useCallback } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

function Doubts() {
  const [items, setItems] = useState([]);
  const [students, setStudents] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [showAnswer, setShowAnswer] = useState(null);
  const [form, setForm] = useState({ studentId: '', question: '', topic: '', subject: '', priority: 'MEDIUM' });
  const [answerForm, setAnswerForm] = useState({ answer: '', resolutionNotes: '' });
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchStudents = async () => {
    try { const { data } = await api.get('/students?limit=100&status=ACTIVE'); setStudents(data.data || []); } catch { /* empty */ }
  };

  const fetchItems = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const params = { page, limit: 12 };
      if (statusFilter) params.status = statusFilter;
      const { data } = await api.get('/doubts', { params });
      setItems(data.data || []);
      setPagination({ page: data.meta?.page || 1, totalPages: data.meta?.totalPages || 1, total: data.meta?.total || 0 });
    } catch { /* empty */ }
    finally { setLoading(false); }
  }, [statusFilter]);

  useEffect(() => { fetchStudents(); }, []);
  useEffect(() => { fetchItems(1); }, [fetchItems]);

  const resetForm = () => {
    setForm({ studentId: '', question: '', topic: '', subject: '', priority: 'MEDIUM' });
    setFormError(''); setShowForm(false);
  };

  const handleCreate = async (e) => {
    e.preventDefault(); setFormError(''); setSubmitting(true);
    try {
      await api.post('/doubts', form);
      toast.success('Doubt logged'); resetForm(); fetchItems(1);
    } catch (err) { setFormError(err.response?.data?.message || 'Failed'); }
    finally { setSubmitting(false); }
  };

  const handleAnswer = async (id) => {
    setSubmitting(true);
    try {
      await api.patch(`/doubts/${id}/answer`, answerForm);
      toast.success('Answer submitted'); setShowAnswer(null); setAnswerForm({ answer: '', resolutionNotes: '' }); fetchItems(pagination.page);
    } catch { toast.error('Failed'); }
    finally { setSubmitting(false); }
  };

  const handleResolve = async (id) => {
    try { await api.patch(`/doubts/${id}/resolve`); toast.success('Doubt resolved'); fetchItems(pagination.page); }
    catch { toast.error('Failed'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this doubt?')) return;
    try { await api.delete(`/doubts/${id}`); toast.success('Deleted'); fetchItems(pagination.page); }
    catch { toast.error('Failed to delete'); }
  };

  const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '';
  const statusColors = { OPEN: 'status-scheduled', ANSWERED: 'status-active', PENDING_REVIEW: 'status-missed', RESOLVED: 'status-completed' };

  return (
    <div className="page-container">
      <header className="page-header">
        <div><h1 className="page-title">Doubt Log</h1><p className="page-subtitle">{pagination.total} doubts</p></div>
        <button className="page-action-btn" onClick={() => { resetForm(); setShowForm(true); }}><ion-icon name="add-outline"></ion-icon><span>Log Doubt</span></button>
      </header>

      <div className="page-filters">
        <div className="page-filter-btns">
          {['', 'OPEN', 'ANSWERED', 'PENDING_REVIEW', 'RESOLVED'].map((s) => (
            <button key={s} className={`filter-btn${statusFilter === s ? ' active' : ''}`} onClick={() => setStatusFilter(s)}>{s || 'All'}</button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="page-loading"><div className="auth-spinner" /><p>Loading...</p></div>
      ) : items.length === 0 ? (
        <div className="page-empty"><ion-icon name="help-circle-outline"></ion-icon><h3>No doubts logged</h3><p>Log a student's doubt.</p></div>
      ) : (
        <div className="doubts-list">
          {items.map((d) => (
            <div key={d._id} className={`doubt-card doubt-${d.status?.toLowerCase()}`}>
              <div className="doubt-card-header">
                <span className={`status-tag ${statusColors[d.status] || ''}`}>{d.status}</span>
                <span className="meta-pill">{d.priority}</span>
                {d.topic && <span className="meta-pill">{d.topic}</span>}
              </div>
              <div className="doubt-question">
                <ion-icon name="help-circle-outline"></ion-icon>
                <div>
                  <p className="doubt-question-text">{d.question}</p>
                  <div className="doubt-meta">
                    <span><ion-icon name="person-outline"></ion-icon> {d.studentId?.name || 'Unknown'}</span>
                    {d.subject && <span><ion-icon name="book-outline"></ion-icon> {d.subject}</span>}
                    <span><ion-icon name="time-outline"></ion-icon> {formatDate(d.askedAt)}</span>
                  </div>
                </div>
              </div>
              {d.answer && (
                <div className="doubt-answer">
                  <ion-icon name="chatbubble-outline"></ion-icon>
                  <div>
                    <p>{d.answer}</p>
                    {d.resolutionNotes && <p className="doubt-resolution">{d.resolutionNotes}</p>}
                  </div>
                </div>
              )}
              <div className="homework-card-actions">
                {d.status !== 'RESOLVED' && (
                  <button className="card-action-btn" onClick={() => { setShowAnswer(d._id); setAnswerForm({ answer: d.answer || '', resolutionNotes: '' }); }}>
                    <ion-icon name="chatbubble-ellipses-outline"></ion-icon>
                  </button>
                )}
                {d.status === 'ANSWERED' && (
                  <button className="card-action-btn table-action-success" onClick={() => handleResolve(d._id)}>
                    <ion-icon name="checkmark-circle-outline"></ion-icon>
                  </button>
                )}
                <button className="card-action-btn card-action-danger" onClick={() => handleDelete(d._id)}><ion-icon name="trash-outline"></ion-icon></button>
              </div>

              {showAnswer === d._id && (
                <div className="doubt-answer-form">
                  <div className="form-group"><label>Answer</label><textarea rows="3" value={answerForm.answer} onChange={(e) => setAnswerForm({ ...answerForm, answer: e.target.value })} /></div>
                  <div className="form-group"><label>Resolution Notes</label><textarea rows="2" value={answerForm.resolutionNotes} onChange={(e) => setAnswerForm({ ...answerForm, resolutionNotes: e.target.value })} /></div>
                  <div className="doubt-answer-actions">
                    <button className="modal-btn-cancel" onClick={() => setShowAnswer(null)}>Cancel</button>
                    <button className="modal-btn-submit" onClick={() => handleAnswer(d._id)} disabled={submitting}>{submitting ? 'Saving...' : 'Submit Answer'}</button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {pagination.totalPages > 1 && (
        <div className="page-pagination">
          <button disabled={pagination.page <= 1} onClick={() => fetchItems(pagination.page - 1)}><ion-icon name="chevron-back-outline"></ion-icon> Prev</button>
          <span>Page {pagination.page} of {pagination.totalPages}</span>
          <button disabled={pagination.page >= pagination.totalPages} onClick={() => fetchItems(pagination.page + 1)}>Next <ion-icon name="chevron-forward-outline"></ion-icon></button>
        </div>
      )}

      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Log Doubt</h2>
              <button className="modal-close" onClick={() => setShowForm(false)}><ion-icon name="close-outline"></ion-icon></button>
            </div>
            {formError && <div className="form-error"><ion-icon name="alert-circle-outline"></ion-icon>{formError}</div>}
            <form onSubmit={handleCreate} className="modal-form">
              <div className="form-group"><label>Student *</label>
                <select value={form.studentId} onChange={(e) => setForm({ ...form, studentId: e.target.value })} required>
                  <option value="">Select student</option>{students.map((s) => <option key={s._id} value={s._id}>{s.name}</option>)}
                </select>
              </div>
              <div className="form-group"><label>Question *</label><textarea rows="3" value={form.question} onChange={(e) => setForm({ ...form, question: e.target.value })} required /></div>
              <div className="form-row">
                <div className="form-group"><label>Topic</label><input type="text" value={form.topic} onChange={(e) => setForm({ ...form, topic: e.target.value })} /></div>
                <div className="form-group"><label>Subject</label><input type="text" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} /></div>
                <div className="form-group"><label>Priority</label>
                  <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}>
                    <option value="LOW">Low</option><option value="MEDIUM">Medium</option><option value="HIGH">High</option>
                  </select>
                </div>
              </div>
              <div className="modal-actions">
                <button type="button" className="modal-btn-cancel" onClick={() => setShowForm(false)}>Cancel</button>
                <button type="submit" className="modal-btn-submit" disabled={submitting}>{submitting ? 'Saving...' : 'Log Doubt'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Doubts;
