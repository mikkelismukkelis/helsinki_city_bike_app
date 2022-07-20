import { RequestHandler } from 'express'

import { connectToDatabase } from '../database/database'

// GET ALL JOURNEYS
export const getJourneys: RequestHandler = (req, res, _next) => {
  const db = connectToDatabase()

  // these are begin and end letters sent with request, used for sql query
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

// GET ALL STATIONS
// FID,ID,Nimi,Namn,Name,Osoite,Adress,Kaupunki,Stad,Operaattor,Kapasiteet,x,y
export const getStations: RequestHandler = (_req, res, _next) => {
  const db = connectToDatabase()

  const sql = `SELECT * FROM station_list ORDER BY nimi`

  db.all(sql, (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message })
      return
    }
    res.json(rows)
  })

  db.close()
}

// GET ONE STATION BY ID
// FID,ID,Nimi,Namn,Name,Osoite,Adress,Kaupunki,Stad,Operaattor,Kapasiteet,x,y
export const getStationById: RequestHandler = (req, res, _next) => {
  const stationId = req.params.id

  const db = connectToDatabase()

  const sql = `SELECT * FROM station_list WHERE ID=${stationId}`

  db.all(sql, (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message })
      return
    }
    res.json(rows)
  })

  db.close()
}
