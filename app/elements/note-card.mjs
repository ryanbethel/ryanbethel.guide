export default function NotePost({ html, state }) {
  const { attrs, store } = state
  const { key } = attrs
  const {href, text, published, title='', link='', ordinal=1 } = store.notes[key]
  return html`
    <style>
      :host {
        display: block;
      }

      .avatar {
        width: 40px;
        aspect-ratio: 1 / 1;
      }
    </style>
    <a href="${href}" class="no-underline">
      <article class="pt0 pb0 pt4-lg pb4-lg">
        <div class="font-body leading3">
          ${title ? `<h1 class="font-heading font-bold leading1 text2 text3-lg tracking-1 mb0">${title}</h1>` : ''}
          <p class="mb0">${text}</p>
          ${link ? `<p>Reference Link: <a href="${link}" class="no-underline">${link}</a></p>`:''}
          <p class="text-1 tracking1">
            ${published}<br />
          </p>
          <p class="text-1 tracking1">
            #${ordinal}<br />
          </p>
        </div>
      </article>
    </a>
  `
}
