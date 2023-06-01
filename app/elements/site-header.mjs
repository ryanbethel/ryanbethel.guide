export default function SiteHeader({ html }) {
  return html`
    <style>
      h1, p {
        text-align: var(--align-heading);
      }
    </style>
    <header>
      <h1 class='text3 font-heading font-bold tracking-1 pbs4 pbe0'>
        <a href='/' class='no-underline'>
          Ryan Bethel
        </a>
      </h1>
      <p class='font-body text0 pbe4'>
        I like to solving interesting problems. I use software and systems to do it. And sometimes I write about it.
      </p>
    </header>
  `
}
