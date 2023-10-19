import { FaCheck } from "react-icons/fa";
import style from "./SuccessMsg.module.css";
import { BsX } from "react-icons/bs";
import { useEffect, useState } from "react";

const SuccessMsg = ({ msg, state }) => {
  const [msgState, setMsgState] = useState(state);

  useEffect(() => {
    setMsgState(state);
  }, [state]);

  const cancelHandler = () => {
    setMsgState(false);
  };

  return (
    <>
      {msgState && (
        <div className={style.succes}>
          <BsX className={style.iconCancel} onClick={cancelHandler} />
          <FaCheck className={style.checkIcon} />
          <p>{msg}</p>
        </div>
      )}
    </>
  );
};

export default SuccessMsg;
