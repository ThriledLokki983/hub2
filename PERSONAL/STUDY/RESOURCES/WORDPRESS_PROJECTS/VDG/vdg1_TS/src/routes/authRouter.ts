/** @format */

import express from 'express'
import oauth from '../controllers/authController'

const router = express.Router()

router.route('/').get(oauth.login).post(oauth.getRefreshToken)
router.route('/refresh').post(oauth.refreshToken)
router.route('/logout').get(oauth.logout)

export default router
