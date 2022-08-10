import React from 'react'

import '../style.css'

import { Box, TableCell, TableHead, TableRow, TableSortLabel } from '@mui/material'
import { visuallyHidden } from '@mui/utils'

import { StationData, Order } from '../typesInterfaces'

interface HeadCell {
  disablePadding: boolean
  id: keyof StationData
  label: string
  numeric: boolean
}

const headCells: readonly HeadCell[] = [
  {
    id: 'nimi',
    numeric: false,
    disablePadding: true,
    label: 'Name (click name for detailed information)',
  },
  {
    id: 'osoite',
    numeric: false,
    disablePadding: false,
    label: 'Address',
  },
  {
    id: 'kaupunki',
    numeric: false,
    disablePadding: false,
    label: 'City',
  },
]

interface EnhancedTableProps {
  onRequestSort: (event: React.MouseEvent<unknown>, property: keyof StationData) => void
  order: Order
  orderBy: string
}

const StationListTableHead = (props: EnhancedTableProps) => {
  const { order, orderBy, onRequestSort } = props

  const createSortHandler = (property: keyof StationData) => (event: React.MouseEvent<unknown>) => {
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

export default StationListTableHead
