import React, { useState } from 'react'

import Box from '@mui/material/Box'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TablePagination from '@mui/material/TablePagination'
import TableRow from '@mui/material/TableRow'
import TableSortLabel from '@mui/material/TableSortLabel'
import Paper from '@mui/material/Paper'
import { visuallyHidden } from '@mui/utils'
import TextField from '@mui/material/TextField'
import { Button, Typography } from '@mui/material'
import { Link } from 'react-router-dom'

import { InfoOutlined } from '@mui/icons-material'

interface Data {
  fid: number
  id: number
  nimi: string
  namn: string
  name: string
  osoite: string
  kaupunki: string
  stad: string
  Operaattor: string
  kapasiteet: number
  x: number
  y: number
}

interface Props {
  rows: Data[]
}

type Order = 'asc' | 'desc'

interface HeadCell {
  disablePadding: boolean
  id: keyof Data
  label: string
  numeric: boolean
}

// FID,ID,Nimi,Namn,Name,Osoite,Adress,Kaupunki,Stad,Operaattor,Kapasiteet,x,y
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
  onRequestSort: (event: React.MouseEvent<unknown>, property: keyof Data) => void
  order: Order
  orderBy: string
}

const EnhancedTableHead = (props: EnhancedTableProps) => {
  const { order, orderBy, onRequestSort } = props

  const createSortHandler = (property: keyof Data) => (event: React.MouseEvent<unknown>) => {
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

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1
  }
  if (b[orderBy] > a[orderBy]) {
    return 1
  }
  return 0
}

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key
): (a: { [key in Key]: number | string }, b: { [key in Key]: number | string }) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy)
}

const StationListTable = ({ rows }: Props) => {
  const [order, setOrder] = useState<Order>('asc')
  const [orderBy, setOrderBy] = useState<keyof Data>('name')
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(100)
  const [filteredRows, setFilteredRows] = useState<Data[]>([])

  const filterData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const filterText = e.currentTarget.value
    const filteredData = rows.filter((row) => row.nimi.toLowerCase().includes(filterText.toLowerCase()))
    setFilteredRows(filteredData)
  }

  const handleRequestSort = (event: React.MouseEvent<unknown>, property: keyof Data) => {
    const isAsc = orderBy === property && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
  }

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0

  // FUnction return either all rows or filtered rows
  const getRows = () => {
    let selectedData: Data[] = []
    if (filteredRows.length > 0) {
      selectedData = filteredRows
    } else {
      selectedData = rows
    }
    return selectedData
  }

  return (
    <Paper sx={{ width: '100%', mb: 2, marginTop: '30px' }}>
      <TextField
        id="station-filter"
        label="Filter by Station name"
        variant="outlined"
        onChange={filterData}
        size="small"
        sx={{ marginBottom: '10px' }}
      />

      <TableContainer>
        <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size={'small'}>
          <EnhancedTableHead order={order} orderBy={orderBy} onRequestSort={handleRequestSort} />
          <TableBody>
            {getRows()
              .slice()
              .sort(getComparator(order, orderBy))
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, index) => {
                const labelId: string = `enhanced-table-checkbox-${index}`

                return (
                  <TableRow hover tabIndex={-1} key={row.id}>
                    <TableCell component="th" id={labelId} scope="row" padding="none">
                      <Link className="details-link" to={`/singlestation/${row.id}`}>
                        {row.nimi}
                        <InfoOutlined sx={{ marginLeft: '10px' }} fontSize="small" />
                      </Link>
                    </TableCell>
                    <TableCell align="left">{row.osoite}</TableCell>
                    <TableCell align="left">{row.kaupunki}</TableCell>
                  </TableRow>
                )
              })}
            {emptyRows > 0 && (
              <TableRow
                style={{
                  height: 53 * emptyRows,
                }}
              >
                <TableCell colSpan={6} />
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[50, 100, 200, 300, 500]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  )
}

export default StationListTable
