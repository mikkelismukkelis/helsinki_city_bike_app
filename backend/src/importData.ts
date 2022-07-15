import fs from 'fs'
import path from 'path'
import { parse } from 'csv-parse'

//import directory
const importDirectory = path.join(__dirname, 'data_import')

// Journey data validation rules here, return true or false
const validateJourneyData = (data: string[]) => {
  // Journey distance (m) in position 6, parse to int
  const distance = parseInt(data[6])
  // Journey duration (s) in position 7, parse to int
  const duration = parseInt(data[7])

  // if distance less than 10m, skip
  if (distance < 10) return false

  // if duration less than 10s, skip
  if (duration < 10) return false

  //   If all validations passed, return true
  return true
}

//function that reads import directory,  loops through files and imports data to db
export const importJourneyData = fs.readdir(importDirectory, (err, files) => {
  // error in directory reading
  if (err) return console.log('Error in scanning import directory: ' + err)

  // If import directory has only "imported" folder (files size = 1) return
  if (files.length === 1) return console.log('data_import directory did not contain any files...')

  //   Looping through all files, validate data and insert to database
  for (const file of files) {
    // lets skip imported foder
    if (file === 'imported') return

    const importFile = path.join(importDirectory, file)

    fs.createReadStream(importFile)
      .pipe(parse({ delimiter: ',', from_line: 2 }))
      .on('data', (row) => {
        // Validate data
        const isValidData = validateJourneyData(row)

        // If valid data, insert to database
        if (isValidData) {
          console.log('data', row)
        }
      })
      .on('end', () => {
        console.log(`${importFile} imported`)
      })
      .on('error', (error) => {
        console.log(`Error in reading file: ${error.message}`)
      })
  }
})

// export const importJourneyData = fs.readdirSync(importDirectory).forEach((file) => {
//   // lets skip imported foder
//   if (file === 'imported') return

//   console.log(file)

//   const importFile = path.join(importDirectory, file)

//   fs.readFileSync

//   fs.createReadStream(importFile)
//     .pipe(parse({ delimiter: ',', from_line: 2 }))
//     .on('data', (row) => {
//       console.log(row)
//       // TODO: data import
//     })
//     .on('end', () => {
//       console.log(`${importFile} imported`)
//     })
//     .on('error', (error) => {
//       console.log(`Error in reading file: ${error.message}`)
//     })
// })
