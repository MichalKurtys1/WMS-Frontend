import { Field } from "react-final-form";
import style from "./TextArea.module.css";

const TextArea = ({ name, type, fieldName, validator, initVal, width }) => {
  return (
    <Field name={fieldName} validate={validator} initialValue={initVal || null}>
      {({ input, meta }) => (
        <div className={style.inputBox} style={{ width: width }}>
          <textarea
            style={{
              border: meta.touched && meta.error ? "2px solid #f03a30" : "",
            }}
            id={fieldName}
            type={type}
            min={0}
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

export default TextArea;
