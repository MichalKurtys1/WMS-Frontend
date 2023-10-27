import { FaAngleLeft } from "react-icons/fa";
import style from "./Header.module.css";
import { useNavigate } from "react-router";

const Header = ({ path }) => {
  const navigate = useNavigate();

  return (
    <div className={style.titileBox}>
      <img
        className={style.logoImg}
        src={require("./../assets/logo.png")}
        alt="logo"
      />
      <div className={style.returnBox}>
        <FaAngleLeft className={style.icon} onClick={() => navigate(path)} />
        <p onClick={() => navigate(path)}>Powrót</p>
      </div>
    </div>
  );
};

export default Header;
