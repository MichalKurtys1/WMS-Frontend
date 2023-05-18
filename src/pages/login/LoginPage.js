import LoginForm from "./LoginForm";
import style from "../login/LoginPage.module.css";

const LoginPage = () => {
  return (
    <div className={style.container}>
      <img
        className={style.logoImg}
        src={require("../../assets/logo.png")}
        alt="logo"
      />
      <div className={style.formBox}>
        <LoginForm />
      </div>
      <div className={style.imageBox}>
        <img src={require("../../assets/login_page_img.jpg")} alt="magazyn" />
        <div className={style.opacity}></div>
      </div>
    </div>
  );
};

export default LoginPage;
