import { BsCheck, BsExclamationCircleFill } from "react-icons/bs";
import style from "./StatePopup.module.css";

const PopUp = ({ confirmAction, refuseAction, state }) => {
  return (
    <>
      {state && (
        <div className={style.popup}>
          <BsExclamationCircleFill className={style.icon} />
          <h2>Jesteś pewny?</h2>
          <p>
            Czy jesteś pewien, że chcesz zmienić stan tego rekordu? Tej akcji
            nie da się odwrócić.
          </p>
          <div className={style.buttons}>
            <button className={style.noBtn} onClick={refuseAction}>
              <h3>Anuluj</h3>
            </button>
            <button className={style.yesBtn} onClick={confirmAction}>
              <h3>Potwierdź</h3>
              <BsCheck className={style.yesIcon} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default PopUp;
