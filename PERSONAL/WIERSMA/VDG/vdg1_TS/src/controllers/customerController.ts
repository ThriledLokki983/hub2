/** @format */
import { Request, Response, NextFunction } from 'express'
import axios from 'axios'
import catchAsync from '../utils/catchAsync'
import { ResponseProps } from '../utils/devTypes'
import {
  API_DIV_URL,
  API_CUSTOMER_DIVISION,
  API_BULK_CUSTOMER_DIVISION,
} from '../utils/secrets'
import helper from '../utils/helpers'

/************************************************************************************
 **                     CUSTOMERS/CONTACTS INFORMATION                             **
 **                     Endpoint to retrieve all the customer from EXACT-API       **
 **                     Endpoint to update and existing customer data              **
 **                     Endpoint to Create new Customer data                       **
 ***********************************************************************************/

/**
 * This will be the endpoint for our clients side.
 * @param req | Request
 * @param res | Response
 * @param next | NextFunction
 * @return {Promise} | Promise - returns the list of all the contacts
 */
const getAllCustomers = catchAsync(
  async (_req: Request, res: Response, _next: NextFunction) => {
    const options = {
      headers: {
        authorization: `Bearer ${await helper.getAccessToken()}`,
        'Content-Type': 'application/json',
      },
    }

    let data: any = []
    await axios
      .get(`${API_DIV_URL}/${API_CUSTOMER_DIVISION}/Contacts`, options)
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

                await axios.get(next, options).then((nextResp: ResponseProps) => {
                  const nextData = nextResp.data.d.results
                  data = [...data, ...nextData]
                })
              }
            })
            .catch((error: any) => {
              throw new Error(error.message)
            })
        }
      })
      .catch(async (error: Error) => {
        if ((error as any).response.data) {
          await helper.logError(
            'getAllCustomers',
            (error as any).response.data.error.message.value
          )
          throw new Error((error as any).response.data.error.message.value)
        } else {
          await helper.logError('getAllCustomers', error.message)
          throw new Error(error.message)
        }
      })

    res.status(200).json({
      status: 'success',
      length: data.length,
      data: {
        data,
      },
    })
  }
)

/**
 * Get a single customer/contact
 * @param req | Request
 * @param res | Response
 * @param next | NextFunction
 * @return {Promise} | Promise - return a single contact data
 */
const createCustomer = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const options = {
      headers: {
        authorization: `Bearer ${await helper.getAccessToken()}`,
        'Content-Type': 'application/json',
        Prefer: 'return=representation',
      },
    }
    const data = await axios
      .post(
        `${API_DIV_URL}/${API_CUSTOMER_DIVISION}/Contacts`,
        JSON.stringify(req.body),
        options
      )
      .then((resp: ResponseProps) => resp.data.d)
      .catch(async (error: Error) => {
        if ((error as any).response.data) {
          await helper.logError(
            'createCustomer',
            (error as any).response.data.error.message.value
          )
          throw new Error((error as any).response.data.error.message.value)
        } else {
          await helper.logError('createCustomer', (error as any).message)
          throw new Error(error.message)
        }
      })

    res.status(200).json({
      status: 'success',
      data: {
        data,
      },
    })
  }
)

/**
 * This is the endpoint to update an existing customer/contact   data
 * @param req | Request
 * @param res | Response
 * @param next | NextFunction
 * @return {Promise} | Promise - updates the customer/contact data and return the data
 */
const updateCustomerInfo = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    // console.log(req.body)

    const options = {
      headers: {
        authorization: `Bearer ${await helper.getAccessToken()}`,
        'Content-Type': 'application/json',
      },
    }
    const data = await axios
      .put(
        `${API_DIV_URL}/${API_CUSTOMER_DIVISION}/Contacts(guid'${req.body.ID}')`,
        JSON.stringify(req.body),
        options
      )
      .then((resp: ResponseProps) => {
        if (resp.status === 400) {
          // console.log(resp.data)
        }
        return resp.data.d
      })
      .catch(async (error: Error) => {
        if ((error as any).response.data) {
          await helper.logError(
            'updateCustomerInfo',
            (error as any).response.data.error.message.value
          )
          throw new Error((error as any).response.data.error.message.value)
        } else {
          await helper.logError('updateCustomerInfo', (error as any).message)
          throw new Error(error.message)
        }
      })

    res.status(200).json({
      status: 'success',
      data: {
        data,
      },
    })
  }
)

