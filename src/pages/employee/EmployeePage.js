import { useNavigate } from "react-router";
import Table from "../../components/Table";
import style from "./EmployeePage.module.css";
import {
  FaUserCog,
  FaUserEdit,
  FaUserPlus,
  FaUserMinus,
  FaEnvelope,
} from "react-icons/fa";
const EmployeePage = () => {
  const navigate = useNavigate();

  const optionHandler = (type) => {
    console.log(type);
    navigate(`/main/employees/${type}`);
  };

  const messageHandler = () => {
    navigate("/main/messages");
  };

  return (
    <div className={style.container}>
      <div className={style.titileBox}>
        <img
          className={style.logoImg}
          src={require("../../assets/logo.png")}
          alt="logo"
        />
        <h1>Pracownicy</h1>
      </div>
      <main>
        <div className={style.optionPanel}>
          <div onClick={() => optionHandler("add")}>
            <FaUserPlus className={style.icon} />
          </div>
          <div onClick={() => optionHandler("delete")}>
            <FaUserMinus className={style.icon} />
          </div>
          <div onClick={() => optionHandler("edit")}>
            <FaUserEdit className={style.icon} />
          </div>
          <div onClick={() => optionHandler("info")}>
            <FaUserCog className={style.icon} />
          </div>
          <div onClick={messageHandler}>
            <FaEnvelope className={style.icon} />
          </div>
        </div>
        <div>
          <Table />
        </div>
      </main>
    </div>
  );
};

export default EmployeePage;
