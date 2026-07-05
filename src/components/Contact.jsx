import { useState } from 'react'

function Contact({ activePage }) {
  const [fullname, setFullname] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  const isValid = fullname.trim() !== '' && email.trim() !== '' && message.trim() !== ''

  return (
    <article className={`contact${activePage === 'contact' ? ' active' : ''}`} data-page="contact">

      <header>
        <h2 className="h2 article-title">Contact</h2>
      </header>

      <section className="mapbox" data-mapbox>
        <figure>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d199666.5651251294!2d-121.58334177520186!3d38.56165006739519!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x809ac672b28397f9%3A0x921f6aaa74197fdb!2sSacramento%2C%20CA%2C%20USA!5e0!3m2!1sen!2sbd!4v1647608789441!5m2!1sen!2sbd"
            width="400"
            height="300"
            loading="lazy"
            title="Sacramento map"
          ></iframe>
        </figure>
      </section>

      <section className="contact-form">
        <h3 className="h3 form-title">Contact Form</h3>

        <form
          action="#"
          className="form"
          data-form
          onSubmit={(e) => e.preventDefault()}
        >
          <div className="input-wrapper">
            <input
              type="text"
              name="fullname"
              className="form-input"
              placeholder="Full name"
              required
              data-form-input
              value={fullname}
              onChange={(e) => setFullname(e.target.value)}
            />
            <input
              type="email"
              name="email"
              className="form-input"
              placeholder="Email address"
              required
              data-form-input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <textarea
            name="message"
            className="form-input"
            placeholder="Your Message"
            required
            data-form-input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          ></textarea>

          <button
            className="form-btn"
            type="submit"
            disabled={!isValid}
            data-form-btn
          >
            <ion-icon name="paper-plane"></ion-icon>
            <span>Send Message</span>
          </button>
        </form>
      </section>

    </article>
  )
}

export default Contact
