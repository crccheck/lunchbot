import slake from './venues/slake';

const slakeUpdate = slake();

Promise.all([slakeUpdate]).then((values) => {
  values.forEach((x) => {
    console.log(x.text());
  });
});
