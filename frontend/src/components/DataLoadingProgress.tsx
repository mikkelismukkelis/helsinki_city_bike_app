import React from 'react'
import { Box, Typography, LinearProgress } from '@mui/material'

const DataLoadingProgress = () => {
  return (
    <Box sx={{ marginTop: '200px', width: '80%' }}>
      <Typography variant="h6">Loading data, please wait...</Typography>
      <LinearProgress />
    </Box>
  )
}

export default DataLoadingProgress
