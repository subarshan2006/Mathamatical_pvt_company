import { useState, useEffect } from 'react'
import './style.css'
import Sidebar from './components/Sidebar'
import Navbar from './components/Navbar'
import Home from './components/Home'
import About from './components/About'
import Services from './components/Services'
import Contact from './components/Contact'
import ThemeToggle from './components/ThemeToggle'

function App() {
  const [activePage, setActivePage] = useState('home')
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
        <Home activePage={activePage} setActivePage={setActivePage} />
        <About activePage={activePage} setActivePage={setActivePage} />
        <Services activePage={activePage} setActivePage={setActivePage} />
        <Contact activePage={activePage} />
      </div>
    </main>
  )
}

export default App
