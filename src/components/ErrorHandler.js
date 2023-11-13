import { useEffect, useState } from "react";
import style from "./ErrorHandler.module.css";
import { useDispatch } from "react-redux";
import { authActions } from "../context/auth";
import { useNavigate } from "react-router";
import { BsX } from "react-icons/bs";
import { BiErrorAlt } from "react-icons/bi";

const ErrorHandler = ({ error, width }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState();

  useEffect(() => {
    if (error?.message) {
      setErrorMsg(error.message || "UNDEFINED_ERROR");
    }
    if (error?.message && error?.message.includes("NOT_AUTHENTICATED")) {
      dispatch(authActions.logOut());
      navigate("/login");
    }
  }, [error, dispatch, navigate]);

  const cancelHandler = () => {
    setErrorMsg(undefined);
  };

  return (
    <>
      {errorMsg && (
        <div className={style.errorBox} data-testid="ErrorComponent">
          <BiErrorAlt className={style.icon} />
          <BsX className={style.iconCancel} onClick={cancelHandler} />
          {errorMsg === "NOT_ENOUGH_PRODUCTS" && (
            <p>Nie wystarczająca ilość produktów. Uzupełnij magazyn.</p>
          )}
          {(errorMsg === "SERVER_ERROR" ||
            errorMsg === "Failed to fetch" ||
            errorMsg === "INPUT_ERROR") && (
            <p>Wystąpił nieoczekiwany problem. Spróbuj ponownie za chwilę.</p>
          )}
          {errorMsg === "EMAIL_TAKEN" && (
            <p>Podany adres email jest już zajęty. Porsze podać inny email.</p>
          )}
          {errorMsg.includes("NOT_AUTHENTICATED") && (
            <p>Odmowa dostępu. Zaloguj się ponownie.</p>
          )}
          {errorMsg !== "INPUT_ERROR" &&
            errorMsg !== "EMAIL_TAKEN" &&
            errorMsg !== "SERVER_ERROR" &&
            errorMsg !== "NOT_ENOUGH_PRODUCTS" &&
            errorMsg !== "Failed to fetch" &&
            !errorMsg.includes("NOT_AUTHENTICATED") && <p>{errorMsg}</p>}
        </div>
      )}
    </>
  );
};

export default ErrorHandler;
