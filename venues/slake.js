import request from 'request-promise';
import cheerio from 'cheerio';

const url = 'http://slakecafe.com/';


export default async function () {
  const body = await request(url);
  const $ = cheerio.load(body);
  return $('#cff .cff-text');
}
