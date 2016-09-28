import { expect } from 'chai';
import sinon from 'sinon';
import sinonAsPromised from 'sinon-as-promised'; // eslint-disable-line no-unused-vars
import request from 'request-promise';
import { scrape } from '../../src/venues/mythaimom';

const FB_JSON = require('../fixtures/mythaimom.json');


xdescribe('mythaimom', () => {
  describe('scrape with a menu', () => {
    let clock;
    before(() => {
      sinon.stub(request, 'get').returns(FB_JSON);
      clock = sinon.useFakeTimers(new Date(FB_JSON.data[0].created_time).getTime());
    });
    after(() => {
      clock.restore();
      request.get.restore();
    });
    it('extracts the special of the day from the json', () =>
      scrape().then((venueData) => {
        expect(venueData.menu).to.include('stir fry');
      })
    );
  });
  describe('scrape without a menu', () => {
    before(() => {
      sinon.stub(request, 'get').returns({ data: [] });
    });
    after(() => {
      request.get.restore();
    });
    it('returns nothing when there is no menu', () =>
      scrape().then((venueData) => {
        expect(venueData.menu).to.be.undefined;
      })
    );
  });
});
