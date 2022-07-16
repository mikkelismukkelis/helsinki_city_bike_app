import fs from 'fs'
import { Database } from 'sqlite3'

const databaseName = 'db.sqlite'

export const connectToDatabase = () => {
  if (fs.existsSync(databaseName)) {
    return new Database(databaseName)
  } else {
    const db = new Database(databaseName, (error) => {
      if (error) {
        return console.error(error.message)
      }
      createTable(db)
      console.log('Connected to the database successfully')
    })
    return db
  }
}

function createTable(db: Database) {
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
