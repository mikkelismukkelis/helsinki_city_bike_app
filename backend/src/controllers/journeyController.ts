import { RequestHandler } from 'express'

import { connectToDatabase } from '../database/database'

// GET ALL JOURNEYS
export const getJourneys: RequestHandler = (_req, res, _next) => {
  const db = connectToDatabase()

  const sql =
    'SELECT departure_station_name, return_station_name, covered_distance_m, duration_s FROM journey_data LIMIT 10'

  db.all(sql, (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message })
      return
    }
    res.json(rows)
  })

  db.close()
}
