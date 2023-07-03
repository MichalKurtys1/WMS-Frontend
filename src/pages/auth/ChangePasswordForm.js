import { Form } from "react-final-form";
import Input from "../../components/Input";
import style from "./ChangePasswordForm.module.css";
import { useNavigate } from "react-router";
import { gql, useMutation } from "@apollo/client";
import Spinner from "../../components/Spiner";
import { useState } from "react";

const CHANGE = gql`
  mutation Mutation(
    $oldPassword: String!
    $newPassword: String!
    $token: String!
  ) {
    changePassword(
      oldPassword: $oldPassword
      newPassword: $newPassword
      token: $token
    )
  }
`;

const passwordValidator = (value) => {
  if (!value || value.length < 8) {
    return "Hasło musi posiadać przynajmniej 8 znaków";
  }
  return undefined;
};

const ChangePasswordForm = () => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [changePassword, { loading, error }] = useMutation(CHANGE);
  const [isValid, setIsValid] = useState(true);

  const onSubmit = (values) => {
    console.log(values.newPassword + " " + values.newPasswordRepeat);
    if (values.newPassword === values.newPasswordRepeat) {
      changePassword({
        variables: {
          oldPassword: values.oldPassword,
          newPassword: values.newPassword,
          token: token,
        },
      })
        .then((data) => {
          navigate("/main");
        })
        .catch((err) => {
          console.log(err);
          setIsValid(true);
        });
    }
    setIsValid(false);
  };

  return (
    <Form
      onSubmit={onSubmit}
      render={({ handleSubmit, invalid }) => (
        <form className={style.form} onSubmit={handleSubmit}>
          {loading && (
            <div className={style.spinnerBox}>
              <div className={style.spinner}>
                <Spinner />
              </div>
            </div>
          )}
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
                />
                <Input
                  name="Nowe hasło"
                  type="password"
                  fieldName="newPassword"
                  validator={passwordValidator}
                />
                <Input
                  name="Powtórz nowe hasło"
                  type="password"
                  fieldName="newPasswordRepeat"
                  validator={passwordValidator}
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
