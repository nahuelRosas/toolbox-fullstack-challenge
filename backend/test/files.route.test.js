const request = require('supertest')
const { expect } = require('chai')
const sinon = require('sinon')
const app = require('../src/app')
const externalApi = require('../src/services/externalApi')

describe('Files Routes', () => {
  afterEach(() => {
    sinon.restore()
  })

  describe('GET /files/list', () => {
    it('should return a list of files', async () => {
      sinon.stub(externalApi, 'getFilesList').resolves(['test1.csv', 'test2.csv'])

      const res = await request(app).get('/files/list')
      expect(res.status).to.equal(200)
      expect(res.body).to.deep.equal({ files: ['test1.csv', 'test2.csv'] })
    })

    it('should return 500 if API fails', async () => {
      sinon.stub(externalApi, 'getFilesList').rejects(new Error('API Error'))

      const res = await request(app).get('/files/list')
      expect(res.status).to.equal(500)
    })
  })

  describe('GET /files/data', () => {
    it('should fetch and parse all files', async () => {
      sinon.stub(externalApi, 'getFilesList').resolves(['test1.csv'])
      sinon.stub(externalApi, 'getFile').resolves('file,text,number,hex\ntest1.csv,RgTya,64075909,70ad29aacf0b690b0467fe2b2767f765')

      const res = await request(app).get('/files/data')
      expect(res.status).to.equal(200)
      expect(res.body).to.be.an('array').with.lengthOf(1)
      expect(res.body[0].file).to.equal('test1.csv')
      expect(res.body[0].lines[0].text).to.equal('RgTya')
    })

    it('should filter by fileName query parameter', async () => {
      sinon.stub(externalApi, 'getFilesList').resolves(['test1.csv', 'test2.csv'])
      const getFileStub = sinon.stub(externalApi, 'getFile')
      getFileStub.withArgs('test1.csv').resolves('file,text,number,hex\ntest1.csv,RgTya,64075909,70ad29aacf0b690b0467fe2b2767f765')

      const res = await request(app).get('/files/data?fileName=test1.csv')
      expect(res.status).to.equal(200)
      expect(res.body).to.be.an('array').with.lengthOf(1)
      expect(res.body[0].file).to.equal('test1.csv')
    })

    it('should ignore files that fail to download', async () => {
      sinon.stub(externalApi, 'getFilesList').resolves(['test1.csv', 'test2.csv'])
      const getFileStub = sinon.stub(externalApi, 'getFile')
      getFileStub.withArgs('test1.csv').resolves('file,text,number,hex\ntest1.csv,RgTya,64075909,70ad29aacf0b690b0467fe2b2767f765')
      getFileStub.withArgs('test2.csv').rejects(new Error('Download Failed'))

      const res = await request(app).get('/files/data')
      expect(res.status).to.equal(200)
      expect(res.body).to.be.an('array').with.lengthOf(1)
      expect(res.body[0].file).to.equal('test1.csv')
    })
  })
})
