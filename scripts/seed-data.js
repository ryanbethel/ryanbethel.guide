const db = require('@begin/data')
async function main() {
  await db.set({
    table: 'link_pages',
    key: 'link1',
    title: 'First Link Page',
    description: 'A cool page of links',
    page_url: 'linkpage1',
    theme: 'default',
    link_text_1: 'google',
    link_url_1: 'http://google.com'
  })
  await db.set({
    table: 'short_links',
    key: 'short1',
    short_url: 'catdog',
    long_url: 'https://wikipedia.com',
    type: 'temporary',
    same_site: false,
  })
  await db.set({
    table: 'notes',
    key: 'note1',
    title: 'test',
    link: 'test',
    text: 'test',
    published: '2023-06-15T15:30:45+05:00',
    ordinal: 1
  })
}
main()
