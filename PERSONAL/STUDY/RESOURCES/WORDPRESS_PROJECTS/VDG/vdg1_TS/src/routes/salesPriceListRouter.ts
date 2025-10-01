/** @format */

import express from 'express'
import sales from '../controllers/salesPriceController'
import { refreshToken } from '../middleware/refreshToken'

const router = express.Router()
router.use(refreshToken)

router.get('/', sales.getAllSalesPriceLists)

export default router
