import { Request, Response, NextFunction } from 'express'
import axios from 'axios'
import catchAsync from '../utils/catchAsync'
import { API_DIV_URL, API_ITEMS_DIVISION } from '../utils/secrets'
import helper from '../utils/helpers'

/**
 * Get all Available Sales Price Lists from exact API
 * This will be the endpoint for our clients side.
 * Thus even viewing the page source will not reveal anything about the request to exact but to
 * the local api which does not contain any useful information for intruders
 */
export const getAllSalesPriceLists = catchAsync(
  async (_req: Request, res: Response, _next: NextFunction) => {
    const options = {
      headers: {
        authorization: `Bearer ${await helper.getAccessToken()}`,
        'Content-Type': 'application/json',
      },
    }
    const data = await axios
      .get(
        `${API_DIV_URL}/${API_ITEMS_DIVISION}/SalesItemPrices?$select=Price,Account,Unit,Item,Currency,ItemCode,Quantity,UnitDescription,AccountName,DefaultItemUnit,EndDate,StartDate,ID,Created,Creator,CreatorFullName,DefaultItemUnit,DefaultItemUnitDescription,Division,Modified,Modifier`,
        options
      )
      .then((resp) => {
        return resp.data.d.results
      })
      .catch(async (error: Error) => {
        await helper.logError("getAllSalesPriceLists",error.message)
        throw new Error(error.message)
      })

    res.status(200).json({
      status: 'success',
      data,
    })
  }
)

export default { getAllSalesPriceLists }
