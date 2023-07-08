import { useEffect, useState } from "react";
import { BsThreeDotsVertical, BsTrashFill, BsGearFill } from "react-icons/bs";
import { FaPen, FaEnvelope } from "react-icons/fa";
import style from "./TableRow.module.css";

const TableRow = (props) => {
  const [isClicked, setIsClicked] = useState(false);

  useEffect(() => {
    if (props.selectedRow !== props.id) {
      setIsClicked(false);
    }
  }, [props.selectedRow, props.id]);

  const clickHandler = () => {
    if (isClicked) {
      setIsClicked(false);
    } else {
      setIsClicked(true);
      props.selectedRowHandler(props.id);
    }
  };

  return (
    <tr className={style.tr} key={props.id}>
      {props.keys.map((value) => {
        if (value === "id") return null;
        return <td key={`${props.id}-${value}`}>{props.record[value]}</td>;
      })}
      <td key="options" onClick={clickHandler}>
        <BsThreeDotsVertical />
        {isClicked && (
          <div className={style.options}>
            <div
              className={style.option}
              onClick={() => props.editHandler(props.id)}
            >
              <FaPen className={style.icon} />
              <p>Edytuj</p>
            </div>
            <div
              className={style.option}
              onClick={() => props.deleteHandler(props.id)}
            >
              <BsTrashFill className={style.icon} />
              <p>Usuń</p>
            </div>
            <div
              className={style.option}
              onClick={() => props.messageHandler(props.id)}
            >
              <FaEnvelope className={style.icon} />
              <p>Wiadomość</p>
            </div>
            <div
              className={style.option}
              onClick={() => props.detailsHandler(props.id)}
            >
              <BsGearFill className={style.icon} />
              <p>Szczegóły</p>
            </div>
          </div>
        )}
      </td>
    </tr>
  );
};

export default TableRow;
