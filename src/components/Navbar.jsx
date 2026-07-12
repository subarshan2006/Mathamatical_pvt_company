import { Link, useNavigate } from 'react-router-dom'

const pages = ['Home', 'About', 'Services', 'Contact']

function Navbar({ activePage, setActivePage }) {
  const navigate = useNavigate()

  return (
    <nav className="navbar">
      <ul className="navbar-list">
        {pages.map((page) => (
          <li className="navbar-item" key={page}>
            <button
              className={`navbar-link${activePage === page.toLowerCase() ? ' active' : ''}`}
              data-nav-link
              onClick={() => {
                navigate('/', { state: { activePage: page.toLowerCase() } })
                window.scrollTo(0, 0)
              }}
            >
              {page}
            </button>
          </li>
        ))}
        <li className="navbar-item">
          <Link
            to="/notes"
            className={`navbar-link${activePage === 'notes' ? ' active' : ''}`}
            data-nav-link
          >
            Notes
          </Link>
        </li>
      </ul>
    </nav>
  )
}

export default Navbar
