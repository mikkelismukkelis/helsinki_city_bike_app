import { Router } from 'express'

import { getStations, getStationById, addStation, getMaxStationIdAndFid } from '../controllers/stationController'

const router = Router()

router.get('/stations', getStations)

router.get('/stations/:id', getStationById)

router.post('/station', addStation)

router.get('/maxstationids', getMaxStationIdAndFid)

export default router
