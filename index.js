import _values from 'lodash/values';

const venues = require('require-all')(`${__dirname}/venues`);

console.log(_values(venues).map((x) => x.data));

Promise.all(_values(venues).filter((x) => !!x.scrape).map((x) => x.scrape()))
.then((values) => {
  const data = values.map((x) => Object.assign({}, x, { special: x.special.text() }));
  console.log(data);
});
