const express = require('express')
const cors = require('cors')
require('dotenv').config()

const aiRoutes = require('./routes/ai.routes')

const app = express()
app.use(cors())
app.use(express.json())

app.use('/api/ai', aiRoutes)

app.get('/health', (req, res) => res.json({ ok: true }))

const port = process.env.PORT || 5010
app.listen(port, () => console.log(`ai-services running on ${port}`))
