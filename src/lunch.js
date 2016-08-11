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
  const withinMeters = options.distance || 3219; // 2 miles
  _values(venues)
  // Only show open venues
  .filter((x) => (x.openAt ? x.openAt(openAt) : true))
  // Annotate data with the distance and conditionally show them if close
  .forEach((x) => {
    venuesHash[x.data.name] = x;
    if (x.data.coordinates) {
      const distance = geodist(HOMES.capfac, x.data.coordinates, { unit: 'meters' });
      if (distance < withinMeters) {
        venuesHash[x.data.name].distance = distance;
      }
    } else {
      console.warn(`Missing coordinates, ${x.data.name} won't show`);
    }
  });
  return venuesHash;
}
