import { Router } from 'express'

import { getJourneys, addJourney } from '../controllers/journeyController'

const router = Router()

router.get('/journeys', getJourneys)

router.post('/journey', addJourney)

export default router
