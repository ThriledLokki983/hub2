import React, { useRef } from 'react'
import {
  FormField,
  FormFieldLabel,
  FormFieldInput,
  Label,
  Input,
  SearchButton,
} from './styles'

const FormGroup = ({ labelTitle, inputType, placeholder }) => {
  const searchInputValue = useRef('')

  return (
    <FormField>
      <FormFieldLabel>
        <Label>{labelTitle}</Label>
      </FormFieldLabel>
      <FormFieldInput className="pos-rel">
        <Input type={inputType} placeholder={placeholder} ref={searchInputValue} />
        <SearchButton
          onClick={() => {
            console.log('hello')
          }}
        >
          Zoek
        </SearchButton>
      </FormFieldInput>
    </FormField>
  )
}

export default FormGroup
