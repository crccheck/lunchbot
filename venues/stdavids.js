import request from 'request-promise';
import cheerio from 'cheerio';

const url = 'http://www.stdave.org/about/on-campus/thursday-lunch/';

function findOffsets (nodes) {
  let begin, end, $node;
  for (let i = 0; i < nodes.length; i++) {
    $node = cheerio(nodes[i]);
    if ($node.text() === 'Thursday Lunch') {
      begin = i;
    } else if ($node.attr('id') === 'dinner' ) {
      end = i;
      break;
    }
  }
  return {begin, end};
}

export default async function () {
  const body = await request(url);
  const $ = cheerio.load(body);
  const nodes = $('div.entry-content').children();
  const $rv = $('<div/>');
  const {begin, end} = findOffsets(nodes);
  $rv.append(nodes.slice(begin, end));
  return $rv;
}
