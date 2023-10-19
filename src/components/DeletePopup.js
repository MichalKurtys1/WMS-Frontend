import { BsX } from "react-icons/bs";
import style from "./DeletePopup.module.css";
import { MdCancel } from "react-icons/md";

const PopUp = ({ confirmAction, refuseAction, state }) => {
  return (
    <>
      {state && (
        <div className={style.popup}>
          <MdCancel className={style.icon} />
          <h2>Jesteś pewny?</h2>
          <p>
            Czy jesteś pewien, że chcesz usunąć zaznaczony rekord z systemu?
          </p>
          <div className={style.buttons}>
            <button className={style.noBtn} onClick={refuseAction}>
              <h3>Anuluj</h3>
            </button>
            <button className={style.yesBtn} onClick={confirmAction}>
              <h3>Usuń</h3>
              <BsX className={style.yesIcon} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default PopUp;