const getSingleCustomerByFullName = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    console.log({ customerFullName: req.params.customerFullName })

    const options = {
      headers: {
        authorization: `Bearer ${await helper.getAccessToken()}`,
        'Content-Type': 'application/json',
      },
    }

    let data = await axios
      .get(
        `${API_DIV_URL}/${API_CUSTOMER_DIVISION}/Contacts?$filter=substringof('${req.params.customerFullName}', FullName) eq true`,
        options
      )
      .then((resp: ResponseProps) => {
        return resp.data.d.results
      })

      .catch(async (error: Error) => {
        if ((error as any).response.data) {
          await helper.logError(
            'getSingleCustomer',
            (error as any).response.data.error.message.value
          )
          throw new Error((error as any).response.data.error.message.value)
        } else {
          await helper.logError('getSingleCustomer', (error as any).message)
          throw new Error(error.message)
        }
      })

    res.status(200).json({
      status: 'success',
      length: data.length,
      data: {
        data,
      },
    })
  }
)

const getSingleCustomerByName = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    console.log({ customerName: req.params.customerName })

    const options = {
      headers: {
        authorization: `Bearer ${await helper.getAccessToken()}`,
        'Content-Type': 'application/json',
      },
    }

    const data = await axios
      .get(
        `${API_DIV_URL}/${API_CUSTOMER_DIVISION}/Contacts?$filter=substringof('${req.params.customerName}', FirstName) eq true or substringof('${req.params.customerName}', LastName) eq true or substringof('${req.params.customerName}', MiddleName) eq true or substringof('${req.params.customerName}', Email) eq true&$select=Account,FirstName,LastName,MiddleName,Email,AccountName,Initials,Phone,Notes,Mobile,AddressLine2,AddressStreet,Country,ID,JobTitleDescription&$expand=Account,City`,
        options
      )
      .then((resp: ResponseProps) => {
        return resp.data.d.results
      })
      .catch(async (error: Error) => {
        if ((error as any).response.data) {
          await helper.logError(
            'getSingleCustomer',
            (error as any).response.data.error.message.value
          )
          throw new Error((error as any).response.data.error.message.value)
        } else {
          await helper.logError('getSingleCustomer', (error as any).message)
          throw new Error(error.message)
        }
      })

    res.status(200).json({
      status: 'success',
      length: data.length,
      data: {
        data,
      },
    })
  }
)

const getSingleCustomerByTitle = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const options = {
      headers: {
        authorization: `Bearer ${await helper.getAccessToken()}`,
        'Content-Type': 'application/json',
      },
    }

    console.log(req.params.customerTitle)

    const data = await axios
      .get(
        `${API_DIV_URL}/${API_CUSTOMER_DIVISION}/Contacts?$filter=Title eq '${req.params.customerTitle}'&$select=Account,FirstName,LastName,MiddleName,Email,AccountName,Initials,Phone,Notes,Mobile,AddressLine2,AddressStreet,Country,ID,JobTitleDescription&$expand=Account`,
        options
      )
      .then((resp: ResponseProps) => {
        return resp.data.d.results
      })

      .catch(async (error: Error) => {
        if ((error as any).response.data) {
          await helper.logError(
            'getSingleCustomer',
            (error as any).response.data.error.message.value
          )
          throw new Error((error as any).response.data.error.message.value)
        } else {
          await helper.logError('getSingleCustomer', (error as any).message)
          throw new Error(error.message)
        }
      })

    res.status(200).json({
      status: 'success',
      length: data.length,
      data: {
        data,
      },
    })
  }
)

