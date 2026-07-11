import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      const msg = err.response?.data?.message || 'Invalid email or password';
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-icon">
            <ion-icon name="lock-closed-outline"></ion-icon>
          </div>
          <h1 className="auth-title">Tutor Login</h1>
          <p className="auth-subtitle">Sign in to manage your sessions & students</p>
        </div>

        {error && (
          <div className="auth-error">
            <ion-icon name="alert-circle-outline"></ion-icon>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-field">
            <label htmlFor="email">Email</label>
            <div className="auth-input-wrapper">
              <ion-icon name="mail-outline"></ion-icon>
              <input
                id="email"
                type="email"
                placeholder="tutor@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>
          </div>

          <div className="auth-field">
            <label htmlFor="password">Password</label>
            <div className="auth-input-wrapper">
              <ion-icon name="key-outline"></ion-icon>
              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>
          </div>

          <button
            type="submit"
            className="auth-submit"
            disabled={submitting}
          >
            {submitting ? (
              <>
                <div className="auth-btn-spinner" />
                <span>Signing in...</span>
              </>
            ) : (
              <>
                <ion-icon name="log-in-outline"></ion-icon>
                <span>Sign In</span>
              </>
            )}
          </button>
        </form>

        <div className="auth-footer">
          <Link to="/" className="auth-back-link">
            <ion-icon name="arrow-back-outline"></ion-icon>
            <span>Back to Portfolio</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
