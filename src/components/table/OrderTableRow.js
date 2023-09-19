import React from "react";
import style from "./TableRow.module.css";
import {
  BsTrashFill,
  BsCheckCircleFill,
  BsBuildingFillCheck,
  BsFillBoxFill,
} from "react-icons/bs";
import { FaClipboardList, FaPen, FaTruckMoving } from "react-icons/fa";

function DeliveryDetailsRow(props) {
  const {
    isClickedRow,
    allowExpand,
    type,
    id,
    products,
    updateStateHandler,
    editHandler,
    deleteHandler,
    record,
  } = props;

  return (
    <>
      {isClickedRow && allowExpand && type === "Orders" && (
        <tr className={style.detailsRow} key={id + "_1"}>
          <td colspan="6">
            <div className={style.wrapper}>
              <div className={style.details}>
                {products &&
                  JSON.parse(JSON.parse(products)).map((item) => (
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
                  onClick={() => updateStateHandler(id, "Potwierdzono")}
                  style={{
                    pointerEvents:
                      record["state"] === "Potwierdzono" ||
                      record["state"] === "Skompletowano" ||
                      record["state"] === "Do wysyłki" ||
                      record["state"] === "Dostarczono" ||
                      record["state"] === "Wysłano"
                        ? "none"
                        : "all",
                  }}
                >
                  <BsCheckCircleFill
                    className={style.icon}
                    style={{
                      color:
                        record["state"] === "Potwierdzono" ||
                        record["state"] === "Skompletowano" ||
                        record["state"] === "Do wysyłki" ||
                        record["state"] === "Dostarczono" ||
                        record["state"] === "Wysłano"
                          ? "#3054F2"
                          : null,
                    }}
                  />
                  <div className={style.tooltip}>
                    <p>Potwierdź zamówienie</p>
                  </div>
                </button>
                <button
                  onClick={() => updateStateHandler(id, "Skompletowano")}
                  disabled={
                    record["state"] === "Skompletowano" ||
                    record["state"] === "Do wysyłki" ||
                    record["state"] === "Zamówiono" ||
                    record["state"] === "Dostarczono" ||
                    record["state"] === "Wysłano"
                      ? true
                      : false
                  }
                  style={{
                    pointerEvents:
                      record["state"] === "Skompletowano" ||
                      record["state"] === "Do wysyłki" ||
                      record["state"] === "Zamówiono" ||
                      record["state"] === "Dostarczono" ||
                      record["state"] === "Wysłano"
                        ? "none"
                        : "all",
                  }}
                >
                  <FaClipboardList
                    className={style.icon}
                    style={{
                      color:
                        record["state"] === "Skompletowano" ||
                        record["state"] === "Do wysyłki" ||
                        record["state"] === "Dostarczono" ||
                        record["state"] === "Wysłano"
                          ? "#3054F2"
                          : null,
                    }}
                  />
                  <div className={style.tooltip}>
                    <p>Skompletowano</p>
                  </div>
                </button>
                <button
                  onClick={() => updateStateHandler(id, "Do wysyłki")}
                  disabled={
                    record["state"] === "Do wysyłki" ||
                    record["state"] === "Zamówiono" ||
                    record["state"] === "Potwierdzono" ||
                    record["state"] === "Dostarczono" ||
                    record["state"] === "Wysłano"
                      ? true
                      : false
                  }
                  style={{
                    pointerEvents:
                      record["state"] === "Do wysyłki" ||
                      record["state"] === "Zamówiono" ||
                      record["state"] === "Potwierdzono" ||
                      record["state"] === "Dostarczono" ||
                      record["state"] === "Wysłano"
                        ? "none"
                        : null,
                  }}
                >
                  <BsFillBoxFill
                    className={style.icon}
                    style={{
                      color:
                        record["state"] === "Do wysyłki" ||
                        record["state"] === "Dostarczono" ||
                        record["state"] === "Wysłano"
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
                    record["state"] === "Wysłano" ||
                    record["state"] === "Dostarczono" ||
                    record["state"] === "Do wysyłki" ||
                    record["state"] === "Skompletowano" ||
                    record["state"] === "Zamówiono" ||
                    record["state"] === "Potwierdzono"
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
                        record["state"] === "Wysłano" ||
                        record["state"] === "Dostarczono"
                          ? "#3054F2"
                          : null,
                    }}
                  />
                  <div className={style.tooltip}>
                    <p>Wysłano</p>
                  </div>
                </button>
                <button
                  onClick={() => updateStateHandler(id, "Dostarczono")}
                  disabled={
                    record["state"] === "Zamówiono" ||
                    record["state"] === "Potwierdzono" ||
                    record["state"] === "Dostarczono" ||
                    record["state"] === "Skompletowano" ||
                    record["state"] !== "Wysłano"
                      ? true
                      : false
                  }
                  style={{
                    pointerEvents:
                      record["state"] === "Zamówiono" ||
                      record["state"] === "Potwierdzono" ||
                      record["state"] === "Dostarczono" ||
                      record["state"] === "Skompletowano" ||
                      record["state"] !== "Wysłano"
                        ? "none"
                        : null,
                  }}
                >
                  <BsBuildingFillCheck
                    className={style.icon}
                    style={{
                      color:
                        record["state"] === "Dostarczono" ? "#3054F2" : null,
                    }}
                  />
                  <div className={style.tooltip}>
                    <p>Dostarczono</p>
                  </div>
                </button>
                <button
                  onClick={() => editHandler(id)}
                  disabled={
                    record["state"] === "Potwierdzono" ||
                    record["state"] === "Skompletowano" ||
                    record["state"] === "Wysłano" ||
                    record["state"] === "Dostarczono" ||
                    record["state"] === "Do wysyłki" ||
                    !props.position
                      ? true
                      : false
                  }
                  style={{
                    pointerEvents:
                      record["state"] === "Potwierdzono" ||
                      record["state"] === "Skompletowano" ||
                      record["state"] === "Wysłano" ||
                      record["state"] === "Dostarczono" ||
                      record["state"] === "Do wysyłki" ||
                      !props.position
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
                  onClick={() => deleteHandler(id)}
                  disabled={
                    record["state"] === "Potwierdzono" ||
                    record["state"] === "Skompletowano" ||
                    record["state"] === "Wysłano" ||
                    record["state"] === "Dostarczono" ||
                    record["state"] === "Do wysyłki" ||
                    !props.position
                      ? true
                      : false
                  }
                  style={{
                    pointerEvents:
                      record["state"] === "Potwierdzono" ||
                      record["state"] === "Skompletowano" ||
                      record["state"] === "Wysłano" ||
                      record["state"] === "Dostarczono" ||
                      record["state"] === "Do wysyłki" ||
                      !props.position
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
}

export default DeliveryDetailsRow;
