import slake from './venues/slake';
import stdavids from './venues/stdavids';

Promise.all([
  slake(),
  stdavids(),
]).then((values) => {
  values.forEach((x) => {
    console.log(x.text());
  });
});
