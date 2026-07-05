function Home({ activePage, setActivePage }) {
  return (
    <article className={`home${activePage === 'home' ? ' active' : ''}`} data-page="home">

      <header>
        <h2 className="h2 article-title">Home</h2>
      </header>

      <section className="hero-section">

        <div className="hero-badge">
          <ion-icon name="school-outline"></ion-icon>
          <span>Online Math Tutor · US &amp; Canada Curriculum</span>
        </div>

        <h3 className="hero-title">
          Building confidence,<br />
          <span className="hero-highlight">one concept at a time.</span>
        </h3>

        <p className="hero-text">
          One-on-one online math tutoring with 11+ years of teaching experience — helping students
          truly understand math, not just memorize it. Serving students across EST, CST, and PST time zones.
        </p>

        <div className="hero-cta-wrapper">
          <button
            className="hero-cta-btn primary"
            onClick={() => {
              setActivePage('contact')
              window.scrollTo(0, 0)
            }}
          >
            <ion-icon name="calendar-outline"></ion-icon>
            <span>Book a Free Trial Session</span>
          </button>
          <button
            className="hero-cta-btn secondary"
            onClick={() => {
              setActivePage('about')
              window.scrollTo(0, 0)
            }}
          >
            <ion-icon name="arrow-forward-outline"></ion-icon>
            <span>Learn More</span>
          </button>
        </div>

      </section>

      {/* Quick highlights */}
      <section className="hero-highlights">
        <ul className="highlights-grid">
          <li className="highlight-card">
            <div className="icon-box">
              <ion-icon name="checkmark-done-outline"></ion-icon>
            </div>
            <div className="highlight-content">
              <h4 className="h4 highlight-title">Conceptual Learning</h4>
              <p className="highlight-text">Build real understanding, not rote memorization</p>
            </div>
          </li>
          <li className="highlight-card">
            <div className="icon-box">
              <ion-icon name="trending-up-outline"></ion-icon>
            </div>
            <div className="highlight-content">
              <h4 className="h4 highlight-title">Proven Results</h4>
              <p className="highlight-text">Every student has shown measurable improvement</p>
            </div>
          </li>
          <li className="highlight-card">
            <div className="icon-box">
              <ion-icon name="people-outline"></ion-icon>
            </div>
            <div className="highlight-content">
              <h4 className="h4 highlight-title">Parent Partnership</h4>
              <p className="highlight-text">Regular check-ins and transparent progress tracking</p>
            </div>
          </li>
          <li className="highlight-card">
            <div className="icon-box">
              <ion-icon name="time-outline"></ion-icon>
            </div>
            <div className="highlight-content">
              <h4 className="h4 highlight-title">Flexible Scheduling</h4>
              <p className="highlight-text">Convenient sessions across EST, CST &amp; PST zones</p>
            </div>
          </li>
        </ul>
      </section>

    </article>
  )
}

export default Home
