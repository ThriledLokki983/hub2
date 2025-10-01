import { useState } from 'react';
import { Select, Label } from '../index';

import PropTypes from 'prop-types';

const TipCalculator = ({ selectOptions }) => {
	const [bill, setBill] = useState(0) // 0
  const [person1, setPerson1] = useState('0') // 0
  const [person2, setPerson2] = useState('0') // 0

  const person1Tip = Math.round((Number(person1) / 100 * Number(bill)));
  const person2Tip = Math.round((Number(person2) / 100 * Number(bill)));
  const tip = ((person1Tip + person2Tip) / 2) || 0;
  const total = Number(bill) + tip;

  const reset = () => {
    setBill(0)
    setPerson1('0')
    setPerson2('0')
  }

	return (
		<section className="container">
      <header>
        <h1>Tip Calculator</h1>
      </header>
      <form className='form'>
       <div className="form__group">
          <Label label="How much was the bill" htmlFor="price" />
          <input value={bill} onChange={(e) => setBill(e.target.value)} type="number" id="price" name="price" />
       </div>

        <div className="form__group">
          <Label label="How did you like the service" htmlFor="person1" />
          <Select
            options={selectOptions}
            id="person1"
            value={person1}
            onChange={(e) => setPerson1(e.currentTarget.value)}
          />
        </div>

        <div className="form__group">
          <Label label="How did your friend like the service" htmlFor="person2" />
          <Select
            options={selectOptions}
            id="person2"
            value={person2}
            onChange={(e) => setPerson2(e.currentTarget.value)}
          />
        </div>

				{bill > 0 ? (
					<>
						<div className="form__group">
							<p>You pay <span>${total}.00 (${bill} + ${tip} tip)</span></p>
						</div>
						<input onClick={reset} type="reset" value="Reset" />
					</>
				) : null }

      </form>
    </section>
	)
};

TipCalculator.propTypes = {
	selectOptions: PropTypes.array.isRequired,
};

export default TipCalculator;