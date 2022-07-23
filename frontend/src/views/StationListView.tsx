import React from 'react'

import { Box, Container } from '@mui/material'

import DataLoadingProgress from '../components/DataLoadingProgress'
import StationListTable from '../components/StationListTable'

import { StationData } from '../typesInterfaces'

interface Props {
  rows: StationData[]
  dataLoading: boolean
}

const StationListView = ({ rows, dataLoading }: Props) => {
  return (
    <Container>
      <Box sx={{ width: '100%' }}>{dataLoading ? <DataLoadingProgress /> : <StationListTable rows={rows} />}</Box>
    </Container>
  )
}

export default StationListView
