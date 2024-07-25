export const InputField = ({ change, number }) => {
  return (
    <>
      <input name={`foodName.${number}`} onChange={(e) => change(e)} placeholder="enter food name"/>
      <input name={`foodWeight.${number}`} onChange={(e) => change(e)} placeholder="enter food weight"/>
    </>
  );
};
