import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Content } from '../Common/styles'
import { Results, ButtonBox } from './search.style'
import { Button } from '../Common/styles'

import Input from '../UI/Input/Input'
import Customer from '../Customer/customer.component'

// import { useCustomersApi } from "../../api"

const Search = ({ setCustomers }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const inputRef = useRef();

  const handleInputChange = useCallback(() => {
    const { value } = inputRef.current
    setSearchTerm(value)
  }, [])

  const handleCustomerSearch = useCallback((e) => {
    inputRef.current.value = ''

    console.log(searchTerm);
}, [searchTerm])

//   const { customers } = useCustomerApi(searchTerm);
let customers = []

  useEffect(() => {
      if (customers) {
          if (customers.status === 'success' && customers.length > 0) {
            setCustomers(customers?.data?.data)
          }
    }
  }, [customers])


  return (
    <Content>
        <Input
          ref={inputRef}
          label="Klant"
          input={{
            id: 'klant_' + Math.random() * 100 + 1,
            type: 'text',
            placeholder: 'Zoek naar een klant',
          }}
          inputChangeHandler={debounce(handleInputChange, 1000)}
          onSearchHandler={handleCustomerSearch}
        />
      <ButtonBox>
        <Button>Nieuwe klant</Button>
      </ButtonBox>
    </Content>
  )
}

export default Search

function debounce(func, delay) {
    var timeout;

    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), delay);
    };
}
