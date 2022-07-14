import { Database } from 'sqlite3'
import fs from 'fs'

// Open a SQLite database, stored in the file db.sqlite
const db = new Database('db.sqlite')

// Fetch a random integer between -99 and +99
export const getRandom = () => {
  db.get('SELECT RANDOM() % 100 as result', (_, res) => console.log(res))
}

// Read and execute the SQL query in ./sql/articles.sql
db.exec(fs.readFileSync(__dirname + '/create_journeys_table.sql').toString())

// Insert the three example articles
db.exec(fs.readFileSync(__dirname + '/insert_test.sql').toString())

db.all('SELECT title FROM journeys ORDER BY LENGTH(description) DESC LIMIT 2', (_, res) => console.log(res))
