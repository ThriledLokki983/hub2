import { Request, Response, NextFunction } from 'express'
import axios from 'axios'
import catchAsync from '../utils/catchAsync'
import { ResponseProps } from '../utils/devTypes'
import { API_DIV_URL, API_WAREHOUSE_DIVISION } from '../utils/secrets'
import helper from '../utils/helpers'

/**
 * Get all Available Warehouses from exact API
 * This will be the endpoint for our clients side.
 * Thus even viewing the page source will not reveal anything about the request to exact but to
 * the local api which does not contain any useful information for intruders
 */

export const getAllWarehouses = catchAsync(
  async (_req: Request, res: Response, _next: NextFunction) => {
    const options = {
      headers: {
        authorization: `Bearer ${await helper.getAccessToken()}`,
        'Content-Type': 'application/json',
      },
    }
    const data = await axios
      .get(`${API_DIV_URL}/${API_WAREHOUSE_DIVISION}/Warehouses`, options)
      .then((resp: ResponseProps) => {
        return resp.data.d.results
      })
      .catch(async (error) => {
        await helper.logError('getAllWarehouses', error.message)
        throw new Error(error.message)
      })

    res.status(200).json({
      status: 'success',
      data,
    })
  }
)

//--------------------------CREATE NEW WAREHOUSE -------------------------------
export const createWarehouse = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const options = {
      headers: {
        authorization: `Bearer ${await helper.getAccessToken()}`,
        'Content-Type': 'application/json',
      },
    }
    const data = await axios
      .post(
        `${API_DIV_URL}/${API_WAREHOUSE_DIVISION}/Warehouses`,
        JSON.stringify(req.body),
        options
      )
      .then((resp: ResponseProps) => {
        return resp.data.d
      })
      .catch(async (error: any) => {
        if (error.response.data.message) {
          await helper.logError(
            'createWarehouse',
            error.response.data.error.message.value
          )
          throw new Error(error.response.data.error.message.value)
        } else {
          await helper.logError('createWarehouse', error.message)
          throw new Error(error.message)
        }
      })

    res.status(201).json({
      status: 'success',
      data,
    })
  }
)

// -------------- EXPORT FUNCTIONS AS DEFAULT ----------------------------------------
export default {
  getAllWarehouses,
  createWarehouse,
}
