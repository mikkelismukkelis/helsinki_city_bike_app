import { Router } from 'express'

import { getJourneys, getStations } from '../controllers/apiController'

const router = Router()

router.get('/journeys', getJourneys)

router.get('/stations', getStations)

export default router