const getSingleCustomerByID = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const options = {
      headers: {
        authorization: `Bearer ${await helper.getAccessToken()}`,
        'Content-Type': 'application/json',
      },
    }

    const data = await axios
      .get(
        `${API_DIV_URL}/${API_CUSTOMER_DIVISION}/Contacts?$filter=ID eq guid'${req.params.id}'`,
        options
      )
      .then((resp: ResponseProps) => {
        return resp.data.d.results
      })

      .catch(async (error: Error) => {
        if ((error as any).response.data) {
          await helper.logError(
            'getSingleCustomer',
            (error as any).response.data.error.message.value
          )
          throw new Error((error as any).response.data.error.message.value)
        } else {
          await helper.logError('getSingleCustomer', (error as any).message)
          throw new Error(error.message)
        }
      })

    res.status(200).json({
      status: 'success',
      data: {
        data,
      },
    })
  }
)

const getSingleCustomerByAccount = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const options = {
      headers: {
        authorization: `Bearer ${await helper.getAccessToken()}`,
        'Content-Type': 'application/json',
      },
    }

    const data = await axios
      .get(
        `${API_DIV_URL}/${API_CUSTOMER_DIVISION}/Contacts?$filter=Account eq guid'${req.params.id}'`,
        options
      )
      .then((resp: ResponseProps) => {
        return resp.data.d.results
      })

      .catch(async (error: Error) => {
        if ((error as any).response.data) {
          await helper.logError(
            'getSingleCustomer',
            (error as any).response.data.error.message.value
          )
          throw new Error((error as any).response.data.error.message.value)
        } else {
          await helper.logError('getSingleCustomer', (error as any).message)
          throw new Error(error.message)
        }
      })

    res.status(200).json({
      status: 'success',
      data: {
        data,
      },
    })
  }
)

const getBulkCustomers = catchAsync(
  async (_req: Request, res: Response, _next: NextFunction) => {
    console.log('getBulkCustomers')

    const options = {
      headers: {
        authorization: `Bearer ${await helper.getAccessToken()}`,
        'Content-Type': 'application/json',
      },
    }

    let data: any = []
    await axios
      .get(
        `${API_DIV_URL}/bulk/${API_BULK_CUSTOMER_DIVISION}/Contacts?$select=ID,Account,AccountName,AddressLine2,BirthName,BusinessEmail,BusinessPhone,City,Country,Email,FirstName,FullName,Initials,LastName,MiddleName,Mobile,Phone,Postcode,Title`,
        options
      )
      .then(async (resp: ResponseProps) => {
        data = resp?.data?.d?.results

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

                    if (nextResp.data.d.__next) {
                      const next = nextResp.data.d.__next

                      await axios.get(next, options).then((nextResp: ResponseProps) => {
                        const nextData = nextResp.data.d.results
                        data = [...data, ...nextData]
                      })

                      if (nextResp.data.d.__next) {
                        const next = nextResp.data.d.__next

                        await axios.get(next, options).then((nextResp: ResponseProps) => {
                          const nextData = nextResp.data.d.results
                          data = [...data, ...nextData]
                        })

                        if (nextResp.data.d.__next) {
                          const next = nextResp.data.d.__next

                          await axios
                            .get(next, options)
                            .then((nextResp: ResponseProps) => {
                              const nextData = nextResp.data.d.results
                              data = [...data, ...nextData]
                            })

                          if (nextResp.data.d.__next) {
                            const next = nextResp.data.d.__next

                            await axios
                              .get(next, options)
                              .then((nextResp: ResponseProps) => {
                                const nextData = nextResp.data.d.results
                                data = [...data, ...nextData]
                              })

                            if (nextResp.data.d.__next) {
                              const next = nextResp.data.d.__next

                              await axios
                                .get(next, options)
                                .then((nextResp: ResponseProps) => {
                                  const nextData = nextResp.data.d.results
                                  data = [...data, ...nextData]
                                })
                            }
                          }
                        }
                      }
                    }
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
          await helper.logError(
            'getAllCustomers',
            error.response.data.error.message.value
          )
          throw new Error((error as any).response.data.error.message.value)
        }
        helper.logError('getAllCustomers', error.message)
        throw new Error(error.message)
      })

    res.status(200).json({
      status: 'success',
      length: data.length,
      data: {
        data,
      },
    })
  }
)

export default {
  getAllCustomers,
  createCustomer,
  updateCustomerInfo,
  getSingleCustomerByID,
  getSingleCustomerByAccount,
  getSingleCustomerByName,
  getSingleCustomerByFullName,
  getSingleCustomerByTitle,
  getBulkCustomers,
}
