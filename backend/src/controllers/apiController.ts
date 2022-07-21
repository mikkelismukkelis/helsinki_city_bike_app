import { RequestHandler } from 'express'

import { connectToDatabase } from '../database/database'

// We can quey db with promise way through this
const queryDb = (command: string) => {
  const db = connectToDatabase()

  return new Promise((resolve, reject) => {
    db.all(command, (error: Error, result: any[]) => {
      if (error) {
        reject(error)
      } else {
        resolve(result)
      }
    })
  })
}

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

// Get calculated values for single station view
const getDepartureCount = async (stationId: string) => {
  const returnValue = await queryDb(
    `SELECT count(*) as departure_count FROM journey_data WHERE departure_station_id = '${stationId}'`
  )
  return returnValue as any[]
}

// Get calculated values for single station view
const getReturnCount = async (stationId: string) => {
  const returnValue = await queryDb(
    `SELECT count(*) as return_count FROM journey_data WHERE return_station_id = '${stationId}'`
  )
  return returnValue as any[]
}

// Get calculated values for single station view
const getDepartureAvgDistance = async (stationId: string) => {
  const returnValue = await queryDb(
    `SELECT avg(covered_distance_m) as average_distance_departure FROM journey_data WHERE departure_station_id = '${stationId}'`
  )
  return returnValue as any[]
}

// Get calculated values for single station view
const getReturnAvgDistance = async (stationId: string) => {
  const returnValue = await queryDb(
    `SELECT avg(covered_distance_m) as average_distance_return FROM journey_data WHERE return_station_id = '${stationId}'`
  )
  return returnValue as any[]
}

// GET ONE STATION BY ID
// FID,ID,Nimi,Namn,Name,Osoite,Adress,Kaupunki,Stad,Operaattor,Kapasiteet,x,y
export const getStationById: RequestHandler = async (req, res, _next) => {
  const stationId = req.params.id

  const db = connectToDatabase()

  const departureCount = await getDepartureCount(stationId)

  const returnCount = await getReturnCount(stationId)

  const departureAvgDistance = await getDepartureAvgDistance(stationId)

  const returnAvgDistance = await getReturnAvgDistance(stationId)

  // all station information and merge all calculated results, send to client
  const sql = `SELECT * FROM station_list WHERE ID=${stationId}`

  db.all(sql, (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message })
      return
    }

    const mergeResults = [...rows, ...departureCount, ...returnCount, ...departureAvgDistance, ...returnAvgDistance]
    res.json(mergeResults)
  })

  db.close()
}
