import { Field } from "react-final-form";
import style from "./Input.module.css";

const Input = ({
  name,
  type,
  fieldName,
  validator,
  initVal,
  width,
  margin,
  min,
}) => {
  return (
    <Field name={fieldName} validate={validator} initialValue={initVal || null}>
      {({ input, meta }) => (
        <div className={style.inputBox} style={{ width: width }}>
          <input
            style={{
              border: meta.touched && meta.error ? "2px solid #f03a30" : "",
              marginBottom: !margin ? "40px" : "0",
            }}
            id={fieldName}
            type={type}
            min={min}
            placeholder={name}
            {...input}
          />
          {meta.touched && meta.error && (
            <span className={style.error}>{meta.error}</span>
          )}
        </div>
      )}
    </Field>
  );
};

export default Input;
