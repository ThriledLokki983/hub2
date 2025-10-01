/** @format */

import express from 'express'
import account from '../controllers/accountController'
import { refreshToken } from '../middleware/refreshToken'

const router = express.Router()

router.use(refreshToken)

router
  .route('/')
  .get(account.getAllCustomersAccounts)
  .put(account.updateCustomerAccountInfo)
  .post(account.createCustomerAccount)

router.route('/:id').get(account.getOneCustomerAccount)
// get all accounts (1000 at a time) from the Exact-API that contains only the Account ID
// and Account Name
router.route('/bulk/all').get(account.getBulkAccounts)
router.route('/relatedAccounts/:allIDs').get(account.getRelatedCustomerAccount)

export default router
