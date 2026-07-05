const education = [
  {
    title: 'University school of the arts',
    years: '2007 — 2008',
    text: 'Nemo enims ipsam voluptatem, blanditiis praesentium voluptum delenit atque corrupti, quos dolores et quas molestias exceptur.',
  },
  {
    title: 'New york academy of art',
    years: '2006 — 2007',
    text: 'Ratione voluptatem sequi nesciunt, facere quisquams facere menda ossimus, omnis voluptas assumenda est omnis..',
  },
  {
    title: 'High school of art and design',
    years: '2002 — 2004',
    text: 'Duis aute irure dolor in reprehenderit in voluptate, quila voluptas mag odit aut fugit, sed consequuntur magni dolores eos.',
  },
]

const experience = [
  {
    title: 'Creative director',
    years: '2015 — Present',
    text: 'Nemo enim ipsam voluptatem blanditiis praesentium voluptum delenit atque corrupti, quos dolores et qvuas molestias exceptur.',
  },
  {
    title: 'Art director',
    years: '2013 — 2015',
    text: 'Nemo enims ipsam voluptatem, blanditiis praesentium voluptum delenit atque corrupti, quos dolores et quas molestias exceptur.',
  },
  {
    title: 'Web designer',
    years: '2010 — 2013',
    text: 'Nemo enims ipsam voluptatem, blanditiis praesentium voluptum delenit atque corrupti, quos dolores et quas molestias exceptur.',
  },
]

const skills = [
  { name: 'Web design', value: 80 },
  { name: 'Graphic design', value: 70 },
  { name: 'Branding', value: 90 },
  { name: 'WordPress', value: 50 },
]

function TimelineSection({ icon, title, items }) {
  return (
    <section className="timeline">
      <div className="title-wrapper">
        <div className="icon-box">
          <ion-icon name={icon}></ion-icon>
        </div>
        <h3 className="h3">{title}</h3>
      </div>
      <ol className="timeline-list">
        {items.map((item) => (
          <li className="timeline-item" key={item.title}>
            <h4 className="h4 timeline-item-title">{item.title}</h4>
            <span>{item.years}</span>
            <p className="timeline-text">{item.text}</p>
          </li>
        ))}
      </ol>
    </section>
  )
}

function Resume({ activePage }) {
  return (
    <article className={`resume${activePage === 'resume' ? ' active' : ''}`} data-page="resume">

      <header>
        <h2 className="h2 article-title">Resume</h2>
      </header>

      <TimelineSection icon="book-outline" title="Education" items={education} />
      <TimelineSection icon="book-outline" title="Experience" items={experience} />

      <section className="skill">
        <h3 className="h3 skills-title">My skills</h3>
        <ul className="skills-list content-card">
          {skills.map((skill) => (
            <li className="skills-item" key={skill.name}>
              <div className="title-wrapper">
                <h5 className="h5">{skill.name}</h5>
                <data value={skill.value}>{skill.value}%</data>
              </div>
              <div className="skill-progress-bg">
                <div className="skill-progress-fill" style={{ width: `${skill.value}%` }}></div>
              </div>
            </li>
          ))}
        </ul>
      </section>

    </article>
  )
}

export default Resume
