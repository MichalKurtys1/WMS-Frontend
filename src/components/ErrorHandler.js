import { useEffect } from "react";
import style from "./ErrorHandler.module.css";
import { useDispatch } from "react-redux";
import { authActions } from "../context/auth";
import { useNavigate } from "react-router";
import { BsX } from "react-icons/bs";

const ErrorHandler = ({ error, width }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (error && error.message && error.message === "NOT_AUTHENTICATED") {
      dispatch(authActions.logOut());
      navigate("/login");
    }
  }, [error, dispatch, navigate]);

  return (
    <>
      {/* <div className={style.errorBox}>
        <BsX className={style.icon} />
        <p>Wystąpił nieoczekiwany problem. Spróbuj ponownie za chwilę.</p>
      </div> */}
      {error && error.message && (
        <div className={style.errorBox}>
          <BsX className={style.icon} />
          {error.message === "SERVER_ERROR" && (
            <p>Wystąpił nieoczekiwany problem. Spróbuj ponownie za chwilę.</p>
          )}
          {error.message === "EMAIL_TAKEN" && (
            <p>Podany adres email jest już zajęty. Porsze podać inny email.</p>
          )}
          {error.message === "INPUT_ERROR" && (
            <p>Wystąpił nieoczekiwany problem. Spróbuj ponownie za chwilę.</p>
          )}
          {error.message !== "INPUT_ERROR" &&
            error.message !== "EMAIL_TAKEN" &&
            error.message !== "SERVER_ERROR" && <p>{error.message}</p>}
        </div>
      )}
    </>
  );
};

export default ErrorHandler;
