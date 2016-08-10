import slake from './venues/slake';
import stdavids from './venues/stdavids';

Promise.all([
  slake(),
  stdavids(),
]).then((values) => {
  const data = values.map((x) => Object.assign({}, x, { special: x.special.text() }));
  console.log(data);
});
