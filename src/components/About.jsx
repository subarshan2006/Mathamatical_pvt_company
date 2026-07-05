import { useState } from 'react'

const testimonials = [
  {
    avatar: '/assets/images/avatar-1.png',
    name: 'Daniel lewis',
    text: 'Richard was hired to create a corporate identity. We were very pleased with the work done. She has a lot of experience and is very concerned about the needs of client. Lorem ipsum dolor sit amet, ullamcous cididt consectetur adipiscing elit, seds do et eiusmod tempor incididunt ut laborels dolore magnarels alia.',
  },
  {
    avatar: '/assets/images/avatar-2.png',
    name: 'Jessica miller',
    text: 'Richard was hired to create a corporate identity. We were very pleased with the work done. She has a lot of experience and is very concerned about the needs of client. Lorem ipsum dolor sit amet, ullamcous cididt consectetur adipiscing elit, seds do et eiusmod tempor incididunt ut laborels dolore magnarels alia.',
  },
  {
    avatar: '/assets/images/avatar-3.png',
    name: 'Emily evans',
    text: 'Richard was hired to create a corporate identity. We were very pleased with the work done. She has a lot of experience and is very concerned about the needs of client. Lorem ipsum dolor sit amet, ullamcous cididt consectetur adipiscing elit, seds do et eiusmod tempor incididunt ut laborels dolore magnarels alia.',
  },
  {
    avatar: '/assets/images/avatar-4.png',
    name: 'Henry william',
    text: 'Richard was hired to create a corporate identity. We were very pleased with the work done. She has a lot of experience and is very concerned about the needs of client. Lorem ipsum dolor sit amet, ullamcous cididt consectetur adipiscing elit, seds do et eiusmod tempor incididunt ut laborels dolore magnarels alia.',
  },
]

const clients = [
  '/assets/images/logo-1-color.png',
  '/assets/images/logo-2-color.png',
  '/assets/images/logo-3-color.png',
  '/assets/images/logo-4-color.png',
  '/assets/images/logo-5-color.png',
  '/assets/images/logo-6-color.png',
]

const services = [
  {
    icon: '/assets/images/icon-design.svg',
    alt: 'design icon',
    title: 'Web design',
    text: 'The most modern and high-quality design made at a professional level.',
  },
  {
    icon: '/assets/images/icon-dev.svg',
    alt: 'Web development icon',
    title: 'Web development',
    text: 'High-quality development of sites at the professional level.',
  },
  {
    icon: '/assets/images/icon-app.svg',
    alt: 'mobile app icon',
    title: 'Mobile apps',
    text: 'Professional development of applications for iOS and Android.',
  },
  {
    icon: '/assets/images/icon-photo.svg',
    alt: 'camera icon',
    title: 'Photography',
    text: 'I make high-quality photos of any category at a professional level.',
  },
]

function About({ activePage }) {
  const [modal, setModal] = useState(null)

  const openModal = (t) => setModal(t)
  const closeModal = () => setModal(null)

  return (
    <article className={`about${activePage === 'about' ? ' active' : ''}`} data-page="about">

      <header>
        <h2 className="h2 article-title">About me</h2>
      </header>

      <section className="about-text">
        <p>
          I'm Creative Director and UI/UX Designer from Sydney, Australia, working in web development and print media.
          I enjoy turning complex problems into simple, beautiful and intuitive designs.
        </p>
        <p>
          My job is to build your website so that it is functional and user-friendly but at the same time attractive.
          Moreover, I add personal touch to your product and make sure that is eye-catching and easy to use. My aim is to bring
          across your message and identity in the most creative way. I created web design for many famous brand companies.
        </p>
      </section>

      {/* service */}
      <section className="service">
        <h3 className="h3 service-title">What i'm doing</h3>
        <ul className="service-list">
          {services.map((s) => (
            <li className="service-item" key={s.title}>
              <div className="service-icon-box">
                <img src={s.icon} alt={s.alt} width="40" />
              </div>
              <div className="service-content-box">
                <h4 className="h4 service-item-title">{s.title}</h4>
                <p className="service-item-text">{s.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* testimonials */}
      <section className="testimonials">
        <h3 className="h3 testimonials-title">Testimonials</h3>
        <ul className="testimonials-list has-scrollbar">
          {testimonials.map((t) => (
            <li className="testimonials-item" key={t.name}>
              <div className="content-card" data-testimonials-item onClick={() => openModal(t)} style={{ cursor: 'pointer' }}>
                <figure className="testimonials-avatar-box">
                  <img src={t.avatar} alt={t.name} width="60" data-testimonials-avatar />
                </figure>
                <h4 className="h4 testimonials-item-title" data-testimonials-title>{t.name}</h4>
                <div className="testimonials-text" data-testimonials-text>
                  <p>{t.text}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* testimonials modal */}
      <div className={`modal-container${modal ? ' active' : ''}`} data-modal-container>
        <div className={`overlay${modal ? ' active' : ''}`} data-overlay onClick={closeModal}></div>
        <section className="testimonials-modal">
          <button className="modal-close-btn" data-modal-close-btn onClick={closeModal}>
            <ion-icon name="close-outline"></ion-icon>
          </button>
          <div className="modal-img-wrapper">
            <figure className="modal-avatar-box">
              <img src={modal?.avatar || '/assets/images/avatar-1.png'} alt={modal?.name || ''} width="80" data-modal-img />
            </figure>
            <img src="/assets/images/icon-quote.svg" alt="quote icon" />
          </div>
          <div className="modal-content">
            <h4 className="h3 modal-title" data-modal-title>{modal?.name}</h4>
            <time dateTime="2021-06-14">14 June, 2021</time>
            <div data-modal-text>
              <p>{modal?.text}</p>
            </div>
          </div>
        </section>
      </div>

      {/* clients */}
      <section className="clients">
        <h3 className="h3 clients-title">Clients</h3>
        <ul className="clients-list has-scrollbar">
          {clients.map((logo, i) => (
            <li className="clients-item" key={i}>
              <a href="#">
                <img src={logo} alt="client logo" />
              </a>
            </li>
          ))}
        </ul>
      </section>

    </article>
  )
}

export default About
