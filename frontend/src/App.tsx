import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import CssBaseline from '@mui/material/CssBaseline'

import Navbar from './components/Navbar'
import JourneyDataView from './components/JourneyDataView'
import StationListView from './components/StationListView'

function App() {
  return (
    <div>
      <BrowserRouter>
        <CssBaseline />
        <Navbar />
        <Routes>
          <Route path="/" element={<JourneyDataView />} />
          <Route path="/stations" element={<StationListView />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
