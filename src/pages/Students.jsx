import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function Students() {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editStudent, setEditStudent] = useState(null);
  const [form, setForm] = useState({
    name: '', age: '', school: '', grade: '',
    parentName: '', parentMobile: '', parentEmail: '',
    studentEmail: '', monthlyFee: '', notes: '',
  });
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchStudents = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const params = { page, limit: 10 };
      if (statusFilter) params.status = statusFilter;
      if (search) params.search = search;
      const { data } = await api.get('/students', { params });
      setStudents(data.data || []);
      setPagination({ page: data.meta?.page || 1, totalPages: data.meta?.totalPages || 1, total: data.meta?.total || 0 });
    } catch {
      // empty
    } finally {
      setLoading(false);
    }
  }, [statusFilter, search]);

  useEffect(() => { fetchStudents(1); }, [fetchStudents]);

  const resetForm = () => {
    setForm({ name: '', age: '', school: '', grade: '', parentName: '', parentMobile: '', parentEmail: '', studentEmail: '', monthlyFee: '', notes: '' });
    setFormError('');
    setEditStudent(null);
  };

  const openCreate = () => { resetForm(); setShowForm(true); };
  const openEdit = (s) => {
    setEditStudent(s);
    setForm({
      name: s.name || '', age: s.age || '', school: s.school || '', grade: s.grade || '',
      parentName: s.parentName || '', parentMobile: s.parentMobile || '', parentEmail: s.parentEmail || '',
      studentEmail: s.studentEmail || '', monthlyFee: s.monthlyFee || '', notes: s.notes || '',
    });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setSubmitting(true);
    try {
      const body = { ...form };
      if (body.age) body.age = parseInt(body.age, 10);
      if (body.monthlyFee) body.monthlyFee = parseFloat(body.monthlyFee);
      if (editStudent) {
        await api.put(`/students/${editStudent._id}`, body);
      } else {
        await api.post('/students', body);
      }
      setShowForm(false);
      resetForm();
      fetchStudents(pagination.page);
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to save student');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this student?')) return;
    try {
      await api.delete(`/students/${id}`);
      fetchStudents(pagination.page);
    } catch {
      // empty
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchStudents(1);
  };

  const statusColors = { ACTIVE: 'status-active', PAUSED: 'status-paused', GRADUATED: 'status-graduated', DROPPED: 'status-dropped' };

  return (
    <div className="page-container">
      <header className="page-header">
        <div>
          <h1 className="page-title">Students</h1>
          <p className="page-subtitle">{pagination.total} total students</p>
        </div>
        <button className="page-action-btn" onClick={openCreate}>
          <ion-icon name="add-outline"></ion-icon>
          <span>Add Student</span>
        </button>
      </header>

      {/* Filters */}
      <div className="page-filters">
        <form onSubmit={handleSearch} className="page-search">
          <ion-icon name="search-outline"></ion-icon>
          <input
            type="text"
            placeholder="Search students..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button type="button" className="search-clear" onClick={() => { setSearch(''); }}>
              <ion-icon name="close-outline"></ion-icon>
            </button>
          )}
        </form>
        <div className="page-filter-btns">
          {['', 'ACTIVE', 'PAUSED', 'GRADUATED'].map((s) => (
            <button
              key={s}
              className={`filter-btn${statusFilter === s ? ' active' : ''}`}
              onClick={() => setStatusFilter(s)}
            >
              {s || 'All'}
            </button>
          ))}
        </div>
      </div>

      {/* Student List */}
      {loading ? (
        <div className="page-loading"><div className="auth-spinner" /><p>Loading students...</p></div>
      ) : students.length === 0 ? (
        <div className="page-empty">
          <ion-icon name="people-outline"></ion-icon>
          <h3>No students found</h3>
          <p>Add your first student to get started.</p>
        </div>
      ) : (
        <div className="student-grid">
          {students.map((s) => (
            <div key={s._id} className="student-card" onClick={() => navigate(`/students/${s._id}`)}>
              <div className="student-card-header">
                <div className="student-avatar">{s.name?.charAt(0).toUpperCase()}</div>
                <div className="student-card-info">
                  <h3>{s.name}</h3>
                  <p>{s.grade || 'No grade'} {s.age ? `· Age ${s.age}` : ''}</p>
                </div>
                <span className={`status-tag ${statusColors[s.status] || ''}`}>{s.status}</span>
              </div>
              <div className="student-card-details">
                <div className="student-detail-row">
                  <ion-icon name="call-outline"></ion-icon>
                  <span>{s.parentMobile}</span>
                </div>
                <div className="student-detail-row">
                  <ion-icon name="mail-outline"></ion-icon>
                  <span>{s.parentEmail}</span>
                </div>
                {s.school && (
                  <div className="student-detail-row">
                    <ion-icon name="school-outline"></ion-icon>
                    <span>{s.school}</span>
                  </div>
                )}
              </div>
              <div className="student-card-actions" onClick={(e) => e.stopPropagation()}>
                <button className="card-action-btn" onClick={() => openEdit(s)}>
                  <ion-icon name="create-outline"></ion-icon>
                </button>
                <button className="card-action-btn card-action-danger" onClick={() => handleDelete(s._id)}>
                  <ion-icon name="trash-outline"></ion-icon>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="page-pagination">
          <button disabled={pagination.page <= 1} onClick={() => fetchStudents(pagination.page - 1)}>
            <ion-icon name="chevron-back-outline"></ion-icon> Prev
          </button>
          <span>Page {pagination.page} of {pagination.totalPages}</span>
          <button disabled={pagination.page >= pagination.totalPages} onClick={() => fetchStudents(pagination.page + 1)}>
            Next <ion-icon name="chevron-forward-outline"></ion-icon>
          </button>
        </div>
      )}

      {/* Modal Form */}
      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editStudent ? 'Edit Student' : 'Add Student'}</h2>
              <button className="modal-close" onClick={() => setShowForm(false)}>
                <ion-icon name="close-outline"></ion-icon>
              </button>
            </div>
            {formError && <div className="form-error"><ion-icon name="alert-circle-outline"></ion-icon>{formError}</div>}
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Name *</label>
                  <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label>Age</label>
                  <input type="number" min="3" max="25" value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Grade</label>
                  <input type="text" value={form.grade} onChange={(e) => setForm({ ...form, grade: e.target.value })} placeholder="e.g. 10th" />
                </div>
                <div className="form-group">
                  <label>School</label>
                  <input type="text" value={form.school} onChange={(e) => setForm({ ...form, school: e.target.value })} />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Parent Name *</label>
                  <input type="text" value={form.parentName} onChange={(e) => setForm({ ...form, parentName: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label>Parent Mobile *</label>
                  <input type="tel" value={form.parentMobile} onChange={(e) => setForm({ ...form, parentMobile: e.target.value })} required />
                </div>
              </div>
              <div className="form-group">
                <label>Parent Email *</label>
                <input type="email" value={form.parentEmail} onChange={(e) => setForm({ ...form, parentEmail: e.target.value })} required />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Student Email</label>
                  <input type="email" value={form.studentEmail} onChange={(e) => setForm({ ...form, studentEmail: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Monthly Fee ($)</label>
                  <input type="number" min="0" step="0.01" value={form.monthlyFee} onChange={(e) => setForm({ ...form, monthlyFee: e.target.value })} />
                </div>
              </div>
              <div className="form-group">
                <label>Notes</label>
                <textarea rows="3" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
              </div>
              <div className="modal-actions">
                <button type="button" className="modal-btn-cancel" onClick={() => setShowForm(false)}>Cancel</button>
                <button type="submit" className="modal-btn-submit" disabled={submitting}>
                  {submitting ? 'Saving...' : editStudent ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Students;
