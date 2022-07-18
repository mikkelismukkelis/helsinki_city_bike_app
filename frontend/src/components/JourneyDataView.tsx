import React, { useState, useEffect } from 'react'
import axios from 'axios'

import Box from '@mui/material/Box'
import Container from '@mui/material/Container'

import DepartureStationButtons from './DepartureStationButtons'
import DataLoadingProgress from './DataLoadingProgress'
import JourneyDataTable from './JourneyDataTable'

interface Data {
  rowid: number
  departure_station_name: string
  return_station_name: string
  covered_distance_m: number
  duration_s: number
}

const JourneyDataView = () => {
  const initData: Data = {
    rowid: 0,
    departure_station_name: 'Data being fetched',
    return_station_name: '...',
    covered_distance_m: 0,
    duration_s: 0,
  }

  const [rows, setRows] = useState<Data[]>([initData])
  const [activeButton, setActiveButton] = useState('button1')
  const [dataLoading, setDataLoading] = useState(false)

  // Function to get journey data. Used by useefect and alphabetical range buttons
  const getJourneyData = (beginLetter: string, endLetter: string, target?: HTMLButtonElement) => {
    setDataLoading(true)

    axios
      .get<Data[]>('http://localhost:3001/api/journeys', {
        params: {
          beginLetter,
          endLetter,
        },
      })
      .then((res) => {
        target && setActiveButton(target.id)
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
    getJourneyData('A', 'H')
  }, [])

  // Get new data from api and set to table
  const clickAlphabetButton = (e: React.MouseEvent<unknown>, beginLetter: string, endLetter: string) => {
    const target = e.target as HTMLButtonElement

    getJourneyData(beginLetter, endLetter, target)
  }

  return (
    <Container>
      <Box sx={{ width: '100%' }}>
        <DepartureStationButtons
          clickAlphabetButton={clickAlphabetButton}
          activeButton={activeButton}
          dataLoading={dataLoading}
        />

        {dataLoading ? <DataLoadingProgress /> : <JourneyDataTable rows={rows} />}
      </Box>
    </Container>
  )
}

export default JourneyDataView
