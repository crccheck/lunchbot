import _values from 'lodash/values';
import geodist from 'geodist';

const venues = require('require-all')(`${__dirname}/venues`);

const HOMES = {
  capfac: [30.268899, -97.740614],
};

export default function get(options = {}) {
  const venuesHash = {};
  _values(venues).forEach((x) => {
    venuesHash[x.data.name] = x;
    if (x.data.coordinates) {
      venuesHash[x.data.name].distance = geodist(HOMES.capfac, x.data.coordinates, { unit: 'meters' });
    }
  });
  return venuesHash;
}
