import { useState } from 'react'

const projects = [
  { img: '/assets/images/project-1.jpg', title: 'Finance', category: 'web development' },
  { img: '/assets/images/project-2.png', title: 'Orizon', category: 'web development' },
  { img: '/assets/images/project-3.jpg', title: 'Fundo', category: 'web design' },
  { img: '/assets/images/project-4.png', title: 'Brawlhalla', category: 'applications' },
  { img: '/assets/images/project-5.png', title: 'DSM.', category: 'web design' },
  { img: '/assets/images/project-6.png', title: 'MetaSpark', category: 'web design' },
  { img: '/assets/images/project-7.png', title: 'Summary', category: 'web development' },
  { img: '/assets/images/project-8.jpg', title: 'Task Manager', category: 'applications' },
  { img: '/assets/images/project-9.png', title: 'Arrival', category: 'web development' },
]

const filterButtons = ['All', 'Web design', 'Applications', 'Web development']

function Portfolio({ activePage }) {
  const [activeFilter, setActiveFilter] = useState('all')
  const [selectOpen, setSelectOpen] = useState(false)
  const [selectLabel, setSelectLabel] = useState('Select category')

  const handleFilter = (value) => {
    setActiveFilter(value.toLowerCase())
    setSelectLabel(value)
    setSelectOpen(false)
  }

  const isVisible = (category) =>
    activeFilter === 'all' || category === activeFilter

  return (
    <article className={`portfolio${activePage === 'portfolio' ? ' active' : ''}`} data-page="portfolio">

      <header>
        <h2 className="h2 article-title">Portfolio</h2>
      </header>

      <section className="projects">

        {/* filter buttons (desktop) */}
        <ul className="filter-list">
          {filterButtons.map((btn) => (
            <li className="filter-item" key={btn}>
              <button
                className={activeFilter === btn.toLowerCase() ? 'active' : ''}
                data-filter-btn
                onClick={() => handleFilter(btn)}
              >
                {btn}
              </button>
            </li>
          ))}
        </ul>

        {/* select dropdown (mobile) */}
        <div className="filter-select-box">
          <button
            className={`filter-select${selectOpen ? ' active' : ''}`}
            data-select
            onClick={() => setSelectOpen(!selectOpen)}
          >
            <div className="select-value" data-selecct-value>{selectLabel}</div>
            <div className="select-icon">
              <ion-icon name="chevron-down"></ion-icon>
            </div>
          </button>

          <ul className="select-list">
            {filterButtons.map((btn) => (
              <li className="select-item" key={btn}>
                <button data-select-item onClick={() => handleFilter(btn)}>{btn}</button>
              </li>
            ))}
          </ul>
        </div>

        {/* project grid */}
        <ul className="project-list">
          {projects.map((project) => (
            <li
              key={project.title}
              className={`project-item${isVisible(project.category) ? ' active' : ''}`}
              data-filter-item
              data-category={project.category}
            >
              <a href="#">
                <figure className="project-img">
                  <div className="project-item-icon-box">
                    <ion-icon name="eye-outline"></ion-icon>
                  </div>
                  <img src={project.img} alt={project.title.toLowerCase()} loading="lazy" />
                </figure>
                <h3 className="project-title">{project.title}</h3>
                <p className="project-category" style={{ textTransform: 'capitalize' }}>{project.category}</p>
              </a>
            </li>
          ))}
        </ul>

      </section>

    </article>
  )
}

export default Portfolio
