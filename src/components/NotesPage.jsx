import { useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { students, getStudentBySlug } from '../data/students'

const BASE_TITLE = 'Next Step Tutoring'

function NotesPage() {
  const { slug } = useParams()

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

  // If no slug provided, show all students
  if (!slug) {
    return (
      <article className="notes-page active" data-page="notes">
        <header>
          <h2 className="h2 article-title">Session Notes</h2>
        </header>
        
        <section className="notes-intro">
          <p className="about-text">
            Select a student to view their session notes.
          </p>
        </section>

        {students.length === 0 ? (
          <div className="notes-empty">
            <p>No students added yet. Add students to <code>src/data/students.js</code></p>
          </div>
        ) : (
          <div className="students-list">
            {students.map((student) => (
              <Link 
                key={student.slug} 
                to={`/notes/${student.slug}`}
                className="student-card"
              >
                <div className="student-card-content">
                  <ion-icon name="person-outline"></ion-icon>
                  <h3 className="h4">{student.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        )}
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
            <span>Back to All Students</span>
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
          <span>All Students</span>
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
