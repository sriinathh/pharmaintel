const express = require('express')
const cors = require('cors')
const env = require('./config/env')
const connectDB = require('./config/db')
const logger = require('./utils/logger')

const authRoutes = require('./routes/auth.routes')
const profileRoutes = require('./routes/profile.routes')
const reportRoutes = require('./routes/report.routes')
const drugRoutes = require('./routes/drug.routes')
const adminRoutes = require('./routes/admin.routes')
const aiRoutes = require('./routes/ai.routes')
const medicalRoutes = require('./routes/medical.routes')
const dashboardRoutes = require('./routes/dashboard.routes')

const app = express()

app.use(cors())
app.use(express.json())
logger(app)

app.use('/api/auth', authRoutes)
app.use('/api/profile', profileRoutes)
app.use('/api/reports', reportRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/ai', aiRoutes)
app.use('/api/medical', medicalRoutes)
app.use('/api/dashboard', dashboardRoutes)
app.use('/api/drugs', drugRoutes)

app.get('/api/health', (req, res) => res.json({ ok: true }))

async function start() {
  try {
    await connectDB(env.MONGO_URI)
  } catch (err) {
    // If DB failed but we're in development mock mode, continue to start server
    if (process.env.DEV_MEDICAL_MOCK === '1') {
      console.warn('Warning: MongoDB connection failed, continuing in DEV_MEDICAL_MOCK mode')
    } else {
      throw err
    }
  }

  app.listen(env.PORT, () => console.log(`node-api running on ${env.PORT}`))
}

start().catch((e) => {
  // Print full stack if available
  console.error('Server failed to start:', e && (e.stack || e))
  if (process.env.DEV_MEDICAL_MOCK === '1') {
    console.warn('DEV_MEDICAL_MOCK=1 — continuing without exiting to aid debugging')
    return
  }
  process.exit(1)
})
