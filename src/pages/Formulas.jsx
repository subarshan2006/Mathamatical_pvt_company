import { useEffect, useState, useCallback } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

const CATEGORIES = ['ALGEBRA', 'GEOMETRY', 'TRIGONOMETRY', 'CALCULUS', 'STATISTICS', 'ARITHMETIC', 'OTHER'];

function Formulas() {
  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [catFilter, setCatFilter] = useState('');
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({
    title: '', formula: '', description: '', subject: '', chapter: '',
    category: 'ALGEBRA', example: '', tags: '',
  });
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchItems = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const params = { page, limit: 20 };
      if (catFilter) params.category = catFilter;
      if (search) params.search = search;
      const { data } = await api.get('/formulas', { params });
      setItems(data.data || []);
      setPagination({ page: data.meta?.page || 1, totalPages: data.meta?.totalPages || 1, total: data.meta?.total || 0 });
    } catch { /* empty */ }
    finally { setLoading(false); }
  }, [catFilter, search]);

  useEffect(() => { fetchItems(1); }, [fetchItems]);

  const resetForm = () => {
    setForm({ title: '', formula: '', description: '', subject: '', chapter: '', category: 'ALGEBRA', example: '', tags: '' });
    setFormError(''); setEditItem(null);
  };

  const openCreate = () => { resetForm(); setShowForm(true); };
  const openEdit = (item) => {
    setEditItem(item);
    setForm({
      title: item.title || '', formula: item.formula || '', description: item.description || '',
      subject: item.subject || '', chapter: item.chapter || '', category: item.category || 'ALGEBRA',
      example: item.example || '', tags: item.tags?.join(', ') || '',
    });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); setFormError(''); setSubmitting(true);
    try {
      const body = { ...form };
      if (body.tags) body.tags = body.tags.split(',').map((t) => t.trim()).filter(Boolean);
      if (editItem) {
        await api.put(`/formulas/${editItem._id}`, body);
        toast.success('Formula updated');
      } else {
        await api.post('/formulas', body);
        toast.success('Formula created');
      }
      setShowForm(false); resetForm(); fetchItems(pagination.page);
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to save');
    } finally { setSubmitting(false); }
  };

  const handleFavorite = async (id) => {
    try { await api.patch(`/formulas/${id}/favorite`); fetchItems(pagination.page); }
    catch { toast.error('Failed'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this formula?')) return;
    try { await api.delete(`/formulas/${id}`); toast.success('Deleted'); fetchItems(pagination.page); }
    catch { toast.error('Failed to delete'); }
  };



  return (
    <div className="page-container">
      <header className="page-header">
        <div><h1 className="page-title">Formula Bank</h1><p className="page-subtitle">{pagination.total} formulas</p></div>
        <button className="page-action-btn" onClick={openCreate}><ion-icon name="add-outline"></ion-icon><span>New Formula</span></button>
      </header>

      <div className="page-filters">
        <form onSubmit={(e) => { e.preventDefault(); fetchItems(1); }} className="page-search">
          <ion-icon name="search-outline"></ion-icon>
          <input type="text" placeholder="Search formulas..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </form>
        <div className="page-filter-btns">
          <button className={`filter-btn${catFilter === '' ? ' active' : ''}`} onClick={() => setCatFilter('')}>All</button>
          {CATEGORIES.map((c) => (
            <button key={c} className={`filter-btn${catFilter === c ? ' active' : ''}`} onClick={() => setCatFilter(c)}>{c}</button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="page-loading"><div className="auth-spinner" /><p>Loading...</p></div>
      ) : items.length === 0 ? (
        <div className="page-empty"><ion-icon name="bulb-outline"></ion-icon><h3>No formulas yet</h3><p>Add your first formula.</p></div>
      ) : (
        <div className="formula-grid">
          {items.map((f) => (
            <div key={f._id} className="formula-card">
              <div className="formula-card-header">
                <span className="meta-pill">{f.category}</span>
                <button className={`formula-fav-btn${f.isFavorite ? ' active' : ''}`} onClick={() => handleFavorite(f._id)}>
                  <ion-icon name={f.isFavorite ? 'heart' : 'heart-outline'}></ion-icon>
                </button>
              </div>
              <h3 className="formula-card-title">{f.title}</h3>
              <div className="formula-card-expression">{f.formula}</div>
              {f.description && <p className="formula-card-desc">{f.description}</p>}
              {f.example && <div className="formula-card-example"><strong>Example:</strong> {f.example}</div>}
              <div className="formula-card-meta">
                {f.subject && <span className="meta-pill">{f.subject}</span>}
                {f.tags?.map((t, i) => <span key={i} className="meta-pill tag-pill">{t}</span>)}
              </div>
              <div className="homework-card-actions">
                <button className="card-action-btn" onClick={() => openEdit(f)}><ion-icon name="create-outline"></ion-icon></button>
                <button className="card-action-btn card-action-danger" onClick={() => handleDelete(f._id)}><ion-icon name="trash-outline"></ion-icon></button>
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
              <h2>{editItem ? 'Edit Formula' : 'New Formula'}</h2>
              <button className="modal-close" onClick={() => setShowForm(false)}><ion-icon name="close-outline"></ion-icon></button>
            </div>
            {formError && <div className="form-error"><ion-icon name="alert-circle-outline"></ion-icon>{formError}</div>}
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group"><label>Title *</label><input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required /></div>
              <div className="form-group"><label>Formula *</label><textarea rows="2" value={form.formula} onChange={(e) => setForm({ ...form, formula: e.target.value })} required placeholder="e.g. a² + b² = c²" /></div>
              <div className="form-group"><label>Description</label><textarea rows="2" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
              <div className="form-row">
                <div className="form-group"><label>Category</label>
                  <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="form-group"><label>Subject</label><input type="text" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} /></div>
                <div className="form-group"><label>Chapter</label><input type="text" value={form.chapter} onChange={(e) => setForm({ ...form, chapter: e.target.value })} /></div>
              </div>
              <div className="form-group"><label>Example</label><textarea rows="2" value={form.example} onChange={(e) => setForm({ ...form, example: e.target.value })} /></div>
              <div className="form-group"><label>Tags (comma-separated)</label><input type="text" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} placeholder="pythagoras, right triangle" /></div>
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

export default Formulas;
