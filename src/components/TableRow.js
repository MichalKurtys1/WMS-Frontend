import { useEffect, useState } from "react";
import {
  BsThreeDotsVertical,
  BsTrashFill,
  BsGearFill,
  BsFillTriangleFill,
  BsCheckCircleFill,
  BsBuildingFillCheck,
  BsFillBoxFill,
} from "react-icons/bs";
import { IoLocationSharp } from "react-icons/io5";
import {
  FaAngleDown,
  FaAngleUp,
  FaClipboardList,
  FaFileInvoice,
  FaPen,
  FaTruckLoading,
  FaTruckMoving,
} from "react-icons/fa";
import style from "./TableRow.module.css";

const TableRow = (props) => {
  const [isClicked, setIsClicked] = useState(false);
  const [isClickedRow, setIsClickedRow] = useState(false);

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

  const clickRowHandler = () => {
    if (isClickedRow) {
      setIsClickedRow(false);
    } else {
      setIsClickedRow(true);
    }
  };

  return (
    <>
      <tr className={style.tr} key={props.id} onClick={clickRowHandler}>
        {props.keys.map((value) => {
          if (value === "id") return null;
          return (
            <td key={`${props.id}-${value}`}>{props.record[value] || "-"}</td>
          );
        })}
        {!props.allowExpand && (
          <td key="options" onClick={clickHandler}>
            <BsThreeDotsVertical />
            {isClicked && (
              <div className={style.options}>
                <BsFillTriangleFill className={style.triangleIcon} />
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
                {props.details && (
                  <div
                    className={style.option}
                    onClick={() => props.detailsHandler(props.id)}
                  >
                    <BsGearFill className={style.icon} />
                    <p>Szczegóły</p>
                  </div>
                )}
              </div>
            )}
          </td>
        )}
        {props.allowExpand && (
          <td key="options" onClick={clickHandler}>
            {isClickedRow && <FaAngleUp />}
            {!isClickedRow && <FaAngleDown />}
          </td>
        )}
      </tr>
      {isClickedRow && props.allowExpand && props.type === "Delivery" && (
        <tr className={style.detailsRow} key={props.id + "_1"}>
          <td colspan="6">
            <div className={style.wrapper}>
              <div className={style.details}>
                {props.products &&
                  JSON.parse(JSON.parse(props.products)).map((item) => (
                    <div className={style.productBox}>
                      <h4>{item.product}</h4>
                      <div className={style.numbersBox}>
                        <p>
                          <strong>{item.quantity}x</strong> {item.unit}
                        </p>
                        <p>
                          Dostarczono: <strong>{item.delivered}</strong>
                        </p>

                        <p>
                          Uszkodzonych: <strong>{item.damaged}</strong>
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
              <div className={style.optionsBox}>
                <button
                  onClick={() => props.updateStateHandler(props.id, "Odebrano")}
                  style={{
                    pointerEvents:
                      props.record["state"] === "Odebrano" ||
                      props.record["state"] === "Posortowano" ||
                      props.record["state"] === "Rozlokowano"
                        ? "none"
                        : "all",
                  }}
                >
                  <FaTruckLoading
                    className={style.iconReverse}
                    style={{
                      color:
                        props.record["state"] === "Odebrano" ||
                        props.record["state"] === "Posortowano" ||
                        props.record["state"] === "Rozlokowano"
                          ? "#3054F2"
                          : null,
                    }}
                  />
                  <div className={style.tooltip}>
                    <p>Odebrano</p>
                  </div>
                </button>
                <button
                  onClick={() =>
                    props.updateStateHandler(props.id, "Posortowano")
                  }
                  disabled={
                    props.record["state"] === "Posortowano" ||
                    props.record["state"] === "Rozlokowano" ||
                    props.record["state"] === "Zamówiono"
                      ? true
                      : false
                  }
                  style={{
                    pointerEvents:
                      props.record["state"] === "Posortowano" ||
                      props.record["state"] === "Rozlokowano" ||
                      props.record["state"] === "Zamówiono"
                        ? "none"
                        : "all",
                  }}
                >
                  <FaClipboardList
                    className={style.icon}
                    style={{
                      color:
                        props.record["state"] === "Posortowano" ||
                        props.record["state"] === "Rozlokowano"
                          ? "#3054F2"
                          : null,
                    }}
                  />
                  <div className={style.tooltip}>
                    <p>Posortowano</p>
                  </div>
                </button>
                <button
                  onClick={() =>
                    props.updateStateHandler(props.id, "Rozlokowano")
                  }
                  disabled={
                    props.record["state"] === "Rozlokowano" ||
                    props.record["state"] === "Zamówiono" ||
                    props.record["state"] === "Odebrano"
                      ? true
                      : false
                  }
                  style={{
                    pointerEvents:
                      props.record["state"] === "Rozlokowano" ||
                      props.record["state"] === "Zamówiono" ||
                      props.record["state"] === "Odebrano"
                        ? "none"
                        : null,
                  }}
                >
                  <IoLocationSharp
                    className={style.icon}
                    style={{
                      color:
                        props.record["state"] === "Rozlokowano"
                          ? "#3054F2"
                          : null,
                    }}
                  />
                  <div className={style.tooltip}>
                    <p>Rozmieszczono</p>
                  </div>
                </button>
                <button
                  onClick={() => props.detailsHandler(props.id)}
                  disabled={
                    props.record["state"] === "Odebrano" ||
                    props.record["state"] === "Zamówiono" ||
                    props.record["state"] === "Posortowano"
                      ? true
                      : false
                  }
                  style={{
                    pointerEvents:
                      props.record["state"] === "Odebrano" ||
                      props.record["state"] === "Zamówiono" ||
                      props.record["state"] === "Posortowano"
                        ? "none"
                        : null,
                  }}
                >
                  <FaFileInvoice className={style.icon} />
                  <div className={style.tooltip}>
                    <p>Dodaj fakturę</p>
                  </div>
                </button>
                <button
                  onClick={() => props.editHandler(props.id)}
                  disabled={
                    props.record["state"] === "Odebrano" ||
                    props.record["state"] === "Posortowano" ||
                    props.record["state"] === "Rozlokowano"
                      ? true
                      : false
                  }
                  style={{
                    pointerEvents:
                      props.record["state"] === "Odebrano" ||
                      props.record["state"] === "Posortowano" ||
                      props.record["state"] === "Rozlokowano"
                        ? "none"
                        : "all",
                  }}
                >
                  <FaPen className={style.icon} />
                  <div className={style.tooltip}>
                    <p>Edytuj</p>
                  </div>
                </button>
                <button
                  onClick={() => props.deleteHandler(props.id)}
                  disabled={
                    props.record["state"] === "Odebrano" ||
                    props.record["state"] === "Posortowano" ||
                    props.record["state"] === "Rozlokowano"
                      ? true
                      : false
                  }
                  style={{
                    pointerEvents:
                      props.record["state"] === "Odebrano" ||
                      props.record["state"] === "Posortowano" ||
                      props.record["state"] === "Rozlokowano"
                        ? "none"
                        : "all",
                  }}
                >
                  <BsTrashFill className={style.icon} />
                  <div className={style.tooltip}>
                    <p>Usuń</p>
                  </div>
                </button>
              </div>
            </div>
          </td>
        </tr>
      )}
      {isClickedRow && props.allowExpand && props.type === "Orders" && (
        <tr className={style.detailsRow} key={props.id + "_1"}>
          <td colspan="6">
            <div className={style.wrapper}>
              <div className={style.details}>
                {props.products &&
                  JSON.parse(JSON.parse(props.products)).map((item) => (
                    <div className={style.productBox}>
                      <h4>{item.product}</h4>
                      <div className={style.numbersBox}>
                        <p>
                          <strong>{item.quantity}x</strong> {item.unit}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
              <div className={style.optionsBox}>
                <button
                  onClick={() =>
                    props.updateStateHandler(props.id, "Potwierdzono")
                  }
                  style={{
                    pointerEvents:
                      props.record["state"] === "Potwierdzono" ||
                      props.record["state"] === "Skompletowano" ||
                      props.record["state"] === "Do wysyłki" ||
                      props.record["state"] === "Dostarczono" ||
                      props.record["state"] === "Wysłano"
                        ? "none"
                        : "all",
                  }}
                >
                  <BsCheckCircleFill
                    className={style.icon}
                    style={{
                      color:
                        props.record["state"] === "Potwierdzono" ||
                        props.record["state"] === "Skompletowano" ||
                        props.record["state"] === "Do wysyłki" ||
                        props.record["state"] === "Dostarczono" ||
                        props.record["state"] === "Wysłano"
                          ? "#3054F2"
                          : null,
                    }}
                  />
                  <div className={style.tooltip}>
                    <p>Potwierdź zamówienie</p>
                  </div>
                </button>
                <button
                  onClick={() =>
                    props.updateStateHandler(props.id, "Skompletowano")
                  }
                  disabled={
                    props.record["state"] === "Skompletowano" ||
                    props.record["state"] === "Do wysyłki" ||
                    props.record["state"] === "Zamówiono" ||
                    props.record["state"] === "Dostarczono" ||
                    props.record["state"] === "Wysłano"
                      ? true
                      : false
                  }
                  style={{
                    pointerEvents:
                      props.record["state"] === "Skompletowano" ||
                      props.record["state"] === "Do wysyłki" ||
                      props.record["state"] === "Zamówiono" ||
                      props.record["state"] === "Dostarczono" ||
                      props.record["state"] === "Wysłano"
                        ? "none"
                        : "all",
                  }}
                >
                  <FaClipboardList
                    className={style.icon}
                    style={{
                      color:
                        props.record["state"] === "Skompletowano" ||
                        props.record["state"] === "Do wysyłki" ||
                        props.record["state"] === "Dostarczono" ||
                        props.record["state"] === "Wysłano"
                          ? "#3054F2"
                          : null,
                    }}
                  />
                  <div className={style.tooltip}>
                    <p>Skompletowano</p>
                  </div>
                </button>
                <button
                  onClick={() =>
                    props.updateStateHandler(props.id, "Do wysyłki")
                  }
                  disabled={
                    props.record["state"] === "Do wysyłki" ||
                    props.record["state"] === "Zamówiono" ||
                    props.record["state"] === "Potwierdzono" ||
                    props.record["state"] === "Dostarczono" ||
                    props.record["state"] === "Wysłano"
                      ? true
                      : false
                  }
                  style={{
                    pointerEvents:
                      props.record["state"] === "Do wysyłki" ||
                      props.record["state"] === "Zamówiono" ||
                      props.record["state"] === "Potwierdzono" ||
                      props.record["state"] === "Dostarczono" ||
                      props.record["state"] === "Wysłano"
                        ? "none"
                        : null,
                  }}
                >
                  <BsFillBoxFill
                    className={style.icon}
                    style={{
                      color:
                        props.record["state"] === "Do wysyłki" ||
                        props.record["state"] === "Dostarczono" ||
                        props.record["state"] === "Wysłano"
                          ? "#3054F2"
                          : null,
                    }}
                  />
                  <div className={style.tooltip}>
                    <p>Do wysyłki</p>
                  </div>
                </button>
                <button
                  disabled={
                    props.record["state"] === "Wysłano" ||
                    props.record["state"] === "Dostarczono" ||
                    props.record["state"] === "Do wysyłki" ||
                    props.record["state"] === "Skompletowano" ||
                    props.record["state"] === "Zamówiono" ||
                    props.record["state"] === "Potwierdzono"
                      ? true
                      : false
                  }
                  style={{
                    pointerEvents: "none",
                  }}
                >
                  <FaTruckMoving
                    className={style.icon}
                    style={{
                      color:
                        props.record["state"] === "Wysłano" ||
                        props.record["state"] === "Dostarczono"
                          ? "#3054F2"
                          : null,
                    }}
                  />
                  <div className={style.tooltip}>
                    <p>Wysłano</p>
                  </div>
                </button>
                <button
                  onClick={() =>
                    props.updateStateHandler(props.id, "Dostarczono")
                  }
                  disabled={
                    props.record["state"] === "Zamówiono" ||
                    props.record["state"] === "Potwierdzono" ||
                    props.record["state"] === "Dostarczono" ||
                    props.record["state"] === "Skompletowano" ||
                    props.record["state"] !== "Wysłano"
                      ? true
                      : false
                  }
                  style={{
                    pointerEvents:
                      props.record["state"] === "Zamówiono" ||
                      props.record["state"] === "Potwierdzono" ||
                      props.record["state"] === "Dostarczono" ||
                      props.record["state"] === "Skompletowano" ||
                      props.record["state"] !== "Wysłano"
                        ? "none"
                        : null,
                  }}
                >
                  <BsBuildingFillCheck
                    className={style.icon}
                    style={{
                      color:
                        props.record["state"] === "Dostarczono"
                          ? "#3054F2"
                          : null,
                    }}
                  />
                  <div className={style.tooltip}>
                    <p>Dostarczono</p>
                  </div>
                </button>
                <button
                  onClick={() => props.editHandler(props.id)}
                  disabled={
                    props.record["state"] === "Potwierdzono" ||
                    props.record["state"] === "Skompletowano" ||
                    props.record["state"] === "Wysłano" ||
                    props.record["state"] === "Dostarczono" ||
                    props.record["state"] === "Do wysyłki"
                      ? true
                      : false
                  }
                  style={{
                    pointerEvents:
                      props.record["state"] === "Potwierdzono" ||
                      props.record["state"] === "Skompletowano" ||
                      props.record["state"] === "Wysłano" ||
                      props.record["state"] === "Dostarczono" ||
                      props.record["state"] === "Do wysyłki"
                        ? "none"
                        : "all",
                  }}
                >
                  <FaPen className={style.icon} />
                  <div className={style.tooltip}>
                    <p>Edytuj</p>
                  </div>
                </button>
                <button
                  onClick={() => props.deleteHandler(props.id)}
                  disabled={
                    props.record["state"] === "Potwierdzono" ||
                    props.record["state"] === "Skompletowano" ||
                    props.record["state"] === "Wysłano" ||
                    props.record["state"] === "Dostarczono" ||
                    props.record["state"] === "Do wysyłki"
                      ? true
                      : false
                  }
                  style={{
                    pointerEvents:
                      props.record["state"] === "Potwierdzono" ||
                      props.record["state"] === "Skompletowano" ||
                      props.record["state"] === "Wysłano" ||
                      props.record["state"] === "Dostarczono" ||
                      props.record["state"] === "Do wysyłki"
                        ? "none"
                        : "all",
                  }}
                >
                  <BsTrashFill className={style.icon} />
                  <div className={style.tooltip}>
                    <p>Usuń</p>
                  </div>
                </button>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
};

export default TableRow;
