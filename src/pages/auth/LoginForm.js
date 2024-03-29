import { Form } from "react-final-form";
import Input from "../../components/Input";
import style from "./LoginForm.module.css";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { useDispatch } from "react-redux";
import { authActions } from "../../context/auth";
import { useEffect, useState } from "react";
import { BiErrorAlt } from "react-icons/bi";
import { emailValidator, passwordValidator } from "../../utils/inputValidators";
import { LOGIN } from "../../utils/apollo/apolloMutations";
import Loading from "../../components/Loading";

const LoginForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [error, setError] = useState(false);
  const [login, { loading }] = useMutation(LOGIN, {
    onError: (error) => setError(error),
    onCompleted: () => setError(false),
  });

  useEffect(() => {
    dispatch(authActions.logOut());
  }, [dispatch]);

  const onSubmit = (values) => {
    login({
      variables: { email: values.Email, password: values.Password },
    }).then((data) => {
      if (!data.data) return;
      let recivedData = data.data.login;
      dispatch(
        authActions.logIn({
          token: recivedData.token,
          expiresIn: recivedData.expiresIn,
          name: recivedData.firstname + " " + recivedData.lastname,
          position: recivedData.position,
        })
      );
      if (recivedData.firstLogin) {
        navigate("/change-password", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    });
  };

  return (
    <Form
      onSubmit={onSubmit}
      render={({ handleSubmit, invalid }) => (
        <form className={style.form} onSubmit={handleSubmit}>
          {error && error.message !== "INPUT_ERROR" && (
            <div className={style.errorBox}>
              <BiErrorAlt className={style.icon} />
              <span>
                Wystąpił nieoczekiwany problem. Spróbuj ponownie za chwilę.
              </span>
            </div>
          )}
          <Loading state={loading} />
          {!loading && (
            <>
              <h1>Logowanie do systemu</h1>
              <p>Wpisz swój email oraz hasło.</p>
              {error && (
                <span className={style.error}>
                  Podany email lub hasło jest nie poprawny
                </span>
              )}
              <div className={style.inputBox}>
                <Input
                  name="Email"
                  type="text"
                  fieldName="Email"
                  validator={emailValidator}
                  width="100%"
                />
                <Input
                  name="Hasło"
                  type="password"
                  fieldName="Password"
                  validator={passwordValidator}
                  width="100%"
                />
                <button disabled={invalid} type="submit">
                  Zaloguj
                </button>
              </div>
            </>
          )}
        </form>
      )}
    />
  );
};

export default LoginForm;
