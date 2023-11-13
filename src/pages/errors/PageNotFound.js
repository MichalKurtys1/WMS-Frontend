import { useNavigate, useRouteError } from "react-router";
import style from "./PageNotFound.module.css";

const PageNotFound = () => {
  const navigate = useNavigate();
  let error = useRouteError();
  const clickHandler = () => {
    navigate("/");
  };

  return (
    <>
      {error.statusText === "Not Found" && (
        <div className={style.container}>
          <div className={style.errorBox}>
            <div className={style.box}>
              <p>
                <strong>404</strong> - Not Found
              </p>
            </div>
            <span>
              Przepraszamy ale nie jesteśmy w stanie znaleźć tej strony.
            </span>
            <button onClick={clickHandler}>Strona Główna</button>
          </div>
        </div>
      )}
      {error.statusText !== "Not Found" && (
        <div className={style.container}>
          <div className={style.errorBox}>
            <div className={style.box}>
              <p>
                <strong>Wystąpił nieoczekiwany problem</strong>
              </p>
            </div>
            <span>Prosimy wrócić do strony głównej.</span>
            <button onClick={clickHandler}>Strona Główna</button>
          </div>
        </div>
      )}
    </>
  );
};

export default PageNotFound;
