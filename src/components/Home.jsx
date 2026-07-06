function Home({ activePage, setActivePage }) {
  return (
    <article className={`home${activePage === 'home' ? ' active' : ''}`} data-page="home">

      <header>
        <h2 className="h2 article-title">Home</h2>
      </header>

      {/* Hero Section */}
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
          One-on-one online math tutoring with 11+ years of teaching experience — helping students truly understand math, not just memorize it. Serving students across EST, CST, and PST time zones.
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
              document.getElementById('about-me')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            <ion-icon name="arrow-down-outline"></ion-icon>
            <span>Learn More</span>
          </button>
        </div>
      </section>

      {/* Divider */}
      <hr style={{ border: 'none', borderTop: '1px solid var(--jet)', margin: '50px 0' }} />

      {/* About Me Section */}
      <section id="about-me">
        <header>
          <h3 className="h3">About Me</h3>
        </header>
        <p className="about-text" style={{ marginTop: '15px' }}>
          I am a dedicated online math tutor with 11+ years of experience, specializing in the US and Canadian curricula. I focus on building strong conceptual foundations rather than rote memorization. My tailored one-on-one approach ensures every student learns at their own pace, helping them gain real confidence, problem-solving skills, and measurable improvements in their grades.
        </p>

        <ul className="stats-list" style={{ marginTop: '30px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
          <li className="stat-card">
            <h4 className="stat-number">11+</h4>
            <p className="stat-text">Years Teaching Experience</p>
          </li>
          <li className="stat-card">
            <h4 className="stat-number">4+</h4>
            <p className="stat-text">Years — US &amp; Canada Curriculum</p>
          </li>
          <li className="stat-card">
            <h4 className="stat-number">1:1</h4>
            <p className="stat-text">Fully Online, Personalized Sessions</p>
          </li>
          <li className="stat-card">
            <h4 className="stat-number" style={{ fontSize: '1.8rem' }}>EST · CST · PST</h4>
            <p className="stat-text">Time Zones Served</p>
          </li>
        </ul>
      </section>

      {/* Divider */}
      <hr style={{ border: 'none', borderTop: '1px solid var(--jet)', margin: '50px 0' }} />

      {/* Services Section */}
      <section>
        <header>
          <h3 className="h3">Services</h3>
          <p style={{ color: 'var(--light-gray)', marginTop: '5px' }}>How I can help</p>
        </header>

        <ul className="services-list" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginTop: '25px' }}>
          <li className="service-item">
            <div className="service-content-box">
              <h4 className="h4 service-item-title">US Curriculum</h4>
              <p className="service-item-text">Personalized math tutoring aligned with US grade-level standards, from foundational arithmetic through algebra and beyond.</p>
            </div>
          </li>
          <li className="service-item">
            <div className="service-content-box">
              <h4 className="h4 service-item-title">Canadian Curriculum</h4>
              <p className="service-item-text">Support tailored to provincial math curricula, helping students stay confident and on track with their coursework.</p>
            </div>
          </li>
          <li className="service-item">
            <div className="service-content-box">
              <h4 className="h4 service-item-title">One-on-One Sessions</h4>
              <p className="service-item-text">Fully personalized attention — lessons move at your child's pace, with regular check-ins on progress.</p>
            </div>
          </li>
          <li className="service-item">
            <div className="service-content-box">
              <h4 className="h4 service-item-title">Fully Online</h4>
              <p className="service-item-text">Convenient, flexible scheduling from anywhere — all you need is a stable internet connection.</p>
            </div>
          </li>
        </ul>
      </section>

      {/* Divider */}
      <hr style={{ border: 'none', borderTop: '1px solid var(--jet)', margin: '50px 0' }} />

      {/* Track Record Section */}
      <section>
        <header>
          <h3 className="h3">Track Record</h3>
          <p style={{ color: 'var(--light-gray)', marginTop: '5px' }}>Consistent, real improvement</p>
        </header>
        <p className="about-text" style={{ marginTop: '15px' }}>
          Parents consistently describe the support here as proactive and attentive — regular check-ins, careful attention to each child's specific gaps, and steady communication along the way. The result: every student who has worked with me has shown measurable improvement, whether that's stronger grades, better test scores, or simply more confidence sitting down to do math homework.
        </p>
      </section>

      {/* Divider */}
      <hr style={{ border: 'none', borderTop: '1px solid var(--jet)', margin: '50px 0' }} />

      {/* Auto Moving Feedbacks */}
      <section style={{ overflow: 'hidden' }}>
        <header>
          <h3 className="h3">What Parents &amp; Students Say</h3>
          <p style={{ color: 'var(--light-gray)', marginTop: '5px' }}>Real feedback</p>
        </header>
        
        <div className="marquee-wrapper" style={{ display: 'flex', overflow: 'hidden', marginTop: '25px', paddingBottom: '10px' }}>
          <div className="marquee-content" style={{ display: 'flex', gap: '20px', animation: 'marquee 40s linear infinite', width: 'max-content' }}>
            {/* 5 feedbacks */}
            <div className="feedback-card">
              <p>"Extremely proactive and genuinely cares about every student's progress. My child has improved so much since we started."</p>
              <h5>— Parent, Grade 8</h5>
            </div>
            <div className="feedback-card">
              <p>"Every session feels personal, not rushed. The results speak for themselves — my child's grades and confidence have both gone up."</p>
              <h5>— Parent, Grade 10</h5>
            </div>
            <div className="feedback-card">
              <p>"Kavitha explains concepts so clearly! My son used to hate math, but now he actually looks forward to his classes."</p>
              <h5>— Parent, Grade 6</h5>
            </div>
            <div className="feedback-card">
              <p>"The tailored approach for the Canadian curriculum was exactly what we needed. Highly recommended!"</p>
              <h5>— Parent, Grade 9</h5>
            </div>
            <div className="feedback-card">
              <p>"Flexible scheduling and excellent teaching. A lifesaver for busy parents and struggling students."</p>
              <h5>— Parent, Grade 7</h5>
            </div>
            
            {/* Duplicated 5 feedbacks for seamless infinite scroll */}
            <div className="feedback-card">
              <p>"Extremely proactive and genuinely cares about every student's progress. My child has improved so much since we started."</p>
              <h5>— Parent, Grade 8</h5>
            </div>
            <div className="feedback-card">
              <p>"Every session feels personal, not rushed. The results speak for themselves — my child's grades and confidence have both gone up."</p>
              <h5>— Parent, Grade 10</h5>
            </div>
            <div className="feedback-card">
              <p>"Kavitha explains concepts so clearly! My son used to hate math, but now he actually looks forward to his classes."</p>
              <h5>— Parent, Grade 6</h5>
            </div>
            <div className="feedback-card">
              <p>"The tailored approach for the Canadian curriculum was exactly what we needed. Highly recommended!"</p>
              <h5>— Parent, Grade 9</h5>
            </div>
            <div className="feedback-card">
              <p>"Flexible scheduling and excellent teaching. A lifesaver for busy parents and struggling students."</p>
              <h5>— Parent, Grade 7</h5>
            </div>
          </div>
        </div>
      </section>

      {/* Divider */}
      <hr style={{ border: 'none', borderTop: '1px solid var(--jet)', margin: '50px 0' }} />

      {/* Get In Touch */}
      <section className="contact-section" style={{ background: 'var(--border-gradient-onyx)', padding: '30px', borderRadius: '14px', position: 'relative', zIndex: 1 }}>
        <div style={{ content: '""', position: 'absolute', inset: '1px', background: 'var(--bg-gradient-jet)', borderRadius: 'inherit', zIndex: -1 }}></div>
        <header>
          <h3 className="h3">Get in Touch</h3>
          <p style={{ color: 'var(--light-gray)', marginTop: '5px' }}>Let's help your child build confidence in math.</p>
        </header>
        <p className="about-text" style={{ marginTop: '15px' }}>
          Reach out to schedule a free trial session, ask about pricing, or check current availability for your time zone.
        </p>
        <div style={{ display: 'flex', gap: '15px', marginTop: '25px', flexWrap: 'wrap' }}>
          <a href="mailto:kavitha@example.com" className="hero-cta-btn primary" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ion-icon name="mail-outline"></ion-icon>
            <span>Email Me</span>
          </a>
          <a href="https://wa.me/1234567890" className="hero-cta-btn secondary" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ion-icon name="logo-whatsapp"></ion-icon>
            <span>WhatsApp Me</span>
          </a>
        </div>
        
        <ul className="social-list" style={{ justifyContent: 'center', marginTop: '30px' }}>
          <li className="social-item">
            <a href="#" className="social-link" style={{ fontSize: '1.5rem' }}>
              <ion-icon name="logo-whatsapp"></ion-icon>
            </a>
          </li>
          <li className="social-item">
            <a href="#" className="social-link" style={{ fontSize: '1.5rem' }}>
              <ion-icon name="logo-instagram"></ion-icon>
            </a>
          </li>
          <li className="social-item">
            <a href="#" className="social-link" style={{ fontSize: '1.5rem' }}>
              <ion-icon name="logo-linkedin"></ion-icon>
            </a>
          </li>
        </ul>
      </section>

      <footer style={{ marginTop: '60px', textAlign: 'center', color: 'var(--light-gray)', fontSize: 'var(--fs-8)', paddingBottom: '30px' }}>
        © 2026 Kavitha JR — Online Math Tutor. All rights reserved.
      </footer>

    </article>
  )
}

export default Home
