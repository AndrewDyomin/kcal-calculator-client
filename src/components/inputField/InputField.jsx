import css from './InputField.module.css'

export const InputField = ({ change, number }) => {
  return (
    <>
      <input className={css.input} name={`foodName.${number}`} onChange={(e) => change(e)} placeholder="enter food name"/>
      <input className={css.input} name={`foodWeight.${number}`} onChange={(e) => change(e)} placeholder="enter food weight"/>
    </>
  );
};
