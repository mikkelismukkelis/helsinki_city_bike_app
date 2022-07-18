import React, { useState, useEffect } from 'react'
import axios from 'axios'
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
import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import LinearProgress from '@mui/material/LinearProgress'
import Container from '@mui/material/Container'

interface Data {
  rowid: number
  departure_station_name: string
  return_station_name: string
  covered_distance_m: number
  duration_s: number
}

interface HeadCell {
  disablePadding: boolean
  id: keyof Data
  label: string
  numeric: boolean
}

type Order = 'asc' | 'desc'

interface EnhancedTableProps {
  onRequestSort: (event: React.MouseEvent<unknown>, property: keyof Data) => void
  order: Order
  orderBy: string
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

// departure_station_name, return_station_name, covered_distance_m, duration_s

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

const EnhancedTable = () => {
  const initData: Data = {
    rowid: 0,
    departure_station_name: 'Data being fetched',
    return_station_name: '...',
    covered_distance_m: 0,
    duration_s: 0,
  }

  const [rows, setRows] = useState<Data[]>([initData])
  const [order, setOrder] = useState<Order>('asc')
  const [orderBy, setOrderBy] = useState<keyof Data>('departure_station_name')
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(100)
  const [activeButton, setActiveButton] = useState('button1')
  const [dataLoading, setDataLoading] = useState(false)

  useEffect(() => {
    const fetchData = () => {
      setDataLoading(true)

      axios
        .get<Data[]>('http://localhost:3001/api/journeys', {
          params: {
            beginLetter: 'A',
            endLetter: 'H',
          },
        })
        .then((res) => {
          setDataLoading(false)
          setRows(res.data)
        })
        .catch((err) => {
          console.log('Error in axios: ', err)
          setDataLoading(false)

          // TODO: if database is busy for example in data import, what we do?
          if (err.response.data.error === 'SQLITE_BUSY: database is locked') {
            console.log('DATABASE BUSY')
          }
        })
    }

    fetchData()
  }, [])

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

  // Get new data from api and set to table
  const clickAlphabetButton = (e: React.MouseEvent<unknown>, beginLetter: string, endLetter: string) => {
    const target = e.target as HTMLButtonElement

    setDataLoading(true)

    axios
      .get<Data[]>('http://localhost:3001/api/journeys', {
        params: {
          beginLetter,
          endLetter,
        },
      })
      .then((res) => {
        setActiveButton(target.id)
        setDataLoading(false)
        setRows(res.data)
      })
      .catch((err) => {
        console.log('Error in axios: ', err)
        setDataLoading(false)

        // TODO: if database is busy for example in data import, what we do?
        if (err.response.data.error === 'SQLITE_BUSY: database is locked') {
          console.log('DATABASE BUSY')
        }
      })
  }

  return (
    <Container>
      <Box sx={{ width: '100%' }}>
        <Stack spacing={2} direction="row">
          <Typography variant="h5">Departure station first letter: </Typography>
          <Button
            id="button1"
            onClick={(event) => clickAlphabetButton(event, 'A', 'H')}
            variant={activeButton === 'button1' ? 'contained' : 'outlined'}
            disabled={dataLoading}
          >
            A - H
          </Button>
          <Button
            id="button2"
            onClick={(event) => clickAlphabetButton(event, 'I', 'K')}
            variant={activeButton === 'button2' ? 'contained' : 'outlined'}
            disabled={dataLoading}
          >
            I - K
          </Button>
          <Button
            id="button3"
            onClick={(event) => clickAlphabetButton(event, 'L', 'O')}
            variant={activeButton === 'button3' ? 'contained' : 'outlined'}
            disabled={dataLoading}
          >
            L - O
          </Button>
          <Button
            id="button4"
            onClick={(event) => clickAlphabetButton(event, 'P', 'S')}
            variant={activeButton === 'button4' ? 'contained' : 'outlined'}
            disabled={dataLoading}
          >
            P - S
          </Button>
          <Button
            id="button5"
            onClick={(event) => clickAlphabetButton(event, 'T', 'Ö')}
            variant={activeButton === 'button5' ? 'contained' : 'outlined'}
            disabled={dataLoading}
          >
            T - Ö
          </Button>
        </Stack>
        {dataLoading ? (
          <Box sx={{ marginTop: '200px', width: '80%' }}>
            <Typography variant="h6">Loading journey data, please wait...</Typography>
            <LinearProgress />
          </Box>
        ) : (
          <Paper sx={{ width: '100%', mb: 2, marginTop: '30px' }}>
            <TableContainer>
              <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size={'small'}>
                <EnhancedTableHead order={order} orderBy={orderBy} onRequestSort={handleRequestSort} />
                <TableBody>
                  {rows
                    .slice()
                    .sort(getComparator(order, orderBy))
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) => {
                      const labelId = `enhanced-table-checkbox-${index}`

                      return (
                        <TableRow hover tabIndex={-1} key={row.rowid}>
                          <TableCell component="th" id={labelId} scope="row" padding="none">
                            {row.departure_station_name}
                          </TableCell>
                          <TableCell align="left">{row.return_station_name}</TableCell>
                          <TableCell align="right">{(row.covered_distance_m / 1000).toFixed(2)}</TableCell>
                          <TableCell align="right">{(row.duration_s / 60).toFixed(1)}</TableCell>
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
              rowsPerPageOptions={[50, 100, 200, 300, 500, 1000, 2000]}
              component="div"
              count={rows.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper>
        )}
      </Box>
    </Container>
  )
}

export default EnhancedTable
