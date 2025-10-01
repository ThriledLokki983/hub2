import express from 'express'
import invoice from '../controllers/warehouseController'
import { refreshToken } from '../middleware/refreshToken'

const router = express.Router()
router.use(refreshToken)

router.route('/').get(invoice.getAllWarehouses).post(invoice.createWarehouse)

export default router
