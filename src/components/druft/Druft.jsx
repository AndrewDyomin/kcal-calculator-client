import { InputField } from 'components/inputField/InputField';
import { useState } from 'react';

export const Druft = () => {

  const [fieldsCount, setFieldsCount] = useState([1]);

  const addField = () => {
    let num = Number(fieldsCount.length) + 1;
    setFieldsCount(prevState => [ ...prevState, num ])
  }
    console.log(fieldsCount)
  return (
    <div className="container">
      <h2>My druft</h2>
      <ul>
        {fieldsCount.map((n) => (
            <li key={n}>
                <InputField/>
            </li>
        ))}
      </ul>
      <button onClick={addField}>+</button>
      <p>This is your result:</p>
    </div>
  );
};
