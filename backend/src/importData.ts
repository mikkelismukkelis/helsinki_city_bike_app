import fs from 'fs'
import path from 'path'
import { parse } from 'csv-parse'

import { connectToDatabase } from './database/database'

//import directory
const importDirectory = path.join(__dirname, 'data_import')
// directory where successfully imported files are moved
const alreadyImportDirectory = path.join(__dirname, 'data_import', 'imported')

// Journey data validation rules here, return true or false
const validateJourneyData = (data: string[]) => {
  const distance = data[6] === '' ? 0 : parseInt(data[6])

  const duration = parseInt(data[7])

  if (distance < 10) return false

  if (duration < 10) return false

  return true
}

// Function that reads JOURNEY DATA csv and inserts into database. Wrapped inside timeout
const readJourneysCsvAndInsertDb = (importFile: string, file: string, timeout: number) => {
  // This timeout is for making space between operations to keep memory usage under control
  setTimeout(() => {
    // Array to hold validated data
    let journeyRecords: any[] = []

    const db = connectToDatabase()

    fs.createReadStream(importFile)
      .pipe(parse({ delimiter: ',', from_line: 2 }))
      .on('data', (row: string[]) => {
        const isValidData = validateJourneyData(row)

        if (isValidData) {
          journeyRecords.push(row)
        }
      })
      .on('end', () => {
        db.serialize(() => {
          // Lets do database insertions in transaction for far better performance
          db.exec('BEGIN')

          for (const row of journeyRecords) {
            db.run(
              `INSERT OR REPLACE INTO journey_data VALUES (?, ?, ? , ?, ?, ?, ?, ?)`,
              [row[0], row[1], row[2], row[3], row[4], row[5], row[6], row[7]],
              function (error) {
                if (error) {
                  return console.log(error.message)
                }
              }
            )
          }

          db.exec('COMMIT')
        })

        // move (with rename) imported file to imported -folder
        let newPath = path.join(alreadyImportDirectory, file)
        fs.rename(importFile, newPath, (err) => {
          if (err) console.log('Error in moving file to imported -folder: ', err)
        })

        console.log(`Journey records added to database from file: ${file}, rows: ${journeyRecords.length}`)
      })
      .on('error', (error) => {
        console.log(`Error in reading file: ${error.message}`)
      })
  }, timeout)
}

// function that fixes some missing station data
const fixStationData = (data: string[]) => {
  const kaupunki = data[7]

  if (kaupunki === ' ') {
    data[7] = 'Helsinki'
    data[8] = 'Helsingfors'
    data[9] = 'CityBike Finland'
  }

  return data
}

// Function that reads STATION LIST csv and inserts into database.
const readStationListCsvAndInsertDb = (importFile: string, file: string) => {
  let stations: any[] = []
  const db = connectToDatabase()

  // create read stream and read it with parser
  fs.createReadStream(importFile)
    .pipe(parse({ delimiter: ',', from_line: 2 }))
    .on('data', (row: string[]) => {
      // part of data is missing city and operator information. lets add those.
      const fixedStation = fixStationData(row)
      stations.push(fixedStation)
    })
    .on('end', () => {
      db.serialize(() => {
        // Lets do database insertions in transaction for far better performance
        db.exec('BEGIN')

        // CSV HEADERS: FID,ID,Nimi,Namn,Name,Osoite,Adress,Kaupunki,Stad,Operaattor,Kapasiteet,x,y
        for (const row of stations) {
          db.run(
            `INSERT OR REPLACE INTO station_list VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [row[0], row[1], row[2], row[3], row[4], row[5], row[6], row[7], row[8], row[9], row[10], row[11], row[12]],
            function (error) {
              if (error) {
                return console.log(error.message)
              }
              // console.log(`Inserted a row with the id: ${this.lastID}`)
            }
          )
        }

        db.exec('COMMIT')
      })

      // move (with rename) imported file to imported -folder
      let newPath = path.join(alreadyImportDirectory, file)
      fs.rename(importFile, newPath, (err) => {
        if (err) console.log('Error in moving file to imported -folder: ', err)
      })

      console.log(`Station list added to database from file: ${file}, rows: ${stations.length}`)
    })
    .on('error', (error) => {
      console.log(`Error in reading file: ${error.message}`)
    })
}

// main function that reads import directory,  loops through files and calls function to imports data to db
export const importJourneyData = fs.readdir(importDirectory, (err, files) => {
  if (err) return console.log('Error in scanning import directory: ' + err)

  // If import directory has only readme.txt and "imported" folder (files size = 1) return
  if (files.length === 2) return console.log('data_import directory did not contain any csv files to import...')

  //   Timeout is "purkkaviritys" for memory management: we need to give enough time for reading data and inserting to db
  console.log('Start importing data to database, please wait until all files have been processessed and imported')
  let timeout = 0
  for (const file of files) {
    if (file === 'imported' || file === 'readme.txt') return

    const importFile = path.join(importDirectory, file)

    // If filename includes "asemat" word, then presumably station list, otherwise joyrney data
    if (file.toLowerCase().includes('asemat')) {
      readStationListCsvAndInsertDb(importFile, file)
    } else {
      readJourneysCsvAndInsertDb(importFile, file, timeout)
    }

    timeout += 40000
  }
})
