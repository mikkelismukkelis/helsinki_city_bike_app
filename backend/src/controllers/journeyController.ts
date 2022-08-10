import { RequestHandler } from 'express'

import { connectToDatabase } from '../database/database'

export const getJourneys: RequestHandler = (req, res, _next) => {
  const db = connectToDatabase()

  const beginLetter = req.query.beginLetter
  const endLetter = req.query.endLetter

  const sql = `SELECT rowid, departure_station_name, return_station_name, covered_distance_m, duration_s FROM journey_data WHERE SUBSTR(departure_station_name, 1, 1 )  BETWEEN '${beginLetter}' AND '${endLetter}' ORDER BY departure_station_name`

  db.all(sql, (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message })
      return
    }
    res.json(rows)
  })

  db.close()
}

export const addJourney: RequestHandler = (req, res, _next) => {
  const db = connectToDatabase()

  const {
    departure_date,
    return_date,
    departure_station_id,
    departure_station_name,
    return_station_id,
    return_station_name,
    covered_distance_m,
    duration_s,
  } = req.body

  const sql = `INSERT INTO journey_data (departure, return, departure_station_id, departure_station_name, return_station_id, return_station_name, covered_distance_m, duration_s) 
  VALUES('${departure_date}', '${return_date}', ${departure_station_id}, '${departure_station_name}', ${return_station_id}, '${return_station_name}', ${covered_distance_m}, ${duration_s})
  RETURNING rowid`

  db.all(sql, (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message })
      return
    }
    res.json({ success: `Data added succesfully`, rowid: rows[0].rowid })
  })

  db.close()
}
