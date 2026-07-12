import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { getStudentBySlug } from '../data/students'

const BASE_TITLE = 'Next Step Tutoring'

function NotesPage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [inputValue, setInputValue] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (slug) {
      const student = getStudentBySlug(slug)
      if (student) {
        document.title = `${student.name}'s Session Notes | ${BASE_TITLE}`
      } else {
        document.title = `Student Not Found | ${BASE_TITLE}`
      }
    } else {
      document.title = `Session Notes | ${BASE_TITLE}`
    }
    return () => { document.title = BASE_TITLE }
  }, [slug])

  const handleSubmit = (e) => {
    e.preventDefault()
    const trimmed = inputValue.trim().toLowerCase()
    if (!trimmed) {
      setError('Please enter a student name.')
      return
    }
    const student = getStudentBySlug(trimmed)
    if (student) {
      setError('')
      navigate(`/notes/${student.slug}`)
    } else {
      setError('Student not found. Please check and try again.')
    }
  }

  // If no slug provided, show input form
  if (!slug) {
    return (
      <article className="notes-page active" data-page="notes">
        <header>
          <h2 className="h2 article-title">Session Notes</h2>
        </header>

        <section className="notes-intro">
          <p className="about-text">
            Enter your student name to view session notes.
          </p>
        </section>

        <form className="notes-access-form" onSubmit={handleSubmit}>
          <div className="notes-input-group">
            <ion-icon name="person-outline"></ion-icon>
            <input
              type="text"
              className="notes-input"
              placeholder="e.g. kavitha-001"
              value={inputValue}
              onChange={(e) => { setInputValue(e.target.value); setError('') }}
              autoFocus
            />
          </div>
          {error && <p className="notes-error">{error}</p>}
          <button type="submit" className="hero-cta-btn primary">
            <span>View Notes</span>
            <ion-icon name="arrow-forward-outline"></ion-icon>
          </button>
        </form>
      </article>
    )
  }

  const student = getStudentBySlug(slug)

  if (!student) {
    return (
      <article className="notes-page active" data-page="notes">
        <header>
          <h2 className="h2 article-title">Session Notes</h2>
        </header>

        <div className="notes-not-found">
          <ion-icon name="alert-circle-outline"></ion-icon>
          <h3>Student Not Found</h3>
          <p>The student you're looking for doesn't exist.</p>
          <Link to="/notes" className="hero-cta-btn secondary">
            <ion-icon name="arrow-back-outline"></ion-icon>
            <span>Try Again</span>
          </Link>
        </div>
      </article>
    )
  }

  const embedUrl = `https://docs.google.com/document/d/e/${student.docId}/pub?embedded=true`

  return (
    <article className="notes-page active" data-page="notes">
      <header>
        <h2 className="h2 article-title">Session Notes</h2>
      </header>

      <div className="notes-student-header">
        <Link to="/notes" className="notes-back-link">
          <ion-icon name="arrow-back-outline"></ion-icon>
          <span>Back</span>
        </Link>
        <h3 className="h3">{student.name}'s Session Notes</h3>
      </div>

      <div className="iframe-wrapper">
        <iframe
          src={embedUrl}
          title={`${student.name}'s Session Notes`}
          sandbox="allow-scripts allow-same-origin"
          className="notes-iframe"
          loading="lazy"
        />
      </div>

      <div className="notes-footer">
        <p>Session notes are updated after each class</p>
      </div>
    </article>
  )
}

export default NotesPage
