export default function BlogPosts({ html, state }) {
  const { store } = state
  // const { posts = [], offset, limit } = store
  const { notes = [] } = store

  const cards = notes
    // .slice(offset, offset + limit)
    // .map((o, i) => `<blog-card key="${i + offset}">post</blog-card>`)
    .map((o, i) => `<note-card key="${i}">post</note-card>`)
    .join('')

  return html`
      <section class="m-auto pt0 pb0">
        ${cards}
      </section>
    `
}
