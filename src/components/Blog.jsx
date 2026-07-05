const posts = [
  {
    img: '/assets/images/blog-1.jpg',
    alt: 'Design conferences in 2022',
    category: 'Design',
    date: '2022-02-23',
    dateLabel: 'Fab 23, 2022',
    title: 'Design conferences in 2022',
    text: 'Veritatis et quasi architecto beatae vitae dicta sunt, explicabo.',
  },
  {
    img: '/assets/images/blog-2.jpg',
    alt: 'Best fonts every designer',
    category: 'Design',
    date: '2022-02-23',
    dateLabel: 'Fab 23, 2022',
    title: 'Best fonts every designer',
    text: 'Sed ut perspiciatis, nam libero tempore, cum soluta nobis est eligendi.',
  },
  {
    img: '/assets/images/blog-3.jpg',
    alt: 'Design digest #80',
    category: 'Design',
    date: '2022-02-23',
    dateLabel: 'Fab 23, 2022',
    title: 'Design digest #80',
    text: 'Excepteur sint occaecat cupidatat no proident, quis nostrum exercitationem ullam corporis suscipit.',
  },
  {
    img: '/assets/images/blog-4.jpg',
    alt: 'UI interactions of the week',
    category: 'Design',
    date: '2022-02-23',
    dateLabel: 'Fab 23, 2022',
    title: 'UI interactions of the week',
    text: 'Enim ad minim veniam, consectetur adipiscing elit, quis nostrud exercitation ullamco laboris nisi.',
  },
  {
    img: '/assets/images/blog-5.jpg',
    alt: 'The forgotten art of spacing',
    category: 'Design',
    date: '2022-02-23',
    dateLabel: 'Fab 23, 2022',
    title: 'The forgotten art of spacing',
    text: 'Maxime placeat, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  },
  {
    img: '/assets/images/blog-6.jpg',
    alt: 'Design digest #79',
    category: 'Design',
    date: '2022-02-23',
    dateLabel: 'Fab 23, 2022',
    title: 'Design digest #79',
    text: 'Optio cumque nihil impedit uo minus quod maxime placeat, velit esse cillum.',
  },
]

function Blog({ activePage }) {
  return (
    <article className={`blog${activePage === 'blog' ? ' active' : ''}`} data-page="blog">

      <header>
        <h2 className="h2 article-title">Blog</h2>
      </header>

      <section className="blog-posts">
        <ul className="blog-posts-list">
          {posts.map((post) => (
            <li className="blog-post-item" key={post.title}>
              <a href="#">
                <figure className="blog-banner-box">
                  <img src={post.img} alt={post.alt} loading="lazy" />
                </figure>
                <div className="blog-content">
                  <div className="blog-meta">
                    <p className="blog-category">{post.category}</p>
                    <span className="dot"></span>
                    <time dateTime={post.date}>{post.dateLabel}</time>
                  </div>
                  <h3 className="h3 blog-item-title">{post.title}</h3>
                  <p className="blog-text">{post.text}</p>
                </div>
              </a>
            </li>
          ))}
        </ul>
      </section>

    </article>
  )
}

export default Blog
