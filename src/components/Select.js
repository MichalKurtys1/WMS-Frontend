import { Field } from "react-final-form";
import style from "./Select.module.css";

const Select = ({ name, fieldName, validator, initVal, options, title }) => {
  return (
    <Field name={fieldName} validate={validator} initialValue={initVal || null}>
      {({ input, meta }) => (
        <div className={style.selectBox}>
          <select
            id={fieldName}
            className={style.select}
            style={{
              border: meta.touched && meta.error ? "2px solid #f03a30" : "",
            }}
            {...input}
          >
            {options.map((option) => {
              if (option.name === initVal) {
                return (
                  <option selected value={option.value}>
                    {option.name}
                  </option>
                );
              } else {
                return <option value={option.value}>{option.name}</option>;
              }
            })}
          </select>
          {meta.touched && meta.error && (
            <span className={style.error}>{meta.error}</span>
          )}
        </div>
      )}
    </Field>
  );
};

export default Select;
