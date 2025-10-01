import { TipCalculator } from './components'
import './App.css'

const selectOptions = [
	{ value: '5', label: 'Dissatisfied (0%)' },
	{ value: '5', label: 'It was okay (5%)' },
	{ value: '10', label: 'It was good (10%)' },
	{ value: '20', label: 'Absolutely amazing! (20%)' },
]

function App() {
  return <TipCalculator selectOptions={selectOptions} />
}

export default App

