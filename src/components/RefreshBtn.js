import { BiRefresh } from "react-icons/bi";
import style from "./RefreshBtn.module.css";
import { useState } from "react";
import Loading from "./Loading";

const RefreshBtn = ({ refetch, setLoading }) => {
  const [isClicked, setIsClicked] = useState(false);

  const refreshHandler = () => {
    setIsClicked(true);
    refetch();

    setTimeout(() => {
      setIsClicked(false);
    }, 200);
  };

  return (
    <>
      <Loading state={isClicked} />
      <button
        className={style.refreshBtn}
        onClick={refreshHandler}
        data-testid="RefreshBtn"
      >
        <BiRefresh className={style.refreshIcon} />
      </button>
    </>
  );
};

export default RefreshBtn;
