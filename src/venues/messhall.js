import request from 'request-promise';
import cheerio from 'cheerio';

export const data = {
  name: 'Messhall Cafe',
  url: 'http://www.messhallcafe.com/messhall/menu.jsp',
  coordinates: [30.2720202, -97.7418288],
};

export async function scrape() {
  const body = await request.get(data.url);
  const $ = cheerio.load(body);
  const day = new Date().getDay(); // FIXME take into account timezone
  const menu = $($('table.menuTable tr')[day]);
  return Object.assign({ menu }, data);
}
