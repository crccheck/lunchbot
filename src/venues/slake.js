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
  // TODO find specials better. It's written by hand on their end and they
  // are not consistent at all. Tried: Entree
  const menu = $('#cff .cff-text:contains("Slakewich")');
  return Object.assign({ menu }, data);
}
