const express = require('express')
const router = express.Router()
const externalApi = require('../services/externalApi')
const { parseCsv } = require('../utils/csvParser')

/**
 * GET /files/data
 * Query param (optional): ?fileName=test1.csv
 * Retrieves and parses CSV files.
 */
router.get('/data', async (req, res, next) => {
  try {
    const { fileName } = req.query

    // 1. Get the list of all files
    let filesList = await externalApi.getFilesList()

    // 2. Filter if query param is provided
    if (fileName) {
      filesList = filesList.filter(f => f === fileName)
    }

    // 3. Fetch all files concurrently
    const fetchPromises = filesList.map(async (file) => {
      try {
        const csvContent = await externalApi.getFile(file)
        return parseCsv(csvContent, file)
      } catch (error) {
        // Log error but do not fail the whole request
        console.error(`Error fetching file ${file}:`, error.message)
        return null
      }
    })

    const results = await Promise.allSettled(fetchPromises)

    // 4. Filter out failed downloads and empty/invalid files
    const validData = results
      .filter(r => r.status === 'fulfilled' && r.value !== null)
      .map(r => r.value)

    res.status(200).json(validData)
  } catch (error) {
    next(error)
  }
})

/**
 * GET /files/list
 * Returns the raw list of files from the external API.
 */
router.get('/list', async (req, res, next) => {
  try {
    const filesList = await externalApi.getFilesList()
    res.status(200).json({ files: filesList })
  } catch (error) {
    next(error)
  }
})

module.exports = router
