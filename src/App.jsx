import { useState, useEffect, lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Link, NavLink, useLocation } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import NotificationBell from './components/NotificationBell'
import Sidebar from './components/Sidebar'
import Navbar from './components/Navbar'
import Home from './components/Home'
import About from './components/About'
import Services from './components/Services'
import Contact from './components/Contact'
import ThemeToggle from './components/ThemeToggle'
import Login from './pages/Login'
import './style.css'

const Dashboard = lazy(() => import('./pages/Dashboard'))
const Students = lazy(() => import('./pages/Students'))
const StudentDetail = lazy(() => import('./pages/StudentDetail'))
const Sessions = lazy(() => import('./pages/Sessions'))
const Homework = lazy(() => import('./pages/Homework'))
const Goals = lazy(() => import('./pages/Goals'))
const Formulas = lazy(() => import('./pages/Formulas'))
const Doubts = lazy(() => import('./pages/Doubts'))

function PageLoader() {
  return (
    <div className="page-loading">
      <div className="auth-spinner" />
    </div>
  )
}

function PortfolioPage() {
  const [activePage, setActivePage] = useState('home')
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark')
  const location = useLocation()

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggleTheme = () => setTheme((p) => (p === 'dark' ? 'light' : 'dark'))

  useEffect(() => {
    const hash = location.hash.replace('#', '').toLowerCase()
    if (['home', 'about', 'services', 'contact'].includes(hash)) setActivePage(hash)
  }, [location])

  return (
    <main>
      <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
      <Sidebar />
      <div className="main-content">
        <Navbar activePage={activePage} setActivePage={setActivePage} />
        <Home activePage={activePage} setActivePage={setActivePage} />
        <About activePage={activePage} setActivePage={setActivePage} />
        <Services activePage={activePage} setActivePage={setActivePage} />
        <Contact activePage={activePage} />
      </div>
    </main>
  )
}

function AdminSidebar() {
  const { user, logout } = useAuth()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside className={`admin-sidebar${collapsed ? ' collapsed' : ''}`}>
      <div className="admin-sidebar-header">
        <Link to="/dashboard" className="admin-logo">
          <ion-icon name="calculator-outline"></ion-icon>
          {!collapsed && <span>Math Tutor</span>}
        </Link>
        <button className="admin-sidebar-toggle" onClick={() => setCollapsed(!collapsed)}>
          <ion-icon name={collapsed ? 'chevron-forward-outline' : 'chevron-back-outline'}></ion-icon>
        </button>
      </div>

      <nav className="admin-nav">
        <NavLink to="/dashboard" className={({ isActive }) => `admin-nav-link${isActive ? ' active' : ''}`}>
          <ion-icon name="grid-outline"></ion-icon>{!collapsed && <span>Dashboard</span>}
        </NavLink>
        <NavLink to="/students" className={({ isActive }) => `admin-nav-link${isActive ? ' active' : ''}`}>
          <ion-icon name="people-outline"></ion-icon>{!collapsed && <span>Students</span>}
        </NavLink>
        <NavLink to="/sessions" className={({ isActive }) => `admin-nav-link${isActive ? ' active' : ''}`}>
          <ion-icon name="calendar-outline"></ion-icon>{!collapsed && <span>Sessions</span>}
        </NavLink>
        <NavLink to="/homework" className={({ isActive }) => `admin-nav-link${isActive ? ' active' : ''}`}>
          <ion-icon name="document-text-outline"></ion-icon>{!collapsed && <span>Homework</span>}
        </NavLink>
        <NavLink to="/goals" className={({ isActive }) => `admin-nav-link${isActive ? ' active' : ''}`}>
          <ion-icon name="flag-outline"></ion-icon>{!collapsed && <span>Goals</span>}
        </NavLink>
        <NavLink to="/formulas" className={({ isActive }) => `admin-nav-link${isActive ? ' active' : ''}`}>
          <ion-icon name="bulb-outline"></ion-icon>{!collapsed && <span>Formulas</span>}
        </NavLink>
        <NavLink to="/doubts" className={({ isActive }) => `admin-nav-link${isActive ? ' active' : ''}`}>
          <ion-icon name="help-circle-outline"></ion-icon>{!collapsed && <span>Doubts</span>}
        </NavLink>
      </nav>

      <div className="admin-sidebar-footer">
        {!collapsed && (
          <div className="admin-user-info">
            <div className="admin-user-avatar">{user?.name?.charAt(0).toUpperCase()}</div>
            <div className="admin-user-details">
              <span className="admin-user-name">{user?.name}</span>
              <span className="admin-user-email">{user?.email}</span>
            </div>
          </div>
        )}
        <NavLink to="/" className="admin-nav-link admin-nav-link-footer">
          <ion-icon name="globe-outline"></ion-icon>{!collapsed && <span>Portfolio</span>}
        </NavLink>
        <button className="admin-nav-link admin-nav-link-footer admin-logout" onClick={logout}>
          <ion-icon name="log-out-outline"></ion-icon>{!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  )
}

function AdminLayout({ children }) {
  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-main">
        <div className="admin-topbar">
          <div />
          <NotificationBell />
        </div>
        <Suspense fallback={<PageLoader />}>
          {children}
        </Suspense>
      </div>
    </div>
  )
}

function NotFound() {
  return (
    <div className="not-found-page">
      <div className="not-found-content">
        <h1>404</h1>
        <p>Page not found</p>
        <Link to="/" className="page-action-btn" style={{ textDecoration: 'none' }}>Go Home</Link>
      </div>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<PortfolioPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<ProtectedRoute><AdminLayout><Dashboard /></AdminLayout></ProtectedRoute>} />
          <Route path="/students" element={<ProtectedRoute><AdminLayout><Students /></AdminLayout></ProtectedRoute>} />
          <Route path="/students/:id" element={<ProtectedRoute><AdminLayout><StudentDetail /></AdminLayout></ProtectedRoute>} />
          <Route path="/sessions" element={<ProtectedRoute><AdminLayout><Sessions /></AdminLayout></ProtectedRoute>} />
          <Route path="/homework" element={<ProtectedRoute><AdminLayout><Homework /></AdminLayout></ProtectedRoute>} />
          <Route path="/goals" element={<ProtectedRoute><AdminLayout><Goals /></AdminLayout></ProtectedRoute>} />
          <Route path="/formulas" element={<ProtectedRoute><AdminLayout><Formulas /></AdminLayout></ProtectedRoute>} />
          <Route path="/doubts" element={<ProtectedRoute><AdminLayout><Doubts /></AdminLayout></ProtectedRoute>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
