import _values from 'lodash/values';

const venues = require('require-all')(`${__dirname}/venues`);

Promise.all(_values(venues).filter((x) => !!x.scrape).map((x) => x.scrape()))
.then((values) => {
  const data = values.map((x) => Object.assign({}, x, { special: x.special.text() }));
  console.log(data);
});
