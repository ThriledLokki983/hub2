/** @format */

import express from 'express'
import product from '../controllers/productController'
import { refreshToken } from '../middleware/refreshToken'

const router = express.Router()

router.use(refreshToken)

router.route('/').get(product.getAllProducts)
router.route('/bulk').get(product.getBulkProducts)

export default router
