import React from 'react'

import { Box, TableCell, TableHead, TableRow, TableSortLabel } from '@mui/material'
import { visuallyHidden } from '@mui/utils'

import { JourneyData, Order, HeadCell } from '../typesInterfaces'

interface EnhancedTableProps {
  onRequestSort: (event: React.MouseEvent<unknown>, property: keyof JourneyData) => void
  order: Order
  orderBy: string
}

const headCells: readonly HeadCell[] = [
  {
    id: 'departure_station_name',
    numeric: false,
    disablePadding: true,
    label: 'Departure station name',
  },
  {
    id: 'return_station_name',
    numeric: false,
    disablePadding: false,
    label: 'Return station name',
  },
  {
    id: 'covered_distance_m',
    numeric: true,
    disablePadding: false,
    label: 'Covered distance (km)',
  },
  {
    id: 'duration_s',
    numeric: true,
    disablePadding: false,
    label: 'Duration (mins)',
  },
]

const JourneyDataTableHeaders = (props: EnhancedTableProps) => {
  const { order, orderBy, onRequestSort } = props

  const createSortHandler = (property: keyof JourneyData) => (event: React.MouseEvent<unknown>) => {
    onRequestSort(event, property)
  }

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  )
}

export default JourneyDataTableHeaders
