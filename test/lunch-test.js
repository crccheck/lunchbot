import { expect } from 'chai';
import _keys from 'lodash/keys';
import sinon from 'sinon';
import { HOMES, _get } from '../src/lunch';

const MOCK_VENUES = {
  foo: { data: { name: 'Foo Deli', coordinates: HOMES.capfac } },
  bar: { data: { name: 'Bar Restaurant', coordinates: HOMES.capfac } },
  baz: { data: { name: 'Baz Cemetary', coordinates: undefined } },
  far: { data: { name: 'Null Island', coordinates: [0, 0] } },
};

describe('_get', () => {
  before(() => {
    sinon.stub(console, 'warn');
  });
  after(() => {
    console.warn.restore();
  });

  it('skips venues without coordinates', () => {
    const venues = _get(MOCK_VENUES);
    expect(_keys(venues).length).to.be.equal(2);
    expect(_keys(venues)).to.not.contain('Baz Cemetary');
  });

  it('skips far venues', () => {
    const venues = _get(MOCK_VENUES);
    expect(_keys(venues).length).to.be.equal(2);
    expect(_keys(venues)).to.not.contain('Null Island');
  });

  it('can include far venues', () => {
    const venues = _get(MOCK_VENUES, undefined, 1e10);
    expect(_keys(venues).length).to.be.equal(3);
    expect(_keys(venues)).to.contain('Null Island');
  });
});
