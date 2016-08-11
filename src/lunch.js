import _values from 'lodash/values';
import geodist from 'geodist';

const venues = require('require-all')(`${__dirname}/venues`);

const HOMES = {
  capfac: [30.268899, -97.740614],
};

export default function get(options = {}) {
  const venuesHash = {};
  // TODO use coordinate-tz to make sure the date is localized to the requestor's timezone
  const openAt = options.openAt || new Date();
  _values(venues)
  .filter((x) => (x.openAt ? x.openAt(openAt) : true))
  .forEach((x) => {
    venuesHash[x.data.name] = x;
    if (x.data.coordinates) {
      venuesHash[x.data.name].distance = geodist(
        HOMES.capfac, x.data.coordinates, { unit: 'meters' }
      );
    }
  });
  return venuesHash;
}
