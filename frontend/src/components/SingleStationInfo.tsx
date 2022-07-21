import React from 'react'
import { styled } from '@mui/material/styles'
import { Box, Paper, Grid, Typography, List, ListItem, ListItemButton, ListItemText } from '@mui/material'

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}))

interface Props {
  data: any[]
}

interface Top5Return {
  return_station_name: string
  return_station_id: number
  return_count: number
}

interface Top5Departure {
  departure_station_name: string
  departure_station_id: number
  departure_count: number
}

const SingleStationInfo = ({ data }: Props) => {
  const name = data[0].nimi
  const address = data[0].osoite
  const city = data[0].kaupunki
  const capacity = data[0].kapasiteet
  const departureCount = data[1].departure_count
  const returnCount = data[2].return_count
  const averageDistanceDeparture = parseInt(data[3].average_distance_departure)
  const averageDistanceReturn = parseInt(data[4].average_distance_return)
  const top5ReturnStations: Top5Return[] = data[5]
  const top5DepartureStations: Top5Departure[] = data[6]

  console.log('top5ReturnStations :>> ', top5ReturnStations)

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Typography>Station name: {name}</Typography>
          <Typography>Address: {address}</Typography>
          <Typography>City: {city}</Typography>
          <Typography>Bike capacity: {capacity}</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography>Count of journeys started here: {departureCount}</Typography>
          <Typography>Count of journeys ended here: {returnCount}</Typography>
          <Typography>Journey average distance when started from here: {averageDistanceDeparture}m</Typography>
          <Typography>Journey average distance when ended to here: {averageDistanceReturn}m</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="h6">Top 5 return stations departed from this station</Typography>
          <Typography variant="body2">Count of returns after name</Typography>
          <List>
            {top5ReturnStations.map((obj) => {
              return (
                <ListItem key={obj.return_station_id} disablePadding>
                  <ListItemText primary={`${obj.return_station_name}: ${obj.return_count}`} />
                </ListItem>
              )
            })}
          </List>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="h6">Top 5 departure stations returned to this station</Typography>
          <Typography variant="body2">Count of departures after name</Typography>
          <List>
            {top5DepartureStations.map((obj) => {
              return (
                <ListItem key={obj.departure_station_id} disablePadding>
                  <ListItemText primary={`${obj.departure_station_name}: ${obj.departure_count}`} />
                </ListItem>
              )
            })}
          </List>
        </Grid>
      </Grid>
    </Box>
  )
}

export default SingleStationInfo
