import { useNavigate } from "react-router";
import style from "./PageNotFound.module.css";

const PageNotFound = () => {
  const navigate = useNavigate();

  const clickHandler = () => {
    navigate("/main");
  };

  return (
    <div className={style.container}>
      <div className={style.errorBox}>
        <div className={style.box}>
          <h1>404</h1>
          <p>- Not Found</p>
        </div>
        <p>Przepraszamy ale nie jesteśmy w stanie znaleźć tej strony.</p>
        <button onClick={clickHandler}>Strona Główna</button>
      </div>
    </div>
  );
};

export default PageNotFound;
