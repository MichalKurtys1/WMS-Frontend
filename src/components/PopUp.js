import style from "./PopUp.module.css";

const PopUp = (props) => {
  return (
    <div className={style.popup}>
      <p>{props.message}</p>
      <div className={style.buttons}>
        <button className={style.noBtn} onClick={props.button1Action}>
          {props.button1}
        </button>
        <button className={style.yesBtn} onClick={props.button2Action}>
          {props.button2}
        </button>
      </div>
    </div>
  );
};

export default PopUp;
