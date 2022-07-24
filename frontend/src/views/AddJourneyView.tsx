import React, { useState } from 'react'
import axios from 'axios'

import { Grid, TextField, FormControl, Select, MenuItem, Button, Container, Box, InputLabel } from '@mui/material'
import { SelectChangeEvent } from '@mui/material/Select'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker'

import { StationData } from '../typesInterfaces'

const api = !process.env.NODE_ENV || process.env.NODE_ENV === 'development' ? 'http://localhost:3001/api' : '/api'

interface JoyrneyDataToDb {
  departure: string
  return: string
  departure_station_id: number
  departure_station_name: string
  return_station_id: number
  return_station_name: string
  covered_distance_m: number
  duration_s: number
}

const padTo2Digits = (num: number) => num.toString().padStart(2, '0')

const formatDate = (date: Date) => {
  return (
    [date.getFullYear(), padTo2Digits(date.getMonth() + 1), padTo2Digits(date.getDate())].join('-') +
    'T' +
    [padTo2Digits(date.getHours()), padTo2Digits(date.getMinutes()), padTo2Digits(date.getSeconds())].join(':')
  )
}

const getCurrentTime = () => {
  const now = new Date()
  const timeInIsoString = now.toISOString()
  const timeInCorrectFormat = formatDate(new Date(timeInIsoString))
  return timeInCorrectFormat
}

const defaultValues: JoyrneyDataToDb = {
  departure: getCurrentTime(),
  return: getCurrentTime(),
  departure_station_id: 666,
  departure_station_name: '',
  return_station_id: 667,
  return_station_name: '',
  covered_distance_m: 10,
  duration_s: 0,
}

interface Props {
  stationData: StationData[]
}

