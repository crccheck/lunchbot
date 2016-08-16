import request from 'request-promise';
import cheerio from 'cheerio';

export const data = {
  url: 'http://slakecafe.com/',
  name: 'Slake',
  coordinates: [30.2688673, -97.7435492],
};

export async function scrape() {
  const body = await request.get(data.url);
  const $ = cheerio.load(body);
  return Object.assign({ menu: $('#cff .cff-text:contains("Entree")') }, data);
}
