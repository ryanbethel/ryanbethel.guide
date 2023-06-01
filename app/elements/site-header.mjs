export default function SiteHeader ({ html }) {
  return html`
    <style>
      h1, p {
        text-align: var(--align-heading);
      }
    </style>
    <header>
      <h1 class='text2 text4-lg font-heading font-bold tracking-1 pt4 pt6-lg pb0 pb2-lg'>
        <a href='/' class='no-underline'>
          Ryan Bethel
        </a>
      </h1>
      <p class='font-body pb4 pb6-lg'>
        I like to solving interesting problems. I use software and systems to do it. And sometimes I write about it.
      </p>
    </header>
  `
}
