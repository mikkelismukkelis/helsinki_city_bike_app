import React from 'react'
import { Map, Marker } from 'pigeon-maps'

import { Box, Typography } from '@mui/material'

interface Props {
  markerData: [number, number]
}

const MapComponent = ({ markerData }: Props) => {
  if (markerData[0] === 0) {
    return (
      <Typography sx={{ marginTop: '50px' }} variant="h4">
        Data loading, please wait...
      </Typography>
    )
  } else {
    return (
      <Box sx={{ display: 'block' }}>
        <Map height={400} defaultCenter={markerData} defaultZoom={13}>
          <Marker width={50} anchor={markerData} />
        </Map>
      </Box>
    )
  }
}

export default MapComponent
