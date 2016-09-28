import { expect } from 'chai'
import { readFileSync } from 'fs'
import sinon from 'sinon'
import sinonAsPromised from 'sinon-as-promised' // eslint-disable-line no-unused-vars
import path from 'path'
import request from 'request-promise'
import { scrape } from '../../src/venues/messhall'

describe('messhall', () => {
  describe('scrape with a menu', () => {
    let clock
    before(() => {
      const fixturePath = path.join(__dirname, '../fixtures/messhall.html')
      const dummyHTML = readFileSync(fixturePath, { encoding: 'utf8' })
      sinon.stub(request, 'get').returns(dummyHTML)
      clock = sinon.useFakeTimers(new Date('2016-08-18T11:00:00-05:00').getTime()) // Thursday
    })
    after(() => {
      clock.restore()
      request.get.restore()
    })
    it('extracts the special of the day from the HTML', () =>
      scrape().then((venueData) => {
        expect(venueData.menu.text()).to.include('Pork Chops')
      })
    )
  })
})
