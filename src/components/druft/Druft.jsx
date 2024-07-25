import { InputField } from 'components/inputField/InputField';
import { useState, useCallback } from 'react';
import debounce from 'lodash/debounce';
import axios from 'axios';

export const Druft = () => {

  axios.defaults.baseURL = 'https://kcal-calculator.onrender.com'

  const [fields, setFields] = useState([{number: 1}]);

  const addField = () => {
    let num = Number(fields.length) + 1;
    setFields(prevState => [ ...prevState, {number: num} ])
  }

  const debouncedChangeField = debounce(async(event) => {
    const value = event.target.value;
    const targetName = event.target.name.split('.')[0]
    const targetNumber = event.target.name.split('.')[1]
    console.log(targetName, targetNumber, ": ", value);
    if (targetName === 'foodName' && value !== '') {
      const response = await axios.post('/api/ingredients/food', {
          item: `${value}`
      })
      const targetField = fields.filter((f) => (f.number === targetNumber))[0]
    }
  }, 2000);

  console.log(fields)

  const changeField = useCallback((event) => {
    event.persist();
    debouncedChangeField(event);
  }, [debouncedChangeField]);

  return (
    <div className="container">
      <h2>My druft</h2>
      <ul>
        {fields.map((n) => (
            <li key={n.number}>
                <InputField change={changeField} number={n.number}/>
            </li>
        ))}
      </ul>
      <button onClick={addField}>+</button>
      <p>This is your result:</p>
    </div>
  );
};
