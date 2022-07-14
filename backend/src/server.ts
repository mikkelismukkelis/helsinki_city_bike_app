import express from 'express'

import journeyRoutes from './routes/journeyRoutes'

const PORT = process.env.PORT || 3001

const app = express()

app.use(express.json())

// For serving build react frontend when publishing to some service
app.use(express.static('./client'))

app.use('/api', journeyRoutes)

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`))
