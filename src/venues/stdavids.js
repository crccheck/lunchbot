import request from 'request-promise'
import cheerio from 'cheerio'

export const data = {
  url: 'http://www.stdave.org/about/on-campus/thursday-lunch/',
  name: "Café Divine at St. David's Episcopal Church",
  coordinates: [30.2684584, -97.7415823],
}

function findOffsets (nodes) {
  let begin
  let end
  let $node
  for (let i = 0; i < nodes.length; i++) {
    $node = cheerio(nodes[i])
    if ($node.text() === 'Thursday Lunch') {
      begin = i
    } else if (begin && $node.text().search(/\w+\s\d+,\s\d{4}/) !== -1) {
      begin = i // skip intro text
    } else if (begin && $node.attr('id') === 'dinner') {
      end = i
      break
    }
  }
  return { begin, end }
}

export async function scrape () {
  const body = await request.get(data.url)
  const $ = cheerio.load(body)
  const nodes = $('div.entry-content').children()
  const menu = $('<div/>')
  const { begin, end } = findOffsets(nodes)
  menu.append(nodes.slice(begin, end))
  return Object.assign({ menu }, data)
}

export function openAt (date) {
  const dayHour = date.getUTCDay() * 100 + date.getUTCHours(); // eslint-disable-line
  return (316 < dayHour && dayHour < 419); // eslint-disable-line
}
