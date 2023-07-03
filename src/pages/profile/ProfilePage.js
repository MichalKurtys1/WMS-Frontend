import { useDispatch } from "react-redux";
import style from "./ProfilePage.module.css";
import { authActions } from "../../context/auth";
import { useNavigate } from "react-router";

const ProfilePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logoutHandler = () => {
    dispatch(authActions.logOut());
    navigate("/");
  };

  return (
    <div className={style.container}>
      <div className={style.titileBox}>
        <img
          className={style.logoImg}
          src={require("../../assets/logo.png")}
          alt="logo"
        />
        <h1>Panel Użytkownika</h1>
      </div>
      <div>
        <button className={style.logoutBtn} onClick={logoutHandler}>
          Wyloguj
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
