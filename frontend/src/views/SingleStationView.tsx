import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'

import { Container, Button, Typography, Box } from '@mui/material'

import MapComponent from '../components/MapComponent'

const SingleStationView = () => {
  const [data, setData] = useState<any[]>([])
  const [markerData, setMarkerData] = useState<[number, number]>([0, 0])

  const params = useParams()
  let navigate = useNavigate()

  const stationId = params.stationId

  useEffect(() => {
    axios
      .get<any[]>(`http://localhost:3001/api/stations/${stationId}`)
      .then((res) => {
        setData(res.data)
        setMarkerData([res.data[0].y, res.data[0].x])
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

  //   Check if data is ready, if not return null. Data loading -message is in MapComponent
  const getInformation = () => {
    if (data.length === 0) return null

    return (
      <Box>
        <Typography variant="h6">{'Station name: ' + data[0].nimi}</Typography>
        <Typography variant="h6">{'Station address: ' + data[0].osoite}</Typography>
        <Typography variant="h6">{'Count of journeys started here: ' + data[1].departure_count}</Typography>
        <Typography variant="h6">{'Count of journeys ended here: ' + data[2].return_count}</Typography>
        <Typography variant="h6">
          {'Journey average distance when started from here: ' + parseInt(data[3].average_distance_departure) + 'm'}
        </Typography>
        <Typography variant="h6">
          {'Journey average distance when ended to here: ' + parseInt(data[4].average_distance_return) + 'm'}
        </Typography>
      </Box>
    )
  }

  return (
    <Container>
      <Button sx={{ marginBottom: '20px' }} variant="contained" onClick={() => navigate(-1)}>
        Back to list
      </Button>
      <MapComponent markerData={markerData} />
      {getInformation()}
    </Container>
  )
}

export default SingleStationView
