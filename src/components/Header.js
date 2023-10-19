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
      <div className={style.returnBox} onClick={() => navigate(path)}>
        <FaAngleLeft className={style.icon} />
        <p>Powrót</p>
      </div>
    </div>
  );
};

export default Header;
