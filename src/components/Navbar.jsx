import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const pages = ['Home', 'About', 'Services', 'Contact']

function Navbar({ activePage, setActivePage }) {
  const { user } = useAuth();

  return (
    <nav className="navbar">
      <ul className="navbar-list">
        {pages.map((page) => (
          <li className="navbar-item" key={page}>
            <button
              className={`navbar-link${activePage === page.toLowerCase() ? ' active' : ''}`}
              data-nav-link
              onClick={() => {
                setActivePage(page.toLowerCase())
                window.scrollTo(0, 0)
              }}
            >
              {page}
            </button>
          </li>
        ))}
        <li className="navbar-item">
          {user ? (
            <Link to="/dashboard" className="navbar-link navbar-login-btn">
              <ion-icon name="grid-outline"></ion-icon>
              <span>Dashboard</span>
            </Link>
          ) : (
            <Link to="/login" className="navbar-link navbar-login-btn">
              <ion-icon name="log-in-outline"></ion-icon>
              <span>Tutor Login</span>
            </Link>
          )}
        </li>
      </ul>
    </nav>
  )
}

export default Navbar
