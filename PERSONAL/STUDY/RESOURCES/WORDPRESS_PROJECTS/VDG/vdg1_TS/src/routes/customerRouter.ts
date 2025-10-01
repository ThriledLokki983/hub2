/** @format */

import express from 'express'
import customer from '../controllers/customerController'
import { refreshToken } from '../middleware/refreshToken'

const router = express.Router()
router.use(refreshToken)

router
  .route('/')
  .get(customer.getAllCustomers)
  .post(customer.createCustomer)
  .put(customer.updateCustomerInfo)

router.route('/:id').get(customer.getSingleCustomerByID)
router.route('/account/:id').get(customer.getSingleCustomerByAccount)
router.route('/customer/:customerName').get(customer.getSingleCustomerByName)
router.route('/fullName/:customerFullName').get(customer.getSingleCustomerByFullName)
router.route('/title/:customerTitle').get(customer.getSingleCustomerByTitle)
router.route('/customers/bulk').get(customer.getBulkCustomers)

export default router
