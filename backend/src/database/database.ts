import fs from 'fs'
// const sqlite3 = require("sqlite3").verbose();
import { Database } from 'sqlite3'
// const filepath = "./population.db";
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

// module.exports = connectToDatabase()

// import { Database } from 'sqlite3'
// import fs from 'fs'

// // Open a SQLite database, stored in the file db.sqlite
// const db = new Database('db.sqlite')

// // Fetch a random integer between -99 and +99
// export const getRandom = () => {
//   db.get('SELECT RANDOM() % 100 as result', (_, res) => console.log(res))
// }

// // Read and execute the SQL query in ./sql/articles.sql
// db.exec(fs.readFileSync(__dirname + '/create_journeys_table.sql').toString())

// // Insert the three example articles
// db.exec(fs.readFileSync(__dirname + '/insert_test.sql').toString())

// db.all('SELECT title FROM journeys ORDER BY LENGTH(description) DESC LIMIT 2', (_, res) => console.log(res))
