import { useEffect, useState, useCallback } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

function Homework() {
  const [items, setItems] = useState([]);
  const [students, setStudents] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({
    studentId: '', title: '', description: '', subject: '', chapter: '',
    dueDate: '', priority: 'MEDIUM', totalMarks: '',
  });
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchStudents = async () => {
    try {
      const { data } = await api.get('/students?limit=100&status=ACTIVE');
      setStudents(data.data || []);
    } catch { /* empty */ }
  };

  const fetchItems = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const params = { page, limit: 12 };
      if (statusFilter) params.status = statusFilter;
      const { data } = await api.get('/homework', { params });
      setItems(data.data || []);
      setPagination({ page: data.meta?.page || 1, totalPages: data.meta?.totalPages || 1, total: data.meta?.total || 0 });
    } catch { /* empty */ }
    finally { setLoading(false); }
  }, [statusFilter]);

  useEffect(() => { fetchStudents(); }, []);
  useEffect(() => { fetchItems(1); }, [fetchItems]);

  const resetForm = () => {
    setForm({ studentId: '', title: '', description: '', subject: '', chapter: '', dueDate: '', priority: 'MEDIUM', totalMarks: '' });
    setFormError(''); setEditItem(null);
  };

  const openCreate = () => { resetForm(); setShowForm(true); };
  const openEdit = (item) => {
    setEditItem(item);
    setForm({
      studentId: item.studentId?._id || '', title: item.title || '', description: item.description || '',
      subject: item.subject || '', chapter: item.chapter || '',
      dueDate: item.dueDate ? new Date(item.dueDate).toISOString().split('T')[0] : '',
      priority: item.priority || 'MEDIUM', totalMarks: item.totalMarks?.toString() || '',
    });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); setFormError(''); setSubmitting(true);
    try {
      const body = { ...form };
      if (body.totalMarks) body.totalMarks = parseInt(body.totalMarks, 10);
      if (editItem) {
        await api.put(`/homework/${editItem._id}`, body);
        toast.success('Homework updated');
      } else {
        await api.post('/homework', body);
        toast.success('Homework created');
      }
      setShowForm(false); resetForm(); fetchItems(pagination.page);
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to save');
    } finally { setSubmitting(false); }
  };

  const handleGrade = async (id) => {
    const marks = prompt('Enter obtained marks:');
    if (marks === null) return;
    const fb = prompt('Enter feedback (optional):') || '';
    try {
      await api.patch(`/homework/${id}/grade`, { obtainedMarks: parseInt(marks, 10), feedback: fb });
      toast.success('Homework graded');
      fetchItems(pagination.page);
    } catch { toast.error('Failed to grade'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this homework?')) return;
    try { await api.delete(`/homework/${id}`); toast.success('Deleted'); fetchItems(pagination.page); }
    catch { toast.error('Failed to delete'); }
  };

  const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '';

  const statusColors = { ASSIGNED: 'status-scheduled', SUBMITTED: 'status-completed', PENDING: 'status-missed', OVERDUE: 'status-cancelled', EXCUSED: 'status-paused', GRADED: 'status-active' };
  const priorityColors = { LOW: 'meta-pill', MEDIUM: 'meta-pill priority-medium', HIGH: 'meta-pill priority-high' };

  return (
    <div className="page-container">
      <header className="page-header">
        <div>
          <h1 className="page-title">Homework</h1>
          <p className="page-subtitle">{pagination.total} assignments</p>
        </div>
        <button className="page-action-btn" onClick={openCreate}>
          <ion-icon name="add-outline"></ion-icon><span>New Assignment</span>
        </button>
      </header>

      <div className="page-filters">
        <div className="page-filter-btns">
          {['', 'ASSIGNED', 'SUBMITTED', 'OVERDUE', 'GRADED'].map((s) => (
            <button key={s} className={`filter-btn${statusFilter === s ? ' active' : ''}`} onClick={() => setStatusFilter(s)}>
              {s || 'All'}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="page-loading"><div className="auth-spinner" /><p>Loading...</p></div>
      ) : items.length === 0 ? (
        <div className="page-empty"><ion-icon name="document-text-outline"></ion-icon><h3>No homework yet</h3><p>Create your first assignment.</p></div>
      ) : (
        <div className="homework-grid">
          {items.map((h) => (
            <div key={h._id} className="homework-card">
              <div className="homework-card-header">
                <span className={`status-tag ${statusColors[h.status] || ''}`}>{h.status}</span>
                <span className={priorityColors[h.priority] || 'meta-pill'}>{h.priority}</span>
              </div>
              <h3 className="homework-card-title">{h.title}</h3>
              {h.description && <p className="homework-card-desc">{h.description}</p>}
              <div className="homework-card-meta">
                <span><ion-icon name="person-outline"></ion-icon> {h.studentId?.name || 'Unknown'}</span>
                {h.subject && <span><ion-icon name="book-outline"></ion-icon> {h.subject}</span>}
                <span><ion-icon name="calendar-outline"></ion-icon> Due {formatDate(h.dueDate)}</span>
                {h.totalMarks && <span><ion-icon name="star-outline"></ion-icon> {h.totalMarks} marks</span>}
              </div>
              {h.obtainedMarks != null && (
                <div className="homework-grade">
                  <span>Score: {h.obtainedMarks}/{h.totalMarks}</span>
                  {h.feedback && <span className="homework-feedback">{h.feedback}</span>}
                </div>
              )}
              <div className="homework-card-actions">
                <button className="card-action-btn" onClick={() => openEdit(h)}><ion-icon name="create-outline"></ion-icon></button>
                {h.status === 'SUBMITTED' && <button className="card-action-btn table-action-success" onClick={() => handleGrade(h._id)}><ion-icon name="star-outline"></ion-icon></button>}
                <button className="card-action-btn card-action-danger" onClick={() => handleDelete(h._id)}><ion-icon name="trash-outline"></ion-icon></button>
              </div>
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
              <h2>{editItem ? 'Edit Homework' : 'New Homework'}</h2>
              <button className="modal-close" onClick={() => setShowForm(false)}><ion-icon name="close-outline"></ion-icon></button>
            </div>
            {formError && <div className="form-error"><ion-icon name="alert-circle-outline"></ion-icon>{formError}</div>}
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group">
                <label>Student *</label>
                <select value={form.studentId} onChange={(e) => setForm({ ...form, studentId: e.target.value })} required>
                  <option value="">Select student</option>
                  {students.map((s) => <option key={s._id} value={s._id}>{s.name}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Title *</label>
                <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea rows="3" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </div>
              <div className="form-row">
                <div className="form-group"><label>Subject</label><input type="text" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} /></div>
                <div className="form-group"><label>Chapter</label><input type="text" value={form.chapter} onChange={(e) => setForm({ ...form, chapter: e.target.value })} /></div>
              </div>
              <div className="form-row">
                <div className="form-group"><label>Due Date *</label><input type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} required /></div>
                <div className="form-group">
                  <label>Priority</label>
                  <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}>
                    <option value="LOW">Low</option><option value="MEDIUM">Medium</option><option value="HIGH">High</option>
                  </select>
                </div>
                <div className="form-group"><label>Total Marks</label><input type="number" min="0" value={form.totalMarks} onChange={(e) => setForm({ ...form, totalMarks: e.target.value })} /></div>
              </div>
              <div className="modal-actions">
                <button type="button" className="modal-btn-cancel" onClick={() => setShowForm(false)}>Cancel</button>
                <button type="submit" className="modal-btn-submit" disabled={submitting}>{submitting ? 'Saving...' : editItem ? 'Update' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Homework;
