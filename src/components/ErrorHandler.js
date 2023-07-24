import { useEffect } from "react";
import style from "./ErrorHandler.module.css";
import { useDispatch } from "react-redux";
import { authActions } from "../context/auth";
import { useNavigate } from "react-router";

const ErrorHandler = ({ error }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (error && error.message && error.message === "NOT_AUTHENTICATED") {
      dispatch(authActions.logOut());
      navigate("/");
    }
  }, [error, dispatch, navigate]);

  return (
    <>
      {error && error.message && (
        <div className={style.errorBox}>
          {error.message === "SERVER_ERROR" && (
            <p>Wystąpił nieoczekiwany problem. Spróbuj ponownie za chwilę.</p>
          )}
          {error.message === "EMAIL_TAKEN" && (
            <p>Podany adres email jest już zajęty. Porsze podać inny email.</p>
          )}
          {error.message === "INPUT_ERROR" && (
            <p>
              Wystąpił nieoczekiwany problem przy wysyłaniu danych. Spróbuj
              ponownie za chwilę.
            </p>
          )}
        </div>
      )}
    </>
  );
};

export default ErrorHandler;
