import _values from 'lodash/values';
import geodist from 'geodist';

const venueModules = require('require-all')(`${__dirname}/venues`);

export const HOMES = {
  capfac: [30.268899, -97.740614],
};

/**
 * Internal function that does the actual work of collecting venues..
 * Written and exported only to support testing.
 * @param  {Object} venues a hash of Venue modules
 * @param  {Date} openAt only get venues that are open
 * @param  {Number} withinMeters only get venues this many meters away (point to point)
 * @return {Object}
 */
export function _get(venues, // eslint-disable-line no-underscore-dangle
                     openAt = new Date(), // TODO use coordinate-tz to localized
                     withinMeters = 3219, // 2 miles
                    ) {
  const venuesHash = {};
  _values(venues)
    // Only show open venues
    .filter((x) => (x.openAt ? x.openAt(openAt) : true))
    // Annotate data with the distance and conditionally show them if close
    .forEach((x) => {
      if (x.data.coordinates) {
        const distance = geodist(HOMES.capfac, x.data.coordinates, { unit: 'meters' });
        if (distance < withinMeters) {
          venuesHash[x.data.name] = Object.assign({}, x, { distance });
        }
      } else {
        console.warn(`Missing coordinates, ${x.data.name} won't show`);
      }
    });
  return venuesHash;
}

export default function get(options = {}) {
  return _get(venueModules, options.openAt, options.distance);
}
