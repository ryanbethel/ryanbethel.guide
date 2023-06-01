const fs = require('fs')
const matter = require('gray-matter')
const {globSync} = require('glob')

function formatDate(dateString) {
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  let [month, day, year] = dateString.split(' ')
  day = day.replace(',', '') 


  const monthNumber = months.indexOf(month) + 1
  const paddedMonth = monthNumber < 10 ? `0${monthNumber}` : monthNumber
  const paddedDay = day < 10 ? `0${day}` : day

  return `${year}-${paddedMonth}-${paddedDay}`
}

async function checkDates(directory) {
  const files = globSync(`${directory}/**/*.md`)

  files.forEach(fileName => {
    const fileData = fs.readFileSync(fileName, 'utf8') 

    const filenameDateMatch = fileName.match(/\d{4}-\d{2}-\d{2}/)
    const filenameDateUnpadded = fileName.match(/\d{4}-\d+-\d+/)
    if (!filenameDateMatch && filenameDateUnpadded) {
      throw new Error(`Filename ${fileName} has a day or month that is not padded with zero's (i.e. 1 should be 01).`)
    }
    const filenameDate = filenameDateMatch ? filenameDateMatch[0] : null

    const frontmatter = matter(fileData)
    const frontmatterDate = frontmatter.data.published

    if (filenameDate && frontmatterDate) {
      const formattedFrontmatterDate = formatDate(frontmatterDate)
      if (filenameDate !== formattedFrontmatterDate) {
        throw new Error(`Mismatch in file ${fileName}: filename date is ${filenameDate}, frontmatter date is ${frontmatterDate}`)
      }
    }
  })
}

module.exports = checkDates
