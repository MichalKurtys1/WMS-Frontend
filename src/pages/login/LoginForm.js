import { Form } from "react-final-form";
import Input from "../../components/Input";
import style from "./LoginForm.module.css";
import { useNavigate } from "react-router";

const loginValidator = (value) => {
  if (!value || value.length < 8) {
    return "Login musi posiadać przynajmniej 8 znaków";
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
  const navigate = useNavigate();

  const onSubmit = (values) => {
    navigate("/main");
  };

  return (
    <Form
      onSubmit={onSubmit}
      render={({ handleSubmit, invalid }) => (
        <form className={style.form} onSubmit={handleSubmit}>
          <h1>Logowanie do systemu</h1>
          <p>Wpisz swoją nazwę użytkownika oraz hasło.</p>
          <div className={style.inputBox}>
            <Input
              name="Login"
              type="text"
              fieldName="Login"
              validator={loginValidator}
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
        </form>
      )}
    />
  );
};

export default LoginForm;
