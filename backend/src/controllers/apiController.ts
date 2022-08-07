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

// FID,ID,Nimi,Namn,Name,Osoite,Adress,Kaupunki,Stad,Operaattor,Kapasiteet,x,y
export const getMaxStationIdAndFid: RequestHandler = (_req, res, _next) => {
  const db = connectToDatabase()

  const sql = `SELECT MAX(id) AS maxId, MAX(fid) AS maxFid FROM station_list`

  db.all(sql, (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message })
      return
    }
    res.json(rows)
  })

  db.close()
}

export const addStation: RequestHandler = (req, res, _next) => {
  const db = connectToDatabase()

  // FID,ID,Nimi,Namn,Name,Osoite,Adress,Kaupunki,Stad,Operaattor,Kapasiteet,x,y
  const { fid, id, nimi, namn, name, osoite, adress, kaupunki, stad, operaattor, Kapasiteet, x, y } = req.body

  const sql = `INSERT INTO station_list (fid, id, nimi, namn, name, osoite, adress, kaupunki, stad, operaattor, Kapasiteet, x, y) 
  VALUES('${fid}', '${id}', ${nimi}, '${namn}', ${name}, '${osoite}', ${osoite}, ${kaupunki}, ${stad}, ${operaattor}, ${Kapasiteet}, ${x}, ${y})
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

// Get calculated values for single station view
const getTop5ReturnStations = async (stationId: string) => {
  const returnValue = await queryDb(
    `SELECT return_station_name, return_station_id, count(*) AS return_count 
FROM journey_data 
WHERE departure_station_id = '${stationId}'
GROUP BY return_station_name, return_station_id
ORDER BY return_count DESC
LIMIT 5`
  )
  return returnValue as any[]
}

// Get calculated values for single station view
const getTop5DepartureStations = async (stationId: string) => {
  const returnValue = await queryDb(
    `SELECT departure_station_name, departure_station_id, count(*) AS departure_count 
FROM journey_data 
WHERE return_station_id = '${stationId}'
GROUP BY departure_station_name, departure_station_id
ORDER BY departure_count DESC
LIMIT 5`
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

  const top5ReturnStations = await getTop5ReturnStations(stationId)

  const top5DepartureStations = await getTop5DepartureStations(stationId)

  // all station information and merge all calculated results, send to client
  const sql = `SELECT * FROM station_list WHERE ID=${stationId}`

  db.all(sql, (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message })
      return
    }

    const mergeResults = [
      ...rows,
      ...departureCount,
      ...returnCount,
      ...departureAvgDistance,
      ...returnAvgDistance,
      [...top5ReturnStations],
      [...top5DepartureStations],
    ]
    res.json(mergeResults)
  })

  db.close()
}
