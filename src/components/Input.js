import { Field } from "react-final-form";
import style from "./Input.module.css";

const Input = ({ name, type, fieldName, validator }) => {
  return (
    <Field name={fieldName} validate={validator}>
      {({ input, meta }) => (
        <div className={style.inputBox}>
          <input
            style={{
              border: meta.touched && meta.error ? "2px solid #f03a30" : "",
            }}
            id={fieldName}
            type={type}
            {...input}
          />
          <label for={fieldName}>{name}</label>
          {meta.touched && meta.error && (
            <span className={style.error}>{meta.error}</span>
          )}
        </div>
      )}
    </Field>
  );
};

export default Input;
