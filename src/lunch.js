import _values from 'lodash/values';

const venues = require('require-all')(`${__dirname}/venues`);

export default function get() {
  const venuesHash = {};
  _values(venues).forEach((x) => { venuesHash[x.data.name] = x; });
  return venuesHash;
}
