export default function BlogPosts({ html, state }) {
  const { store } = state
  const { combined = [], offset, limit } = store

  const cards = combined
    .slice(offset, offset + limit)
    .map((o, i) => `<combined-card key="${i + offset}">post</combined-card>`)
    .join('')

  return html`
      <section class="m-auto pt0 pb0">
        ${cards}
      </section>
    `
}
