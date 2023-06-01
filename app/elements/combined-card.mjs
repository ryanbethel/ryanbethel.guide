export default function BlogPost({ html, state }) {
  const { attrs, store } = state
  const { key } = attrs
  const {type,content} = store.combined[key]
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
    ${type==='blog' && 
    `<a href="${content.frontmatter.href}" class="no-underline">
      <article class="pt0 pb0 pt4-lg pb4-lg">
        <div class="font-body leading3">
          <h1 class="font-heading font-bold leading1 text2 text3-lg tracking-1 mb0">${content.frontmatter.title}</h1>
          <p class="mb0">${content.frontmatter.description}</p>
          <p class="text-1 tracking1">
            ${content.frontmatter.published}<br />
            ${content.frontmatter.readtime} to read
          </p>
        </div>
      </article>
    </a>`
}

    ${type==='note' && 
    `<a href="${content.href}" class="no-underline">
      <article class="pt0 pb0 pt4-lg pb4-lg">
        <div class="font-body leading3">
          ${content.title ? `<h1 class="font-heading font-bold leading1 text2 text3-lg tracking-1 mb0">${content.title}</h1>` : ''}
          <p class="mb0">${content.text}</p>
          ${content.link ? `<p>Reference Link: <a href="${content.link}" class="no-underline">${content.link}</a></p>`:''}
          <p class="text-1 tracking1">
            ${content.published}<br />
          </p>
          <p class="text-1 tracking1">
            #${content.ordinal}<br />
          </p>
        </div>
      </article>
    </a>`
}
  `
}
