import React, { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import axios from 'axios'

import CssBaseline from '@mui/material/CssBaseline'

import Navbar from './components/Navbar'
import JourneyDataView from './views/JourneyDataView'
import StationListView from './views/StationListView'
import SingleStationView from './views/SingleStationView'

interface Data {
  rowid: number
  departure_station_name: string
  return_station_name: string
  covered_distance_m: number
  duration_s: number
}

function App() {
  const initData: Data = {
    rowid: 0,
    departure_station_name: 'Data being fetched',
    return_station_name: '...',
    covered_distance_m: 0,
    duration_s: 0,
  }

  const [rows, setRows] = useState<Data[]>([initData])
  const [initialDataLoading, setIninitialDataLoading] = useState(true)
  const [activeButton, setActiveButton] = useState('button1')

  // Function to get initial journey data. Used by useefect
  const getJourneyData = () => {
    axios
      .get<Data[]>('http://localhost:3001/api/journeys', {
        params: {
          beginLetter: 'A',
          endLetter: 'H',
        },
      })
      .then((res) => {
        setIninitialDataLoading(false)
        setRows(res.data)
      })
      .catch((err) => {
        console.log('Error in axios: ', err)
        setIninitialDataLoading(false)

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
    getJourneyData()
  }, [])

  return (
    <div>
      <BrowserRouter>
        <CssBaseline />
        <Navbar />
        <Routes>
          <Route path="/" element={<StationListView />} />
          <Route
            path="/journeys"
            element={
              <JourneyDataView
                rows={rows}
                setRows={setRows}
                initialDataLoading={initialDataLoading}
                activeButton={activeButton}
                setActiveButton={setActiveButton}
              />
            }
          />
          <Route path="/singlestation/:stationId" element={<SingleStationView />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
