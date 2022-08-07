import React, { useEffect, useState } from 'react'
import axios from 'axios'

import { Grid, TextField, FormControl, Select, MenuItem, Button, Container, Box, InputLabel } from '@mui/material'
import { SelectChangeEvent } from '@mui/material/Select'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'

import { StationData } from '../typesInterfaces'

const api = !process.env.NODE_ENV || process.env.NODE_ENV === 'development' ? 'http://localhost:3001/api' : '/api'

// Couldnt find any services/api or so that would convert address to coordinates without subscribing and/or paying something, thats why coordinates are those BS values :)
const defaultValues: StationData = {
  fid: 0,
  id: 0,
  nimi: '',
  namn: '',
  name: '',
  osoite: '',
  kaupunki: '',
  stad: '',
  Operaattor: 'CityBike Finland',
  kapasiteet: 10,
  x: 24.933799, // BULSHIT VALUE, in the middle of Töölönlahti
  y: 60.180967, // BULSHIT VALUE, in the middle of Töölönlahti
}

const AddStation = () => {
  const [formValues, setFormValues] = useState(defaultValues)

  // Generate if an fid: Get max id and fid from database and add 1
  useEffect(() => {
    axios
      .get(`${api}/maxstationids`)
      .then((res) => {
        setFormValues({
          ...formValues,
          id: parseInt(res.data[0].maxId + 1),
          fid: parseInt(res.data[0].maxFid + 1),
        })
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
  }, [])

  // If finnish name is changed, change also english
  useEffect(() => {
    setFormValues({
      ...formValues,
      name: formValues.nimi,
    })
  }, [formValues.nimi])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target

    if (type === 'text') {
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

  const handleCityChange = (event: SelectChangeEvent) => {
    const sweCity = event.target.value === 'Espoo' ? 'Esbo' : 'Helsingfors'

    setFormValues({
      ...formValues,
      kaupunki: event.target.value,
      stad: sweCity,
    })
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (formValues.nimi === '' || formValues.namn === '') {
      alert('Both Finnish and Swedish names are needed, please check')
      return
    }

    if (formValues.osoite === '') {
      alert('Address is empty, please check')
      return
    }

    if (formValues.kaupunki === '') {
      alert('City not selected, please check')
      return
    }

    console.log(formValues)

    axios
      .post(`${api}/station`, formValues)
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
            <Grid item xs={3}>
              <TextField
                sx={{ width: '100%' }}
                id="id"
                name="id"
                label="Id (generated)"
                type="string"
                value={formValues.id}
              />
            </Grid>

            <Grid item xs={3}>
              <TextField
                sx={{ width: '100%' }}
                id="fid"
                name="fid"
                label="Fid (generated)"
                type="string"
                value={formValues.fid}
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                sx={{ width: '100%' }}
                id="kapasiteet"
                name="kapasiteet"
                label="Capacity"
                type="number"
                value={formValues.kapasiteet}
                onChange={handleInputChange}
                InputProps={{ inputProps: { min: 0 } }}
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                sx={{ width: '100%' }}
                id="nimi"
                name="nimi"
                label="Name (FIN & ENG)"
                type="string"
                value={formValues.nimi}
                onChange={handleInputChange}
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                sx={{ width: '100%' }}
                id="namn"
                name="namn"
                label="Name (SWE)"
                type="string"
                value={formValues.namn}
                onChange={handleInputChange}
              />
            </Grid>

            <Grid item xs={9}>
              <TextField
                sx={{ width: '100%' }}
                id="osoite"
                name="osoite"
                label="Address"
                type="string"
                value={formValues.osoite}
                onChange={handleInputChange}
              />
            </Grid>

            <Grid item xs={3}>
              <FormControl fullWidth>
                <InputLabel id="cityLabel">City</InputLabel>
                <Select
                  labelId="cityLabel"
                  id="city"
                  value={formValues.kaupunki}
                  label="City"
                  onChange={handleCityChange}
                  name="city"
                >
                  {['Espoo', 'Helsinki'].map((city) => {
                    return (
                      <MenuItem key={city} value={city}>
                        {city}
                      </MenuItem>
                    )
                  })}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <Box textAlign="center">
                <Button sx={{ width: '100%' }} size="large" variant="contained" color="primary" type="submit">
                  Add Station
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Container>
    </LocalizationProvider>
  )
}

export default AddStation
