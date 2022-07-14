import { Router } from 'express'

import { getJourneys } from '../controllers/journeyController'

const router = Router()

router.get('/journeys', getJourneys)

export default router
