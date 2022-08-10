import fs from 'fs'
import { Database } from 'sqlite3'

const databaseName = 'db.sqlite'

// Check if database file exists, if yes, use old, if no: create new and create tables
export const connectToDatabase = () => {
  if (fs.existsSync(databaseName)) {
    return new Database(databaseName)
  } else {
    const db = new Database(databaseName, (error) => {
      if (error) {
        return console.error(error.message)
      }
      createJourneyDataTable(db)
      createStationListTable(db)
      console.log('Connected to the database successfully')
    })
    return db
  }
}

// Journey data table
function createJourneyDataTable(db: Database) {
  db.exec(`
  CREATE TABLE journey_data
  (
    departure DATETIME,
    return  DATETIME,
    departure_station_id  INT,
    departure_station_name  VARCHAR(255),
    return_station_id INT,
    return_station_name VARCHAR(255),
    covered_distance_m  INT,
    duration_s INT
  )
`)
}

// station list table
function createStationListTable(db: Database) {
  db.exec(`
  CREATE TABLE station_list
  (
    fid INT,
    id  int,
    nimi  VARCHAR(255),
    namn  VARCHAR(255),
    name  VARCHAR(255),
    osoite VARCHAR(255),
    adress VARCHAR(255),
    kaupunki VARCHAR(255),
    stad VARCHAR(255),
    operaattor VARCHAR(255),
    kapasiteet  INT,
    x REAL,
    y REAL
  )
`)
}
