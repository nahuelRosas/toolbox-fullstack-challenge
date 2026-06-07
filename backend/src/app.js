const express = require('express')
const cors = require('cors')
const filesRoutes = require('./routes/files')

const app = express()

app.use(cors())
app.use(express.json())

app.use('/files', filesRoutes)

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ error: 'Internal Server Error' })
})

module.exports = app
