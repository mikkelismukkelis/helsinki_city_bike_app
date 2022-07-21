import React from 'react'
import { Link, useLocation } from 'react-router-dom'

import '../style.css'

import { AppBar, Box, Toolbar, Button } from '@mui/material'

const Navbar = () => {
  const location = useLocation()

  return (
    <Box sx={{ flexGrow: 1, marginBottom: '50px' }}>
      <AppBar position="static">
        <Toolbar>
          <Button color="inherit">
            <Link className={location.pathname === '/' ? 'navlink active' : 'navlink'} to="/">
              Station list
            </Link>
          </Button>

          <Button color="inherit">
            <Link className={location.pathname === '/journeys' ? 'navlink active' : 'navlink'} to="/journeys">
              Journey data
            </Link>
          </Button>
        </Toolbar>
      </AppBar>
    </Box>
  )
}

export default Navbar
