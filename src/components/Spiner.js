import style from "./Spiner.module.css";

const Spinner = () => {
  return (
    <>
      <div className={style.spinnerBox}>
        <div className={style.spinner}>
          <div className={style.container}>
            <div className={style.loader}></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Spinner;
