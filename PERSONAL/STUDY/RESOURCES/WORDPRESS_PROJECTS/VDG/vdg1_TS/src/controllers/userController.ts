/** @format */
import { Request, Response, NextFunction } from 'express'
import url from 'url'
import axios from 'axios'
import catchAsync from '../utils/catchAsync'
import { ResponseProps } from '../utils/devTypes'
import { API_BASE_URL } from '../utils/secrets'
import code from '../utils/helpers'

const getMyDetails = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const params = new URLSearchParams({
      select: 'USERID',
      ...url.parse(req.url, true).query,
    })

    const data = await fetchData(`${API_BASE_URL}${params}`)

    res.status(200).json({
      status: 'success',
      data,
    })
  }
)

const getMyProdDetails = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const params = new URLSearchParams({
      select: 'USERID',
      ...url.parse(req.url, true).query,
    })

    const data = await fetchData(`${API_BASE_URL}${params}`)

    res.status(200).json({
      status: 'success',
      data,
    })
  }
)

const getAllSystemDivisions = catchAsync(
  async (_req: Request, res: Response, _next: NextFunction) => {
    console.log('inside getAllSystemDivisions')

    // const sysAllDivisions = 'system/allDivisions'
    const sysAllDivisions = 'system/Divisions'

    const data = await fetchData(`${API_BASE_URL}/${sysAllDivisions}`)

    res.status(200).json({
      status: 'success',
      data,
    })
  }
)

const getAllHrmDivisions = catchAsync(
  async (_req: Request, res: Response, _next: NextFunction) => {
    console.log('inside getAllHrmDivisions')

    const data = await fetchData(`${API_BASE_URL}/hrm/Divisions`)

    res.status(200).json({
      status: 'success',
      data,
    })
  }
)

const fetchData = async (url: string) => {
  const options = {
    headers: {
      authorization: `Bearer ${await code.getAccessToken()}`,
      'Content-Type': 'application/json',
    },
  }

  const data = await axios
    .get(`${url}`, options)
    .then((resp: ResponseProps) => {
      return resp.data.d
    })
    .catch((err: Error) => {
      console.log(err)

      // throw new Error(err.message)
    })

  return await data
}

export default {
  getMyDetails,
  getAllSystemDivisions,
  getAllHrmDivisions,
  getMyProdDetails,
}
