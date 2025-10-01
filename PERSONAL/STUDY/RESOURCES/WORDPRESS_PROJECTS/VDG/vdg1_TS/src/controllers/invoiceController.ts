import { Request, Response, NextFunction } from 'express'
import axios from 'axios'
import catchAsync from '../utils/catchAsync'
import { ResponseProps } from '../utils/devTypes'
import { API_DIV_URL, API_CUSTOMER_DIVISION } from '../utils/secrets'
import helper from '../utils/helpers'

/************************************************************************************
 **                 INVOICE INFORMATION                                            **
 **                 Endpoint to retrieve all the Invoice data from EXACT-API       **
 **                 Endpoint to Create new Invoice data                            **
 ***********************************************************************************/

/**
 * Make a request to EXACT-API to get all the Invoices data
 * @param req | Request
 * @param res | Response
 * @param next | NextFunction
 * @return {Promise} | Promise - returns the list of all the Invoice
 */
export const getAllInvoices = catchAsync(
  async (_req: Request, res: Response, _next: NextFunction) => {
    const options = {
      headers: {
        authorization: `Bearer ${await helper.getAccessToken()}`,
        'Content-Type': 'application/json',
      },
    }
    const data = await axios
      .get(`${API_DIV_URL}/${API_CUSTOMER_DIVISION}/Quotations`, options)
      .then((resp: ResponseProps) => {
        return resp.data.d.results
      })
      .catch(async (error) => {
        await helper.logError('getAllInvoices', error.message)
        throw new Error(error.message)
      })

    res.status(200).json({
      status: 'success',
      data,
    })
  }
)

/**
 * Make a request to EXACT-API to create a new Invoice
 * @param req | Request
 * @param res | Response
 * @param next | NextFunction
 * @return {Promise} | Promise - creates new invoice data and return it
 */
export const createInvoice = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const options = {
      headers: {
        authorization: `Bearer ${await helper.getAccessToken()}`,
        'Content-Type': 'application/json',
      },
    }
    const data = await axios
      .post(`${API_DIV_URL}/${API_CUSTOMER_DIVISION}/Quotations`, req.body, options)
      .then((resp: ResponseProps) => {
        return resp.data.d
      })
      .catch(async (error: any) => {
        if (error.response.data.error.message) {
          await helper.logError('getAllInvoices', error.response.data.error.message.value)
          throw new Error(error.response.data.error.message.value)
        } else {
          await helper.logError('getAllInvoices', error.message)
          throw new Error(error.message)
        }
      })

    res.status(201).json({
      status: 'success',
      data,
    })
  }
)

// export the functions as defaults
export default {
  getAllInvoices,
  createInvoice,
}
