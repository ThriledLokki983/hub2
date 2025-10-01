import React from 'react'
import {
  FormField,
  FormFieldLabel,
  FormFieldInput,
  Label,
  Input as InputField,
  SearchButton,
} from '../../Common/styles'

const Input = React.forwardRef(({ label, input, onSearchHandler, inputChangeHandler }, ref) => {

  return (
    <FormField>
        <Label htmlFor={label}>{label}</Label>
        <InputField ref={ref} {...input} onChange={inputChangeHandler}/>
        <SearchButton onClick={onSearchHandler}>Zoek</SearchButton>
    </FormField>
  )
});

export default Input
