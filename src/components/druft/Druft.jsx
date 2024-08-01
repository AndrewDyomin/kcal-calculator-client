import { InputField } from 'components/inputField/InputField';
import { useState, useCallback } from 'react';
import css from './Druft.module.css';
import debounce from 'lodash/debounce';
import axios from 'axios';

axios.defaults.baseURL = 'https://kcal-calculator.onrender.com';

export const Druft = () => {
  const [fields, setFields] = useState([
    {
      number: 1,
      foodName: '',
      foodWeight: '',
      data: null,
      className: 'field-area',
    },
  ]);

  const [totalWeight, setTotalWeight] = useState(0);

  const addField = () => {
    setFields(prevState => [
      ...prevState,
      {
        number: prevState.length + 1,
        foodName: '',
        foodWeight: '',
        data: null,
        className: 'field-area',
      },
    ]);
  };

  const debouncedChangeField = debounce(async event => {
    const { value, name } = event.target;
    const [targetName, targetNumber] = name.split('.');

    setFields(prevState => {
      const newFields = [...prevState];
      const targetField = newFields.find(
        f => f.number === Number(targetNumber)
      );

      if (targetField) {
        if (targetName === 'foodName') {
          targetField.foodName = value;
        } else if (targetName === 'foodWeight') {
          targetField.foodWeight = value;
        }
      }

      return newFields;
    });

    if (targetName === 'foodName' && value !== '') {
      try {
        const response = await axios.post('/api/ingredients/food', {
          item: value,
        });
        setFields(prevState => {
          const newFields = [...prevState];
          const targetField = newFields.find(
            f => f.number === Number(targetNumber)
          );
          if (targetField) {
            targetField.data = response.data;
            targetField.className = 'green-field-area';
          }
          return newFields;
        });
      } catch (error) {
        console.error('Error fetching food data:', error);
      }
    }
  }, 2000);

  const changeField = useCallback(
    event => {
      event.persist();
      debouncedChangeField(event);
    },
    [debouncedChangeField]
  );

  const totalCalories = () => {
    return fields.reduce((total, field) => {
      if (field.data && field.foodWeight) {
        const portion =
          Number(field.data.calories) * (Number(field.foodWeight) / 100);
        return total + portion;
      }
      return total;
    }, 0);
  };

  return (
    <div className={css.container}>
      <h2 className={css.title}>My druft</h2>
      <ul className={css.fieldsList}>
        {fields.map(n => (
          <li
            key={n.number}
            className={
              n.className === 'field-area' ? css.fieldArea : `${css.fieldArea} ${css.greenFieldArea}`
            }
          >
            <InputField change={changeField} number={n.number} />
          </li>
        ))}
      </ul>
      <button className={css.addFieldBtn} onClick={addField}>+</button>
      <div className={css.weightField}>
        <label>Total weight
          <input onChange={e => setTotalWeight(Number(e.target.value))}></input>
        </label>
      </div>
      <p>This is your result:</p>
      <p>Total colories: {totalWeight === 0 ? 0 : Math.round(totalCalories() / totalWeight * 100)}kcal / 100g</p>
    </div>
  );
};
