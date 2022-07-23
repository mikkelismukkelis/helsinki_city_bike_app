import React, { useState } from 'react'
import { Link } from 'react-router-dom'

import '../style.css'

import { Table, TableBody, TableCell, TableContainer, TablePagination, TableRow, Paper, TextField } from '@mui/material'
import { InfoOutlined } from '@mui/icons-material'

import StationListTableHead from './StationListTableHead'

import { StationData, Order } from '../typesInterfaces'

interface Props {
  rows: StationData[]
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
  const [orderBy, setOrderBy] = useState<keyof StationData>('name')
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(100)
  const [filteredRows, setFilteredRows] = useState<StationData[]>([])
  const [filteredDataNotFound, setFilteredDataNotFound] = useState(false)

  const filterData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const filterText = e.currentTarget.value
    const filteredData = rows.filter((row) => row.nimi.toLowerCase().includes(filterText.toLowerCase()))

    if (filterText !== '' && filteredData.length === 0) {
      setFilteredRows(filteredData)
      setFilteredDataNotFound(true)
    } else {
      setFilteredRows(filteredData)
      setFilteredDataNotFound(false)
    }
  }

  const handleRequestSort = (event: React.MouseEvent<unknown>, property: keyof StationData) => {
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
    let selectedData: StationData[] = []

    if (filteredRows.length > 0 || filteredDataNotFound) {
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
          <StationListTableHead order={order} orderBy={orderBy} onRequestSort={handleRequestSort} />
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
