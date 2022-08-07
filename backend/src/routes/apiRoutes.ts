import { Router } from 'express'

import {
  getJourneys,
  getStations,
  getStationById,
  addJourney,
  addStation,
  getMaxStationIdAndFid,
} from '../controllers/apiController'

const router = Router()

router.get('/journeys', getJourneys)

router.post('/journey', addJourney)

router.get('/stations', getStations)

router.get('/stations/:id', getStationById)

router.post('/station', addStation)

router.get('/maxstationids', getMaxStationIdAndFid)

export default router
