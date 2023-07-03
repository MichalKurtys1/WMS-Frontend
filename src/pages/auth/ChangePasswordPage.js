import ChangePasswordForm from "./ChangePasswordForm";
import style from "./ChangePasswordPage.module.css";

const ChangePasswordPage = () => {
  return (
    <div className={style.container}>
      <div className={style.titileBox}>
        <img
          className={style.logoImg}
          src={require("../../assets/logo.png")}
          alt="logo"
        />
        <h1>Zmaina hasła</h1>
      </div>
      <div className={style.formBox}>
        <ChangePasswordForm />
      </div>
    </div>
  );
};

export default ChangePasswordPage;
