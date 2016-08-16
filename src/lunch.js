import _ from 'lodash';
import geodist from 'geodist';

const venueModules = require('require-all')(`${__dirname}/venues`);

export const HOMES = {
  capfac: [30.268899, -97.740614],
};

/**
 * Internal function that does the actual work of collecting venues..
 * Written and exported only to support testing.
 * @param  {Object} venues A hash of Venue modules
 * @param  {int} limit only get this many venues
 * @param  {Number} withinMeters only get venues this many meters away (point to point)
 * @param  {Array} origin The Lat/Long to use for reference
 * @param  {Date} openAt only get venues that are open
 * @return {Object} venues A hash of venue objects
 */
export function _get(venues,
                     limit = 5,
                     withinMeters = 3219, // 2 miles
                     openAt = new Date(), // TODO use coordinate-tz to localized
                     origin = HOMES.capfac,
                    ) {
  const venuesHash = {};
  _.values(venues)
    // Only show open venues
    .filter((x) => (x.openAt ? x.openAt(openAt) : true))
    // Annotate data with the distance and conditionally show them if close
    .forEach((x) => {
      if (x.data.coordinates) {
        const distance = geodist(origin, x.data.coordinates, { unit: 'meters' });
        if (distance < withinMeters) {
          venuesHash[x.data.name] = Object.assign({}, x, { distance });
        }
      } else {
        console.warn(`Missing coordinates, ${x.data.name} won't show`);
      }
    });
  const rv = _.fromPairs(_.slice(_.shuffle(_.toPairs(venuesHash)), 0, limit));
  rv._meta = {
    total: _.keys(venuesHash).length,
    limit,
    withinMeters,
    openAt,
  };
  return rv;
}

export default function get(options = {}) {
  return _get(venueModules, options.limit, options.distance, options.origin, options.openAt);
}