const AddJourney = ({ stationData }: Props) => {
  const [formValues, setFormValues] = useState(defaultValues)
  const [departureStation, setDepartureStation] = useState<string>('')
  const [returnStation, setReturnStation] = useState<string>('')
  const [departureTime, setDepartureTime] = useState<Date | null>(new Date())
  const [returnTime, setReturnTime] = useState<Date | null>(new Date())

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target

    if (type === 'string') {
      setFormValues({
        ...formValues,
        [name]: value,
      })
    } else {
      setFormValues({
        ...formValues,
        [name]: parseInt(value),
      })
    }
  }

  const changeFormValue = (name: string, value: string | number) => {
    setFormValues((prevState) => {
      return {
        ...prevState,
        [name]: value,
      }
    })
  }

  const handleSelectChange = (event: SelectChangeEvent) => {
    const selectedStation = stationData.filter((station) => station.nimi === event.target.value)

    if (event.target.name === 'departureStation') {
      setDepartureStation(event.target.value)
      changeFormValue('departure_station_name', event.target.value)
      changeFormValue('departure_station_id', selectedStation[0].id)
    } else {
      setReturnStation(event.target.value)
      changeFormValue('return_station_name', event.target.value)
      changeFormValue('return_station_id', selectedStation[0].id)
    }
  }

  // Kötöviritys :)
  let purkkaTime: Date

  const handleTimeChangeDeparture = (newValue: Date | null) => {
    if (newValue) {
      purkkaTime = newValue
      setDepartureTime(newValue)
    }
  }

  const handleTimeChangeDepartureEnd = () => {
    const timeInIsoString = new Date(purkkaTime!.toISOString())
    const timeInCorrectFormat = formatDate(new Date(timeInIsoString))
    changeFormValue('departure', timeInCorrectFormat)
    countDuration()
  }

  const handleTimeChangeReturn = (newValue: Date | null) => {
    if (newValue) {
      purkkaTime = newValue
      setReturnTime(newValue)
    }
  }

  const handleTimeChangeReturnEnd = () => {
    const timeInIsoString = new Date(purkkaTime!.toISOString())
    const timeInCorrectFormat = formatDate(new Date(timeInIsoString))
    changeFormValue('return', timeInCorrectFormat)
    countDuration()
  }

  const countDuration = () => {
    const differenceInSeconds = (new Date(returnTime!).getTime() - new Date(departureTime!).getTime()) / 1000

    const test = Math.trunc(differenceInSeconds)
    changeFormValue('duration_s', test)
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (formValues.departure_station_name === '' || formValues.return_station_name === '') {
      alert('Both departure and return stations must be selected. Please check stations')
      return
    }

    if (formValues.duration_s < 0) {
      alert('Return time must be after departure. Please, check times')
      return
    }

    // console.log(formValues)

    axios
      .post(`${api}/journey`, formValues)
      .then((res) => {
        if (res.data.success) {
          alert(`Data added succesfully to database. Rowid: ${res.data.rowid}`)
        }
        window.location.reload()
      })
      .catch((err) => {
        console.log('Error in axios: ', err)
        // TODO: if database is busy for example in data import and other problems. what we do? for now just alert.
        if (err.message === 'Network Error') {
          alert('Network Error. No connection to backend. Is backend running?')
        } else if (err.response.data.error === 'SQLITE_BUSY: database is locked') {
          alert(
            'Database busy. Most propably data import is still ongoing. Please wait for a while and try refreshing page.'
          )
        }
      })
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Container>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel id="departureStationLabel">Departure station</InputLabel>
                <Select
                  labelId="departureStationLabel"
                  id="departureStation"
                  value={departureStation}
                  label="Departure station"
                  onChange={handleSelectChange}
                  name="departureStation"
                >
                  {stationData.map((station) => {
                    return (
                      <MenuItem key={station.id} value={station.nimi}>
                        {station.nimi}
                      </MenuItem>
                    )
                  })}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel id="returnStationLabel">Return station</InputLabel>
                <Select
                  labelId="returnStationLabel"
                  id="returnStation"
                  value={returnStation}
                  label="Return station"
                  onChange={handleSelectChange}
                  name="returnStation"
                >
                  {stationData.map((station) => {
                    return (
                      <MenuItem key={station.id} value={station.nimi}>
                        {station.nimi}
                      </MenuItem>
                    )
                  })}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={6}>
              <DateTimePicker
                renderInput={(props) => <TextField sx={{ width: '100%' }} {...props} disabled />}
                label="Departure time"
                value={departureTime}
                onChange={handleTimeChangeDeparture}
                ampm={false}
                ampmInClock={false}
                inputFormat="DD.MM.YYYY HH:mm:ss"
                onClose={handleTimeChangeDepartureEnd}
                views={['day', 'hours', 'minutes', 'seconds']}
              />
            </Grid>

            <Grid item xs={6}>
              <DateTimePicker
                renderInput={(props) => <TextField sx={{ width: '100%' }} {...props} disabled />}
                label="Return time"
                value={returnTime}
                onChange={handleTimeChangeReturn}
                ampm={false}
                ampmInClock={false}
                inputFormat="DD.MM.YYYY HH:mm:ss"
                onClose={handleTimeChangeReturnEnd}
                views={['day', 'hours', 'minutes', 'seconds']}
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                sx={{ width: '100%' }}
                id="covered_distance_m"
                name="covered_distance_m"
                label="Covered distance in meters"
                type="number"
                value={formValues.covered_distance_m}
                onChange={handleInputChange}
                InputProps={{ inputProps: { min: 0 } }}
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                sx={{ width: '100%' }}
                id="duration_s"
                name="duration_s"
                label="Duration in seconds (read only, calculated from timestamps)"
                type="number"
                value={formValues.duration_s}
                onChange={handleInputChange}
                inputProps={{ readOnly: true }}
              />
            </Grid>

            <Grid item xs={12}>
              <Box textAlign="center">
                <Button sx={{ width: '100%' }} size="large" variant="contained" color="primary" type="submit">
                  Add Journey
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Container>
    </LocalizationProvider>
  )
}

export default AddJourney
