const pages = ['About', 'Resume', 'Portfolio', 'Blog', 'Contact']

function Navbar({ activePage, setActivePage }) {
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
      </ul>
    </nav>
  )
}

export default Navbar
