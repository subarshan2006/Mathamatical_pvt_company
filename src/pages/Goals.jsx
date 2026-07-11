import { useEffect, useState, useCallback } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

function Goals() {
  const [items, setItems] = useState([]);
  const [students, setStudents] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({
    studentId: '', title: '', description: '', category: 'ACADEMIC',
    subject: '', targetDate: '', priority: 'MEDIUM', milestonesText: '',
  });
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
      const { data } = await api.get('/goals', { params });
      setItems(data.data || []);
      setPagination({ page: data.meta?.page || 1, totalPages: data.meta?.totalPages || 1, total: data.meta?.total || 0 });
    } catch { /* empty */ }
    finally { setLoading(false); }
  }, [statusFilter]);

  useEffect(() => { fetchStudents(); }, []);
  useEffect(() => { fetchItems(1); }, [fetchItems]);

  const resetForm = () => {
    setForm({ studentId: '', title: '', description: '', category: 'ACADEMIC', subject: '', targetDate: '', priority: 'MEDIUM', milestonesText: '' });
    setFormError(''); setEditItem(null);
  };

  const openCreate = () => { resetForm(); setShowForm(true); };
  const openEdit = (item) => {
    setEditItem(item);
    setForm({
      studentId: item.studentId?._id || '', title: item.title || '', description: item.description || '',
      category: item.category || 'ACADEMIC', subject: item.subject || '',
      targetDate: item.targetDate ? new Date(item.targetDate).toISOString().split('T')[0] : '',
      priority: item.priority || 'MEDIUM',
      milestonesText: item.milestones?.map((m) => m.title).join('\n') || '',
    });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); setFormError(''); setSubmitting(true);
    try {
      const body = {
        studentId: form.studentId, title: form.title, description: form.description || undefined,
        category: form.category, subject: form.subject || undefined,
        targetDate: form.targetDate || undefined, priority: form.priority,
        milestones: form.milestonesText ? form.milestonesText.split('\n').filter(Boolean).map((t) => ({ title: t.trim() })) : undefined,
      };
      if (editItem) {
        await api.put(`/goals/${editItem._id}`, body);
        toast.success('Goal updated');
      } else {
        await api.post('/goals', body);
        toast.success('Goal created');
      }
      setShowForm(false); resetForm(); fetchItems(pagination.page);
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to save');
    } finally { setSubmitting(false); }
  };

  const handleProgress = async (id) => {
    const p = prompt('Enter progress (0-100):');
    if (p === null) return;
    try { await api.patch(`/goals/${id}/progress`, { progress: parseInt(p, 10) }); toast.success('Progress updated'); fetchItems(pagination.page); }
    catch { toast.error('Failed'); }
  };

  const handleComplete = async (id) => {
    if (!window.confirm('Mark this goal as completed?')) return;
    try { await api.patch(`/goals/${id}/complete`); toast.success('Goal completed!'); fetchItems(pagination.page); }
    catch { toast.error('Failed'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this goal?')) return;
    try { await api.delete(`/goals/${id}`); toast.success('Deleted'); fetchItems(pagination.page); }
    catch { toast.error('Failed to delete'); }
  };

  const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '';
  const statusColors = { ACTIVE: 'status-scheduled', COMPLETED: 'status-completed', CANCELLED: 'status-cancelled', PAUSED: 'status-paused' };

  return (
    <div className="page-container">
      <header className="page-header">
        <div><h1 className="page-title">Goals</h1><p className="page-subtitle">{pagination.total} goals</p></div>
        <button className="page-action-btn" onClick={openCreate}><ion-icon name="add-outline"></ion-icon><span>New Goal</span></button>
      </header>

      <div className="page-filters">
        <div className="page-filter-btns">
          {['', 'ACTIVE', 'COMPLETED', 'PAUSED'].map((s) => (
            <button key={s} className={`filter-btn${statusFilter === s ? ' active' : ''}`} onClick={() => setStatusFilter(s)}>{s || 'All'}</button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="page-loading"><div className="auth-spinner" /><p>Loading...</p></div>
      ) : items.length === 0 ? (
        <div className="page-empty"><ion-icon name="flag-outline"></ion-icon><h3>No goals yet</h3><p>Create your first goal.</p></div>
      ) : (
        <div className="goals-grid">
          {items.map((g) => (
            <div key={g._id} className="goal-card">
              <div className="goal-card-header">
                <span className={`status-tag ${statusColors[g.status] || ''}`}>{g.status}</span>
                <span className="meta-pill">{g.category}</span>
                <span className="meta-pill">{g.priority}</span>
              </div>
              <h3 className="goal-card-title">{g.title}</h3>
              {g.description && <p className="goal-card-desc">{g.description}</p>}
              <div className="goal-card-meta">
                <span><ion-icon name="person-outline"></ion-icon> {g.studentId?.name || 'Unknown'}</span>
                {g.targetDate && <span><ion-icon name="calendar-outline"></ion-icon> Target: {formatDate(g.targetDate)}</span>}
              </div>
              <div className="goal-progress-section">
                <div className="goal-progress-bar">
                  <div className="goal-progress-fill" style={{ width: `${g.progress || 0}%` }} />
                </div>
                <span className="goal-progress-text">{g.progress || 0}%</span>
              </div>
              {g.milestones?.length > 0 && (
                <div className="goal-milestones">
                  {g.milestones.map((m, i) => (
                    <div key={i} className={`milestone-item${m.completed ? ' completed' : ''}`}>
                      <ion-icon name={m.completed ? 'checkmark-circle' : 'ellipse-outline'}></ion-icon>
                      <span>{m.title}</span>
                    </div>
                  ))}
                </div>
              )}
              <div className="homework-card-actions">
                <button className="card-action-btn" onClick={() => openEdit(g)}><ion-icon name="create-outline"></ion-icon></button>
                {g.status === 'ACTIVE' && <button className="card-action-btn table-action-success" onClick={() => handleProgress(g._id)}><ion-icon name="trending-up-outline"></ion-icon></button>}
                {g.status === 'ACTIVE' && <button className="card-action-btn table-action-success" onClick={() => handleComplete(g._id)}><ion-icon name="checkmark-circle-outline"></ion-icon></button>}
                <button className="card-action-btn card-action-danger" onClick={() => handleDelete(g._id)}><ion-icon name="trash-outline"></ion-icon></button>
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
              <h2>{editItem ? 'Edit Goal' : 'New Goal'}</h2>
              <button className="modal-close" onClick={() => setShowForm(false)}><ion-icon name="close-outline"></ion-icon></button>
            </div>
            {formError && <div className="form-error"><ion-icon name="alert-circle-outline"></ion-icon>{formError}</div>}
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group"><label>Student *</label>
                <select value={form.studentId} onChange={(e) => setForm({ ...form, studentId: e.target.value })} required>
                  <option value="">Select student</option>{students.map((s) => <option key={s._id} value={s._id}>{s.name}</option>)}
                </select>
              </div>
              <div className="form-group"><label>Title *</label><input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required /></div>
              <div className="form-group"><label>Description</label><textarea rows="2" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
              <div className="form-row">
                <div className="form-group"><label>Category</label>
                  <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                    <option value="ACADEMIC">Academic</option><option value="SKILL">Skill</option><option value="BEHAVIOR">Behavior</option><option value="CUSTOM">Custom</option>
                  </select>
                </div>
                <div className="form-group"><label>Subject</label><input type="text" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} /></div>
              </div>
              <div className="form-row">
                <div className="form-group"><label>Target Date</label><input type="date" value={form.targetDate} onChange={(e) => setForm({ ...form, targetDate: e.target.value })} /></div>
                <div className="form-group"><label>Priority</label>
                  <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}>
                    <option value="LOW">Low</option><option value="MEDIUM">Medium</option><option value="HIGH">High</option>
                  </select>
                </div>
              </div>
              <div className="form-group"><label>Milestones (one per line)</label><textarea rows="4" value={form.milestonesText} onChange={(e) => setForm({ ...form, milestonesText: e.target.value })} placeholder="Master quadratics&#10;Score 90% on test&#10;Complete workbook ch.5" /></div>
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

export default Goals;
