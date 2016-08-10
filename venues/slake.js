import request from 'request-promise';
import cheerio from 'cheerio';

const url = 'http://slakecafe.com/';
export const data = {
  url,
  name: 'Slake',
};

export async function scrape() {
  const body = await request(url);
  const $ = cheerio.load(body);
  return Object.assign({ special: $('#cff .cff-text') }, data);
}
