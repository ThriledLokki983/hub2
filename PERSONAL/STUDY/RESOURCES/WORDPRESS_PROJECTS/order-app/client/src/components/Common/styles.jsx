import styled from 'styled-components'

export const Container = styled.main`
  width: min(83%, 150rem);
  margin-inline: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
`

export const Button = styled.button`
  font-size: 1.5rem;
  color: #fff;
  line-height: 1em;
  background: rgba(14, 26, 65, 0.9);
  border: none;
  padding: 2.4rem 3.2rem;
  border-radius: 1.5px;
  text-transform: uppercase;
  transition: all 0.2s ease-in-out;

  &:hover {
    background: rgba(14, 26, 65, 1);
    cursor: pointer;
  }
`

export const SearchButton = styled.button`
  position: absolute;
  right: 0.5rem;
  top: 0.4rem;
  bottom: 0.4rem;
  padding: 0.5rem 2rem;
  font-size: 1.5rem;
  color: #0e1a41;
  cursor: pointer;
  background-color: #fff;
  border-radius: 0;
  border: 1px solid rgba(51, 51, 51, 0.3);
  transition: all 0.2s ease-in-out;

  &:hover {
    background-color: #0e1a41;
    color: #fff;
    outline: none;
  }
`

export const Content = styled.section`
  width: inherit;
  flex: 1;
  margin-inline: auto;
  margin-bottom: 10rem;
  padding: 5rem 3rem 3rem 3rem;
  border: 1px solid rgba(51, 51, 51, 0.1);
  border-radius: 2px;
  box-shadow: 0 1rem 2rem rgb(0 0 0 / 10%);
  height: auto;
`

export const FormContainer = styled.form`
  width: inherit;
`

export const FormField = styled.div`
  position: relative;
  width: 90%;
  margin-inline: auto;
  display: flex;
  align-items: end;

  &:not(:last-child) {
    margin-bottom: 2rem;
  }
`

export const FormFieldLabel = styled.div`
  grid-column: 1/2;
`

export const Label = styled.label`
  flex: 0.25;
  color: #000;
  font-family: 'Cordia';
  align-self: flex-end;
  text-align: left;
`

export const FormFieldInput = styled.div`
  grid-column: 2/3;
  color: inherit;
  font-family: inherit;
`

export const Input = styled.input`
  flex: 1;
  color: black;
  background-color: transparent;
  padding: 1.5rem 3rem;
  font-size: 1.5rem;
  width: 100%;
  border: none;
  border: 1px solid rgba(51, 51, 51, 0.3);
  border-radius: 2px;
  transition: all 0.2s;
  border-bottom: 1px solid rgba(51, 51, 51, 0.3);

  &:focus {
    outline: 0;
    box-shadow: 0 1rem 2rem rgba(0, 0, 0, 0.1);
    border-bottom: 0.1rem solid #333;
  }

  &::-webkit-input-placeholder {
    font: normal lighter 1.8rem 'Cordia';
    color: rgba(51, 51, 51, 0.5);
  }

  .req:focus:invalid {
    border-bottom: 0.1rem solid #ff4500;
  }
`
