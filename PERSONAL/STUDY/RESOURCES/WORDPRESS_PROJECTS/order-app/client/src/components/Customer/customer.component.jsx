import React, { useState, useEffect } from 'react'
import { CustomerContent, Info } from './customer.style'

const Customer = ({ data }) => {
  const [customerData, setCustomerData] = useState({})

  const handleCustomerClick = () => {
    setCustomerData(data)
  }

  const _ref = data.ID.split('-')[0]

  return (
    <CustomerContent
      to={`/details/${_ref}`}
      onClick={() => {
        handleCustomerClick()
        console.log(customerData)
      }}
    >
      <Info>{data.Name}</Info>
      <Info>{data.City ? data.City : ''}</Info>
      <Info>{data.Email ? data.Email : ''}</Info>
    </CustomerContent>
  )
}

export default Customer
