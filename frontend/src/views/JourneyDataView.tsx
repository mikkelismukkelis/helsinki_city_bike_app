import React, { useState, SetStateAction, Dispatch } from 'react'
import axios from 'axios'

import { Box, Container } from '@mui/material'

import DepartureStationButtons from '../components/DepartureStationButtons'
import DataLoadingProgress from '../components/DataLoadingProgress'
import JourneyDataTable from '../components/JourneyDataTable'

interface Data {
  rowid: number
  departure_station_name: string
  return_station_name: string
  covered_distance_m: number
  duration_s: number
}

interface Props {
  rows: Data[]
  setRows: Dispatch<SetStateAction<Data[]>>
  initialDataLoading: boolean
  activeButton: string
  setActiveButton: Dispatch<SetStateAction<string>>
}

const JourneyDataView = ({ rows, setRows, initialDataLoading, activeButton, setActiveButton }: Props) => {
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

        {initialDataLoading || dataLoading ? <DataLoadingProgress /> : <JourneyDataTable rows={rows} />}
      </Box>
    </Container>
  )
}

export default JourneyDataView
