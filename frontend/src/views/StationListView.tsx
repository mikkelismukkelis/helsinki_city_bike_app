import React, { useState, useEffect } from 'react'
import axios from 'axios'

import { Box, Container } from '@mui/material'

import DataLoadingProgress from '../components/DataLoadingProgress'
import StationListTable from '../components/StationListTable'

// FID,ID,Nimi,Namn,Name,Osoite,Adress,Kaupunki,Stad,Operaattor,Kapasiteet,x,y
interface Data {
  fid: number
  id: number
  nimi: string
  namn: string
  name: string
  osoite: string
  kaupunki: string
  stad: string
  Operaattor: string
  kapasiteet: number
  x: number
  y: number
}

const StationListView = () => {
  const [rows, setRows] = useState<Data[]>([])
  const [dataLoading, setDataLoading] = useState(false)

  // Function to get journey data. Used by useefect and alphabetical range buttons
  const getStationData = () => {
    setDataLoading(true)

    axios
      .get<Data[]>('http://localhost:3001/api/stations')
      .then((res) => {
        setDataLoading(false)
        setRows(res.data)
      })
      .catch((err) => {
        console.log('Error in axios: ', err)
        setDataLoading(false)

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

  // Useeffect to get initial data
  useEffect(() => {
    getStationData()
  }, [])

  return (
    <Container>
      <Box sx={{ width: '100%' }}>{dataLoading ? <DataLoadingProgress /> : <StationListTable rows={rows} />}</Box>
    </Container>
  )
}

export default StationListView
