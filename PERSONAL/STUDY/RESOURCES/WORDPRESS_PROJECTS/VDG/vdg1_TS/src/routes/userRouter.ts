/** @format */

import express from 'express'
import user from '../controllers/userController'
// import { refreshToken } from '../middleware/refreshToken'

/**
 * Define the EXPRESS Router and export as default
 */
const router = express.Router()

// router.use(refreshToken)

router.get('/me', user.getMyDetails)
router.get('/sys/divisions', user.getAllSystemDivisions)
router.get('/hrm/divisions', user.getAllHrmDivisions)
router.get('/prod/me', user.getMyProdDetails)

export default router
