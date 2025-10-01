/** @format */
import { Request, Response, NextFunction } from 'express'
import axios from 'axios'
import catchAsync from '../utils/catchAsync'
import { ResponseProps } from '../utils/devTypes'
import { API_ITEMS_DIVISION, API_DIV_URL } from '../utils/secrets'
import helper from '../utils/helpers'

/************************************************************************************
 **                 PRODUCT INFORMATION                                            **
 **                 Endpoint to retrieve all the Invoice data from EXACT-API       **
 **                 Endpoint to Create new Invoice data                            **
 ***********************************************************************************/

/**
 * Make a request to the exact-api to get all the available products
 * @param req | Request
 * @param res | Response
 * @param next | NextFunction
 * @return {Promise} | Promise - returns the list of all the products
 */
const getAllProducts = catchAsync(
  async (_req: Request, res: Response, _next: NextFunction) => {
    const options = {
      headers: {
        "Allow-Control-Allow-Origin": "*",
        authorization: `Bearer ${await helper.getAccessToken()}`,
        'Content-Type': 'application/json',
      },
    }

    let data: any = []
    await axios
      .get(`${API_DIV_URL}/${API_ITEMS_DIVISION}/Items`, options)
      .then(async (resp: ResponseProps) => {
        data = resp.data.d.results
        if (resp.data.d.__next) {
          const next = resp.data.d.__next

          await axios
            .get(next, options)
            .then(async (nextResp: ResponseProps) => {
              const nextData = nextResp.data.d.results
              data = [...data, ...nextData]

              if (nextResp.data.d.__next) {
                const next = nextResp.data.d.__next

                await axios.get(next, options).then(async (nextResp: ResponseProps) => {
                  const nextData = nextResp.data.d.results
                  data = [...data, ...nextData]

                  if (nextResp.data.d.__next) {
                    const next = nextResp.data.d.__next

                    await axios.get(next, options).then((nextResp: ResponseProps) => {
                      const nextData = nextResp.data.d.results
                      data = [...data, ...nextData]
                    })
                  }
                })
              }
            })
            .catch((error: any) => {
              throw new Error(error.message)
            })
        }
      })
      .catch(async (error: any) => {
        if (error.response.data) {
          await helper.logError('getAllProducts', error.response.data.error.message.value)
          throw new Error((error as any).response.data.error.message.value)
        }
        helper.logError('getAllProducts', error.message)
        throw new Error(error.message)
      })

    // Send data to client's side
    res.status(200).json({
      status: 'success',
      length: data.length,
      data,
    })
  }
)
const getBulkProducts = catchAsync(
  async (_req: Request, res: Response, _next: NextFunction) => {
    console.log('=================getBulkProducts=================');

    const options = {
      headers: {
        authorization: `Bearer ${await helper.getAccessToken()}`,
        'Content-Type': 'application/json',
      },
    }

    let data: any = []
    await axios
      .get(
        `${API_DIV_URL}/bulk/${API_ITEMS_DIVISION}/Items?$filter=IsSalesItem eq true&$select=ID,ItemGroupDescription,Code,ItemGroupCode,StandardSalesPrice,CostPriceStandard,Description,ExtraDescription,UnitDescription`,
        options
      )
      .then(async (resp: ResponseProps) => {
        data = resp.data.d.results

        if (resp.data.d.__next) {
          const next = resp.data.d.__next

          await axios
            .get(next, options)
            .then(async (nextResp: ResponseProps) => {
              const nextData = nextResp.data.d.results
              data = [...data, ...nextData]

              if (nextResp.data.d.__next) {
                const next = nextResp.data.d.__next

                await axios.get(next, options).then(async (nextResp: ResponseProps) => {
                  const nextData = nextResp.data.d.results
                  data = [...data, ...nextData]

                  if (nextResp.data.d.__next) {
                    const next = nextResp.data.d.__next

                    await axios.get(next, options).then((nextResp: ResponseProps) => {
                      const nextData = nextResp.data.d.results
                      data = [...data, ...nextData]
                    })
                  }
                })
              }
            })
            .catch((error: any) => {
              throw new Error(error.message)
            })
        } else {
          return
        }
      })
      .catch(async (error: any) => {
        if (error.response.data) {
          await helper.logError('getAllProducts', error.response.data.error.message.value)
          throw new Error((error as any).response.data.error.message.value)
        }
        helper.logError('getAllProducts', error.message)
        throw new Error(error.message)
      })

    // Send data to client's side
    res.status(200).json({
      status: 'success',
      length: data.length,
      data,
    })
  }
)

export default { getAllProducts, getBulkProducts }
