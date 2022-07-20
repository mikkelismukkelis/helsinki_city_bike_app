import { Router } from 'express'

import { getJourneys, getStations, getStationById } from '../controllers/apiController'

const router = Router()

router.get('/journeys', getJourneys)

router.get('/stations', getStations)

router.get('/stations/:id', getStationById)

export default router
