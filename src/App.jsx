import { useState, useEffect } from 'react'
import './style.css'
import Sidebar from './components/Sidebar'
import Navbar from './components/Navbar'
import About from './components/About'
import Resume from './components/Resume'
import Portfolio from './components/Portfolio'
import Blog from './components/Blog'
import Contact from './components/Contact'
import ThemeToggle from './components/ThemeToggle'

function App() {
  const [activePage, setActivePage] = useState('about')
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
        <About activePage={activePage} />
        <Resume activePage={activePage} />
        <Portfolio activePage={activePage} />
        <Blog activePage={activePage} />
        <Contact activePage={activePage} />
      </div>
    </main>
  )
}

export default App
