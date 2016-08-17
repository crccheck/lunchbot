import { expect } from 'chai';
import _keys from 'lodash/keys';
import sinon from 'sinon';
import { HOMES, _get } from '../src/lunch';

const MOCK_VENUES = {
  foo: { data: { name: 'Foo Deli', coordinates: HOMES.capfac } },
  bar: { data: { name: 'Bar Restaurant', coordinates: HOMES.capfac }, openAt: () => false },
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

  it('generates _meta', () => {
    const venues = _get(MOCK_VENUES);
    expect(_keys(venues)).to.contain('_meta');
    expect(_keys(venues._meta)).to.contain('limit');
    expect(_keys(venues._meta)).to.contain('total');
  });
  it('skips closed venues', () => {
    const venues = _get(MOCK_VENUES);
    expect(_keys(venues).length).to.be.equal(2);
    expect(_keys(venues)).to.not.contain('Bar Restaurant');
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

  it('can show only scrapeable venues', () => {
    const mockVenuesScrapeable = Object.assign({}, MOCK_VENUES);
    mockVenuesScrapeable.foo = Object.assign({}, MOCK_VENUES.foo, { scrape: () => {} });

    const venues = _get(mockVenuesScrapeable, undefined, 1e10, undefined, undefined, true);
    delete venues._meta;

    expect(_keys(venues).length).to.be.equal(1);
    expect(_keys(venues)).to.contain('Foo Deli');
  });
});
