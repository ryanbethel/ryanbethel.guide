// View documentation at: https://enhance.dev/docs/learn/starter-project/pages
/**
  * @type {import('@enhance/types').EnhanceElemFn}
  */
export default function Html ({ html, state }) {
  const { store } = state
  let notes = store.notes || []
  const note = store.note || {}
  const problems = store.problems || {}

  return html`<enhance-page-container>
  <main>
    <h1 class="mb1 font-semibold text3">Notes page</h1>
    ${notes.map(item => `<article class="mb2">
<div class="mb0">
  <p class="pb-2"><strong class="capitalize">title: </strong>${item?.title || ''}</p>
  <p class="pb-2"><strong class="capitalize">link: </strong>${item?.link || ''}</p>
  <p class="pb-2"><strong class="capitalize">text: </strong>${item?.text || ''}</p>
  <p class="pb-2"><strong class="capitalize">key: </strong>${item?.key || ''}</p>
</div>
<p class="mb-1">
  <enhance-link href="/admin/notes/${item.key}">Edit this note</enhance-link>
</p>
<form action="/admin/notes/${item.key}/delete" method="POST" class="mb-1">
  <enhance-submit-button><span slot="label">Delete this note</span></enhance-submit-button>
</form>
</article>`).join('\n')}
<details class="mb0" ${Object.keys(problems).length ? 'open' : ''}>
    <summary>New note</summary>
    <enhance-form
  action="/admin/notes/${note.key}"
  method="POST">
  <div class="${problems.form ? 'block' : 'hidden'}">
    <p>Found some problems!</p>
    <ul>${problems.form}</ul>
  </div>
  <enhance-fieldset legend="Note">
  <enhance-text-input label="Title" type="text" id="title" name="title" value="${note?.title}" errors="${problems?.title?.errors}"></enhance-text-input>
  <enhance-text-input label="Link" type="text" id="link" name="link" value="${note?.link}" errors="${problems?.link?.errors}"></enhance-text-input>
  <enhance-text-input label="Text" type="text" id="text" name="text" value="${note?.text}" errors="${problems?.text?.errors}"></enhance-text-input>
  <input type="hidden" id="key" name="key" value="${note?.key}" />
  <enhance-submit-button style="float: right"><span slot="label">Save</span></enhance-submit-button>
  </enhance-fieldset>
</enhance-form>
</details>
</main>
</enhance-page-container>
  `
}
