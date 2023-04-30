const express = require('express')
const cors = require('cors')
const { dbConecction } = require('./db/config')
const path = require('path')
require('dotenv').config()

// Config
const PORT = process.env.PORT || 3000
const app = express()

// Database
dbConecction()

// Body Parser
app.use(express.json())

// Cors
app.use(cors())

// Routes
app.use('/api/auth', require('./routes/auth.route'))

// Public directory
app.use(express.static('public'))

// Drive routes
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'public/index.html'))
})

// Error 404

app.listen(PORT, () => {
  console.log(`backend is reay on port ${PORT} :)`)
  console.log('http://localhost:3000')
})

module.exports = app
