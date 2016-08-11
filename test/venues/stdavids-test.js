import { expect } from 'chai';
import { data } from '../../src/venues/stdavids';

describe('stdavids', () => {
  describe('data', () => {
    it('has a name', () => {
      expect(data.name).to.be.ok;
    });
  });
});
