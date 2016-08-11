import { expect } from 'chai';
import { readFileSync } from 'fs';
import sinon from 'sinon';
import path from 'path';
import sinonAsPromised from 'sinon-as-promised'; // eslint-disable-line no-unused-vars
import request from 'request-promise';
import { data, scrape } from '../../src/venues/stdavids';

describe('stdavids', () => {
  describe('data', () => {
    it('has a name', () => {
      expect(data.name).to.be.ok;
    });
    it('has a url', () => {
      expect(data.url).to.be.ok;
    });
  });

  describe('scrape', () => {
    before(() => {
      const fixturePath = path.join(__dirname, '../fixtures/stdavids.html');
      const dummyHTML = readFileSync(fixturePath, { encoding: 'utf8' });
      sinon.stub(request, 'get').returns(dummyHTML);
    });
    it('works', () =>
      scrape().then((venueData) => {
        expect(venueData.special.text()).to.be.ok;
      })
    );
  });
});
