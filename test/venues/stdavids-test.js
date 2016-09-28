import { expect } from 'chai'
import { readFileSync } from 'fs'
import sinon from 'sinon'
import path from 'path'
import sinonAsPromised from 'sinon-as-promised' // eslint-disable-line no-unused-vars
import request from 'request-promise'
import { data, scrape, openAt } from '../../src/venues/stdavids'

describe('stdavids', () => {
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
      const fixturePath = path.join(__dirname, '../fixtures/stdavids.html')
      const dummyHTML = readFileSync(fixturePath, { encoding: 'utf8' })
      sinon.stub(request, 'get').returns(dummyHTML)
    })
    after(() => {
      request.get.restore()
    })
    it('extracts the menu from the HTML', () =>
      scrape().then((venueData) => {
        expect(venueData.menu.text()).to.be.ok
      })
    )
  })

  describe('openAt', () => {
    it('reports Thursday before lunch', () => {
      const almostLunch = new Date('2016-08-11T11:00-05:00')
      expect(openAt(almostLunch)).to.be.true
    })
    it('reports Wednesday afternoon', () => {
      const thinkingOfLunch = new Date('2016-08-10T14:00-05:00')
      expect(openAt(thinkingOfLunch)).to.be.true
    })
    it('does not report before Wednesday lunch', () => {
      const thinkingOfLunch = new Date('2016-08-10T11:00-05:00')
      expect(openAt(thinkingOfLunch)).to.be.false
    })
    it('does not report after Thursday lunch', () => {
      const thinkingOfLunch = new Date('2016-08-11T14:00-05:00')
      expect(openAt(thinkingOfLunch)).to.be.false
    })
  })
})
