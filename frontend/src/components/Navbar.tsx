import React from 'react'
import { Link, useLocation } from 'react-router-dom'

import './style.css'

import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import Button from '@mui/material/Button'

const Navbar = () => {
  const location = useLocation()

  return (
    <Box sx={{ flexGrow: 1, marginBottom: '50px' }}>
      <AppBar position="static">
        <Toolbar>
          <Button color="inherit">
            <Link className={location.pathname === '/' ? 'navlink active' : 'navlink'} to="/">
              Journey data
            </Link>
          </Button>

          <Button color="inherit">
            <Link className={location.pathname === '/stations' ? 'navlink active' : 'navlink'} to="/stations">
              Station list
            </Link>
          </Button>
        </Toolbar>
      </AppBar>
    </Box>
  )
}

export default Navbar
