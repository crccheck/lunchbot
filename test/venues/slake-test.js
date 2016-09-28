import { expect } from 'chai'
import { readFileSync } from 'fs'
import sinon from 'sinon'
import sinonAsPromised from 'sinon-as-promised' // eslint-disable-line no-unused-vars
import path from 'path'
import request from 'request-promise'
import { data, scrape } from '../../src/venues/slake'

describe('slake', () => {
  describe('data', () => {
    it('has a name', () => {
      expect(data.name).to.be.ok
    })
    it('has a url', () => {
      expect(data.url).to.be.ok
    })
  })

  describe('scrape', () => {
    before(() => {
      const fixturePath = path.join(__dirname, '../fixtures/slake.html')
      const dummyHTML = readFileSync(fixturePath, { encoding: 'utf8' })
      sinon.stub(request, 'get').returns(dummyHTML)
    })
    after(() => {
      request.get.restore()
    })
    it('extracts the special of the day from the HTML', () =>
      scrape().then((venueData) => {
        expect(venueData.menu.text()).to.include('Quinoa')
      })
    )
  })
})
