import React from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import LinearProgress from '@mui/material/LinearProgress'

const DataLoadingProgress = () => {
  return (
    <Box sx={{ marginTop: '200px', width: '80%' }}>
      <Typography variant="h6">Loading data, please wait...</Typography>
      <LinearProgress />
    </Box>
  )
}

export default DataLoadingProgress
