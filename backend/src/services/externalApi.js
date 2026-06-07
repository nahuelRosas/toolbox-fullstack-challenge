const axios = require('axios')

const API_BASE_URL = 'https://echo-serv.tbxnet.com/v1/secret'
const HEADERS = {
  authorization: 'Bearer aSuperSecretKey'
}

/**
 * Fetches the list of files from the external API.
 * @returns {Promise<string[]>} Array of filenames.
 */
const getFilesList = async () => {
  const response = await axios.get(`${API_BASE_URL}/files`, { headers: HEADERS })
  return response.data.files
}

/**
 * Fetches the content of a specific file from the external API.
 * @param {string} fileName
 * @returns {Promise<string>} Raw CSV content.
 */
const getFile = async (fileName) => {
  const response = await axios.get(`${API_BASE_URL}/file/${fileName}`, { headers: HEADERS })
  return response.data
}

module.exports = {
  getFilesList,
  getFile
}
