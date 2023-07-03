import style from "./Spiner.module.css";

const Spinner = () => {
  return (
    <>
      <div className={style.container}>
        <div className={style.loader}></div>
      </div>
    </>
  );
};

export default Spinner;
