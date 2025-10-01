import express from 'express'
import invoice from '../controllers/invoiceController'
import { refreshToken } from '../middleware/refreshToken'

const router = express.Router()
router.use(refreshToken)

router.route('/').get(invoice.getAllInvoices).post(invoice.createInvoice)

export default router
