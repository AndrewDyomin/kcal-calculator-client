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
      className: css.fieldArea,
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
        className: css.fieldArea,
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
            targetField.className = `${css.fieldArea} ${css.greenFieldArea}`;
          }
          return newFields;
        });
      } catch (error) {
        console.error('Error fetching food data:', error);
        setFields(prevState => {
          const newFields = [...prevState];
          const targetField = newFields.find(
            f => f.number === Number(targetNumber)
          );
          if (targetField) {
            targetField.className = `${css.fieldArea} ${css.redFieldArea}`;
          }
          return newFields;
        });
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

  const totalProtein = () => {
    return fields.reduce((total, field) => {
      if (field.data && field.foodWeight) {
        const portion =
          Number(field.data.protein) * (Number(field.foodWeight) / 100);
        return total + portion;
      }
      return total;
    }, 0);
  };

  const totalFat = () => {
    return fields.reduce((total, field) => {
      if (field.data && field.foodWeight) {
        const portion =
          Number(field.data.fat) * (Number(field.foodWeight) / 100);
        return total + portion;
      }
      return total;
    }, 0);
  };

  const totalCarbohydrate = () => {
    return fields.reduce((total, field) => {
      if (field.data && field.foodWeight) {
        const portion =
          Number(field.data.carbohydrate) * (Number(field.foodWeight) / 100);
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
            className={n.className}
          >
            <InputField change={changeField} number={n.number} />
          </li>
        ))}
      </ul>
      <button className={css.addFieldBtn} onClick={addField}>+</button>
      <div className={css.weightFieldArea}>
        <label>Total weight
          <input className={`${css.weightField} ${css.fieldArea}`} onChange={e => setTotalWeight(Number(e.target.value))}></input>
        </label>
      </div>
      <p>This is your result:</p>
      <p>Calories: {totalWeight === 0 ? 0 : Math.round(totalCalories() / totalWeight * 100)}kcal / 100g</p>
      <p>Protein: {totalWeight === 0 ? 0 : Math.round(totalProtein() / totalWeight * 100)} / 100g</p>
      <p>Fat: {totalWeight === 0 ? 0 : Math.round(totalFat() / totalWeight * 100)} / 100g</p>
      <p>Carbohydrates: {totalWeight === 0 ? 0 : Math.round(totalCarbohydrate() / totalWeight * 100)} / 100g</p>
    </div>
  );
};
