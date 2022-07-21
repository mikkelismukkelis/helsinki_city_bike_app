import React from 'react'

import { Stack, Button, Typography } from '@mui/material'

interface Props {
  clickAlphabetButton: (e: React.MouseEvent<unknown>, beginLetter: string, endLetter: string) => void
  activeButton: string
  dataLoading: boolean
}

const DepartureStationButtons = ({ clickAlphabetButton, activeButton, dataLoading }: Props) => {
  return (
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
  )
}

export default DepartureStationButtons
