import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './style.css'
import Sidebar from './components/Sidebar'
import Navbar from './components/Navbar'
import Home from './components/Home'
import About from './components/About'
import Services from './components/Services'
import Contact from './components/Contact'
import ThemeToggle from './components/ThemeToggle'
import NotesPage from './components/NotesPage'

function Layout({ activePage, setActivePage, children }) {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'dark'
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))
  }

  return (
    <main>
      <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
      <Sidebar />
      <div className="main-content">
        <Navbar activePage={activePage} setActivePage={setActivePage} />
        {children}
      </div>
    </main>
  )
}

function App() {
  return (
    <BrowserRouter basename="/Mathamatical_pvt_company">
      <Routes>
        <Route path="/notes/:slug" element={
          <Layout activePage="notes" setActivePage={() => {}}>
            <NotesPage />
          </Layout>
        } />
        <Route path="/notes" element={
          <Layout activePage="notes" setActivePage={() => {}}>
            <NotesPage />
          </Layout>
        } />
        <Route path="*" element={
          <MainSiteRoutes />
        } />
      </Routes>
    </BrowserRouter>
  )
}

function MainSiteRoutes() {
  const [activePage, setActivePage] = useState('home')

  return (
    <Layout activePage={activePage} setActivePage={setActivePage}>
      <Home activePage={activePage} setActivePage={setActivePage} />
      <About activePage={activePage} setActivePage={setActivePage} />
      <Services activePage={activePage} setActivePage={setActivePage} />
      <Contact activePage={activePage} />
    </Layout>
  )
}

export default App
