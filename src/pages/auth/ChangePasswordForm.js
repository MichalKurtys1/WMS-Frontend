import { Form } from "react-final-form";
import Input from "../../components/Input";
import style from "./ChangePasswordForm.module.css";
import { useNavigate } from "react-router";
import { useMutation } from "@apollo/client";
import Loading from "../../components/Loading";
import { useState } from "react";
import { getAuth } from "../../context/index";
import ErrorHandler from "../../components/ErrorHandler";
import { passwordValidator } from "../../utils/inputValidators";
import { UPDATE_PASSWORD } from "../../utils/apollo/apolloMutations";

const ChangePasswordForm = () => {
  const { token } = getAuth();
  const navigate = useNavigate();
  const [changePassword, { loading, error }] = useMutation(UPDATE_PASSWORD);
  const [isValid, setIsValid] = useState(true);

  const onSubmit = (values) => {
    if (values.newPassword === values.newPasswordRepeat) {
      changePassword({
        variables: {
          oldPassword: values.oldPassword,
          newPassword: values.newPassword,
          token: token,
        },
      }).then((data) => {
        if (!data.data) return;
        setIsValid(true);
        navigate("/");
      });
    }
    setIsValid(false);
  };

  return (
    <Form
      onSubmit={onSubmit}
      render={({ handleSubmit, invalid }) => (
        <form className={style.form} onSubmit={handleSubmit}>
          <ErrorHandler error={error} width={"100%"} />
          <Loading state={loading} />
          {!loading && (
            <>
              <h1>Zmiana hasła</h1>
              <p>Wpisz swoje obecne hasło, a następnie nowe.</p>
              {error && (
                <span className={style.error}>
                  Stare hasło nie jest poprawne
                </span>
              )}
              {!isValid && (
                <span className={style.error}>Hasło powtórzone błędnie</span>
              )}
              <div className={style.inputBox}>
                <Input
                  name="Stare hasło"
                  type="password"
                  fieldName="oldPassword"
                  validator={passwordValidator}
                  width={"100%"}
                />
                <Input
                  name="Nowe hasło"
                  type="password"
                  fieldName="newPassword"
                  validator={passwordValidator}
                  width={"100%"}
                />
                <Input
                  name="Powtórz nowe hasło"
                  type="password"
                  fieldName="newPasswordRepeat"
                  validator={passwordValidator}
                  width={"100%"}
                />
                <button disabled={invalid} type="submit">
                  Zmień
                </button>
              </div>
            </>
          )}
        </form>
      )}
    />
  );
};

export default ChangePasswordForm;
