import { RequestHandler } from 'express'

import { getRandom } from '../database/database'

// GET ALL JOURNEYS
export const getJourneys: RequestHandler = async (req, res, _next) => {
  getRandom()
  res.json({ journey: 'ykkönen' })
  //   const checkstring: string = req.body.checkstring

  //   if (checkstring !== process.env.CHECKSTRING || !checkstring) {
  //     return res.status(403).send({ message: 'so called password was wrong or missing' })
  //   }

  //   try {
  //     const pool = await getConnection()

  //     if (pool instanceof Error) {
  //       return res.status(500).send({ message: 'error in database connection' })
  //     } else {
  //       // first check if email is found from database
  //       const sqlResult = await pool.request().query(subscriptionQuerys.getAllSubscriptions)

  //       res.json(sqlResult.recordset)
  //     }
  //   } catch (error) {
  //     console.log('error', error)
  //     res.status(500).send({ message: 'something went wrong in getSubscriptions function' })
  //   }
}
