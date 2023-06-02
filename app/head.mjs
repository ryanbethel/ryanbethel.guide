import { getLinkTag } from '@enhance/arc-plugin-styles/get-styles'

export default function Head(state) {
  const { store } = state
  const { post = '' } = store

  const siteUrl = process.env.SITE_URL || 'http://localhost:3333'
  const me = 'https://indieweb.social/@ryanbethel'

  const title = post ? `${post.title} — Ryan Bethel` : store.title

  const canonicalMeta = post?.frontmatter?.canonicalUrl
    ? `<link rel='canonical' href='${post.frontmatter.canonicalUrl}' />`
    : ''

  const descriptionMeta = post?.frontmatter?.excerpt
    ? post.frontmatter.excerpt
    : 'Development discussions etc.'

  return `
    <!DOCTYPE html>
    <html lang='en'>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        ${getLinkTag()}
        <link rel='stylesheet' href='/_public/css/global.css' />
        <link rel='stylesheet' href='/_public/css/a11y-dark.min.css' />
        <link rel="webmention" href="${siteUrl}/webmention">
        <link rel="icon" type="image/svg" sizes="32x32" href="/_public/favicon.svg">
        ${me ? `<link href="${me}" rel="me">` : ''}
        ${canonicalMeta}
        <meta name='description' content='${descriptionMeta}' />
        <title>${title}</title>
      </head>
  `
}

