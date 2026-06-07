const { expect } = require('chai')
const sinon = require('sinon')
const axios = require('axios')
const { getFilesList, getFile } = require('../src/services/externalApi')

describe('externalApi service', () => {
  afterEach(() => {
    sinon.restore()
  })

  it('getFilesList should return array of files', async () => {
    const mockResponse = { data: { files: ['test1.csv', 'test2.csv'] } }
    sinon.stub(axios, 'get').resolves(mockResponse)

    const files = await getFilesList()
    expect(files).to.deep.equal(['test1.csv', 'test2.csv'])
  })

  it('getFile should return raw CSV content', async () => {
    const mockCsv = 'file,text,number,hex\ntest1.csv,RgTya,64075909,70ad29aacf0b690b0467fe2b2767f765'
    sinon.stub(axios, 'get').resolves({ data: mockCsv })

    const content = await getFile('test1.csv')
    expect(content).to.equal(mockCsv)
  })

  it('should throw an error if API request fails', async () => {
    sinon.stub(axios, 'get').rejects(new Error('Network Error'))

    try {
      await getFilesList()
      expect.fail('Should have thrown an error')
    } catch (error) {
      expect(error.message).to.equal('Network Error')
    }
  })
})
