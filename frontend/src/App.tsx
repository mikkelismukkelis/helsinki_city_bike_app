import React, { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import axios from 'axios'

import CssBaseline from '@mui/material/CssBaseline'

import Navbar from './components/Navbar'
import JourneyDataView from './views/JourneyDataView'
import StationListView from './views/StationListView'
import SingleStationView from './views/SingleStationView'
import AddJourney from './views/AddJourneyView'
import AddStation from './views/AddStationView'

import { JourneyData, StationData } from './typesInterfaces'

const api = !process.env.NODE_ENV || process.env.NODE_ENV === 'development' ? 'http://localhost:3001/api' : '/api'

const journeyInitData: JourneyData = {
  rowid: 0,
  departure_station_name: 'No data available',
  return_station_name: '-',
  covered_distance_m: 0,
  duration_s: 0,
}

function App() {
  const [stationRows, setStationRows] = useState<StationData[]>([])
  const [stationDataLoading, setStationDataLoading] = useState(true)
  const [journeyRows, setJourneyRows] = useState<JourneyData[]>([journeyInitData])
  const [initialDataLoading, setIninitialDataLoading] = useState(true)
  const [activeButton, setActiveButton] = useState('button1')

  // Function to get journey data. Used by useefect and alphabetical range buttons
  const getStationData = () => {
    setStationDataLoading(true)

    axios
      .get<StationData[]>(`${api}/stations`)
      .then((res) => {
        setStationDataLoading(false)
        setStationRows(res.data)
      })
      .catch((err) => {
        console.log('Error in axios: ', err)
        setStationDataLoading(false)

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

  // Function to get initial journey data. Used by useefect
  const getJourneyData = () => {
    axios
      .get<JourneyData[]>(`${api}/journeys`, {
        params: {
          beginLetter: 'A',
          endLetter: 'H',
        },
      })
      .then((res) => {
        setIninitialDataLoading(false)
        setJourneyRows(res.data)
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
    getStationData()
    getJourneyData()
  }, [])

  return (
    <div>
      <BrowserRouter>
        <CssBaseline />
        <Navbar />
        <Routes>
          <Route path="/" element={<StationListView rows={stationRows} dataLoading={stationDataLoading} />} />
          <Route
            path="/journeys"
            element={
              <JourneyDataView
                rows={journeyRows}
                setRows={setJourneyRows}
                initialDataLoading={initialDataLoading}
                activeButton={activeButton}
                setActiveButton={setActiveButton}
              />
            }
          />
          <Route path="/singlestation/:stationId" element={<SingleStationView />} />
          <Route path="/addjourney" element={<AddJourney stationData={stationRows} />} />
          <Route path="/addstation" element={<AddStation />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
