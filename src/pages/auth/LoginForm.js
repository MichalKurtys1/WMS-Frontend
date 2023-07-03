import { Form } from "react-final-form";
import Input from "../../components/Input";
import style from "./LoginForm.module.css";
import { useNavigate } from "react-router";
import { gql, useMutation } from "@apollo/client";
import Spinner from "../../components/Spiner";
import { useDispatch } from "react-redux";
import { authActions } from "../../context/auth";

const LOGIN = gql`
  mutation Mutation($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      firstname
      lastname
      token
      firstLogin
      expiresIn
    }
  }
`;

const emailValidator = (value) => {
  if (!value) {
    return "Proszę podać email";
  }
  if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)) {
    return "Nie jest to email";
  }
  return undefined;
};

const passwordValidator = (value) => {
  if (!value || value.length < 8) {
    return "Hasło musi posiadać przynajmniej 8 znaków";
  }
  return undefined;
};

const LoginForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [login, { loading, error }] = useMutation(LOGIN);

  const onSubmit = (values) => {
    login({
      variables: { email: values.Email, password: values.Password },
    })
      .then((data) => {
        dispatch(
          authActions.logIn({
            token: data.data.login.token,
            expiresIn: data.data.login.expiresIn,
            name: data.data.login.firstname + " " + data.data.login.lastname,
          })
        );
        if (data.data.login.firstLogin) {
          navigate("/main/change-password", { replace: true });
        } else {
          navigate("/main", { replace: true });
        }
      })
      .catch((err) => {
        console.log(err);
      });

    navigate("/main", { replace: true });
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
                />
                <Input
                  name="Hasło"
                  type="password"
                  fieldName="Password"
                  validator={passwordValidator}
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
