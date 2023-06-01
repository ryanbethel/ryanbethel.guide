/** @type {import('@enhance/types').EnhanceElemFn} */
export default function ({ html, state }) {

  return html`
    <my-h-card class="hidden"></my-h-card>
    <site-layout>
      <main>
        <notes-posts></notes-posts>
      </main>
    </site-layout>
  `
}
