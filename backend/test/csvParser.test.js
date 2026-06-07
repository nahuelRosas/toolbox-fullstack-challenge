const { expect } = require('chai')
const { parseCsv } = require('../src/utils/csvParser')

describe('csvParser utility', () => {
  it('should parse a valid CSV correctly', () => {
    const csvContent = 'file,text,number,hex\ntest.csv,RgTya,64075909,70ad29aacf0b690b0467fe2b2767f765\n'
    const result = parseCsv(csvContent, 'test.csv')

    expect(result).to.not.equal(null)
    expect(result.file).to.equal('test.csv')
    expect(result.lines).to.have.lengthOf(1)
    expect(result.lines[0]).to.deep.equal({
      text: 'RgTya',
      number: 64075909,
      hex: '70ad29aacf0b690b0467fe2b2767f765'
    })
  })

  it('should return null for an empty file or just header', () => {
    expect(parseCsv('', 'test.csv')).to.equal(null)
    expect(parseCsv('file,text,number,hex\n', 'test.csv')).to.equal(null)
  })

  it('should discard lines with missing columns', () => {
    const csvContent = 'file,text,number,hex\ntest.csv,RgTya,64075909\ntest.csv,Valid,123,70ad29aacf0b690b0467fe2b2767f765'
    const result = parseCsv(csvContent, 'test.csv')

    expect(result.lines).to.have.lengthOf(1)
    expect(result.lines[0].text).to.equal('Valid')
  })

  it('should discard lines with non-numeric number fields', () => {
    const csvContent = 'file,text,number,hex\ntest.csv,RgTya,NaN,70ad29aacf0b690b0467fe2b2767f765\ntest.csv,Valid,123,70ad29aacf0b690b0467fe2b2767f765'
    const result = parseCsv(csvContent, 'test.csv')

    expect(result.lines).to.have.lengthOf(1)
    expect(result.lines[0].text).to.equal('Valid')
  })

  it('should discard lines with invalid hex fields', () => {
    const csvContent = 'file,text,number,hex\ntest.csv,RgTya,123,shorthex\ntest.csv,Valid,123,70ad29aacf0b690b0467fe2b2767f765'
    const result = parseCsv(csvContent, 'test.csv')

    expect(result.lines).to.have.lengthOf(1)
    expect(result.lines[0].text).to.equal('Valid')
  })

  it('should return null if all lines are invalid', () => {
    const csvContent = 'file,text,number,hex\ntest.csv,RgTya,NaN,70ad29aacf0b690b0467fe2b2767f765\n'
    expect(parseCsv(csvContent, 'test.csv')).to.equal(null)
  })
})
