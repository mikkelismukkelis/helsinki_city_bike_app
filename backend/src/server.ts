import express from 'express'
import cors from 'cors'

import apiRoutes from './routes/apiRoutes'

import { importJourneyData } from './importData'

const PORT = process.env.PORT || 3001

const app = express()

app.use(express.json())

app.use(
  cors({
    origin: 'http://localhost:3000',
  })
)

// For serving build react frontend when publishing to some service
app.use(express.static('./client'))

app.use('/api', apiRoutes)

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`))

try {
  importJourneyData
} catch (error) {
  console.log(error)
}
